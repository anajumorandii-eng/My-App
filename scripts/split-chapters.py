#!/usr/bin/env python3
"""Divide o texto OCR'd de uma apostila em blocos de texto, casando cada
marcador de capítulo com o capítulo real mais provável e agregando o
resultado por tópico (Topic.chapters do app).

Por que casar por capítulo (não por tópico) e só agregar depois: o
cabeçalho de cada capítulo no corpo (a palavra "CAPÍTULO" sozinha numa
linha, seguida do título em fonte estilizada) sai com OCR muito ruim, e
cada página de conteúdo só toca UM capítulo por vez — se o vocabulário de
comparação fosse o de todos os capítulos de um tópico somados, o
denominador fica grande e a pontuação de uma página que só bate com um
capítulo específico do tópico fica artificialmente baixa. Comparando
capítulo a capítulo (vocabulário pequeno e específico) a pontuação fica
nítida, e só depois de identificado o capítulo é que o resultado sobe pro
tópico correspondente.

Uso: split-chapters.py <materia> <arquivo-texto-ocr> <arquivo-saida.json> <topicos-conhecidos.json>
"""
import json
import re
import sys
import unicodedata

STOPWORDS = {'de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o', 'as', 'os', 'em', 'para', 'com', 'no', 'na', 'ou', 'um', 'uma'}


def normalize(text: str) -> str:
    text = unicodedata.normalize('NFKD', text)
    text = ''.join(c for c in text if not unicodedata.combining(c))
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()


def stem(word: str) -> str:
    """Stemmer bem simples (corta plural/gênero) só pra evitar que
    "químico"/"química"/"químicos"/"químicas" contem como 4 palavras
    diferentes na contagem de frequência — sem isso, cada variante
    individualmente escapa do corte de "palavra comum demais"."""
    if word.endswith('s') and len(word) > 4:
        word = word[:-1]
    if word.endswith(('a', 'o')) and len(word) > 4:
        word = word[:-1]
    return word


def significant_words(text: str) -> list[str]:
    return [stem(w) for w in normalize(text).split() if len(w) >= 4 and w not in STOPWORDS]


def flatten_chapters(topics: list[dict]) -> list[dict]:
    """[{id, name, chapters:[...]}] -> [{topicId, title}] (um por capítulo)."""
    out = []
    for t in topics:
        for ch in t.get('chapters', []) or [t['name']]:
            out.append({'topicId': t['id'], 'title': ch})
    return out


def parse_pages(text: str):
    """Retorna lista de (numero_pagina, texto_pagina) na ordem do arquivo."""
    parts = re.split(r'\n?--- página (\d+) ---\n?', text)
    pages = []
    for i in range(1, len(parts), 2):
        page_num = int(parts[i])
        page_text = parts[i + 1] if i + 1 < len(parts) else ''
        pages.append((page_num, page_text))
    return pages


def find_chapter_markers(pages):
    """Páginas onde 'CAPÍTULO' aparece sozinho numa linha (cabeçalho de capítulo).

    OCR derruba o acento com frequência ("CAPITULO"), por isso a comparação
    usa a mesma normalização (sem acento, minúsculo) usada pro vocabulário.
    """
    markers = []
    for idx, (page_num, page_text) in enumerate(pages):
        for line in page_text.splitlines():
            if normalize(line) == 'capitulo':
                markers.append(idx)
                break
    return markers


def build_idf_weights(chapters: list[dict]) -> dict[str, float]:
    """Palavras que aparecem em vários capítulos (ex.: "química") não ajudam
    a distinguir um capítulo do outro — pesa mais as palavras raras, e
    ignora de vez (peso 0) as que aparecem em 30%+ dos capítulos: numa
    apostila de uma só matéria, palavras do nome da própria matéria são
    universais."""
    doc_count: dict[str, int] = {}
    for ch in chapters:
        for w in set(significant_words(ch['title'])):
            doc_count[w] = doc_count.get(w, 0) + 1
    threshold = max(2, len(chapters) * 0.3)
    return {w: (0.0 if c >= threshold else 1.0 / c) for w, c in doc_count.items()}


def match_chapter(window_text: str, chapters: list[dict], idf: dict[str, float]) -> tuple[dict, float] | None:
    norm_window = normalize(window_text)
    scored = []
    for ch in chapters:
        words = significant_words(ch['title'])
        useful_words = [w for w in words if idf.get(w, 1.0) > 0]
        if not useful_words:
            continue
        total_weight = sum(idf.get(w, 1.0) for w in useful_words)
        hits = [w for w in useful_words if w in norm_window]
        hit_weight = sum(idf.get(w, 1.0) for w in hits)
        scored.append((ch, hit_weight / total_weight, len(hits)))
    if not scored:
        return None
    scored.sort(key=lambda x: x[1], reverse=True)
    best_ch, best_score, best_hits = scored[0]
    second_score = scored[1][1] if len(scored) > 1 else 0.0
    # Exige confiança mínima, margem clara sobre o 2º colocado, e pelo menos
    # 2 palavras distintas batendo — uma coincidência isolada não conta.
    min_hits = 1 if len(significant_words(best_ch['title'])) <= 2 else 2
    if best_score >= 0.55 and (best_score - second_score) >= 0.15 and best_hits >= min_hits:
        return best_ch, best_score
    return None


def split_file(subject: str, ocr_path: str, topics: list[dict]) -> dict:
    with open(ocr_path, encoding='utf-8', errors='replace') as f:
        full_text = f.read()

    chapters = flatten_chapters(topics)
    idf = build_idf_weights(chapters)
    volumes = re.split(r'\n?===== ARQUIVO: (.+?) =====\n?', full_text)
    by_topic: dict[str, list[dict]] = {t['id']: [] for t in topics}
    unmatched_windows = []
    matched_chapter_titles = set()

    for i in range(1, len(volumes), 2):
        vol_name = volumes[i]
        vol_text = volumes[i + 1] if i + 1 < len(volumes) else ''
        pages = parse_pages(vol_text)
        if not pages:
            continue
        marker_indices = find_chapter_markers(pages)

        assigned = []  # (chapter, start_idx)
        for m_idx in marker_indices:
            # Só o começo da página do marcador (banner + primeiro parágrafo)
            # — texto mais adiante já é conteúdo corrido e pode mencionar de
            # passagem outro capítulo (nota de rodapé, referência cruzada),
            # gerando falso positivo se olhássemos a página toda.
            window = pages[m_idx][1][:600]
            match = match_chapter(window, chapters, idf)
            if match:
                ch, score = match
                assigned.append((ch, m_idx))
                matched_chapter_titles.add(ch['title'])
            else:
                unmatched_windows.append({'volume': vol_name, 'page': pages[m_idx][0], 'preview': window[:200]})

        for j, (ch, start_idx) in enumerate(assigned):
            end_idx = assigned[j + 1][1] - 1 if j + 1 < len(assigned) else len(pages) - 1
            chapter_pages = pages[start_idx:end_idx + 1]
            text = '\n'.join(p[1] for p in chapter_pages)
            by_topic[ch['topicId']].append({
                'chapter': ch['title'],
                'volume': vol_name,
                'startPage': pages[start_idx][0],
                'endPage': pages[end_idx][0],
                'text': text.strip(),
            })

    empty_topics = [t['id'] for t in topics if not by_topic[t['id']]]
    missing_chapters = [ch['title'] for ch in chapters if ch['title'] not in matched_chapter_titles]
    return {
        'subject': subject,
        'topics': by_topic,
        'unmatched': unmatched_windows,
        'emptyTopics': empty_topics,
        'missingChapters': missing_chapters,
    }


if __name__ == '__main__':
    subject, ocr_path, out_path, known_path = sys.argv[1:5]
    with open(known_path, encoding='utf-8') as f:
        known_topics = json.load(f)
    output = split_file(subject, ocr_path, known_topics)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    covered = sum(1 for t in known_topics if output['topics'][t['id']])
    total_chapters = sum(len(t.get('chapters') or [t['name']]) for t in known_topics)
    print(f"Tópicos com conteúdo: {covered}/{len(known_topics)}")
    print(f"Capítulos identificados: {total_chapters - len(output['missingChapters'])}/{total_chapters}")
    print(f"Marcadores não identificados: {len(output['unmatched'])}")
    print(f"Tópicos sem nenhum trecho encontrado: {output['emptyTopics']}")
