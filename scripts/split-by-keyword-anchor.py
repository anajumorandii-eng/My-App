#!/usr/bin/env python3
"""Divide o texto OCR'd de uma apostila em blocos por tópico quando não há
marcador de capítulo detectável (formato diferente do "CAPÍTULO" isolado
numa linha — ver split-chapters.py). Em vez de achar onde um capítulo
COMEÇA, acha a página onde as palavras-chave de cada capítulo aparecem com
mais concentração (a "âncora" daquele assunto no documento), ordena os
capítulos pela posição dessas âncoras, e fatia o texto nos pontos médios
entre âncoras consecutivas.

É estrutural e bem mais aproximado que split-chapters.py — serve como
fallback quando o formato do "caderno" não segue o padrão Anglo com
"CAPÍTULO" isolado.

Uso: split-by-keyword-anchor.py <materia> <arquivo-texto-ocr> <arquivo-saida.json> <topicos-conhecidos.json>
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
    if word.endswith('s') and len(word) > 4:
        word = word[:-1]
    if word.endswith(('a', 'o')) and len(word) > 4:
        word = word[:-1]
    return word


def significant_words(text: str) -> list[str]:
    return [stem(w) for w in normalize(text).split() if len(w) >= 4 and w not in STOPWORDS]


def flatten_chapters(topics: list[dict]) -> list[dict]:
    out = []
    for t in topics:
        for ch in t.get('chapters', []) or [t['name']]:
            out.append({'topicId': t['id'], 'title': ch})
    return out


def parse_pages(text: str):
    parts = re.split(r'\n?--- página (\d+) ---\n?', text)
    pages = []
    for i in range(1, len(parts), 2):
        page_num = int(parts[i])
        page_text = parts[i + 1] if i + 1 < len(parts) else ''
        pages.append((page_num, page_text))
    return pages


def build_idf_weights(chapters: list[dict]) -> dict[str, float]:
    doc_count: dict[str, int] = {}
    for ch in chapters:
        for w in set(significant_words(ch['title'])):
            doc_count[w] = doc_count.get(w, 0) + 1
    threshold = max(2, len(chapters) * 0.3)
    return {w: (0.0 if c >= threshold else 1.0 / c) for w, c in doc_count.items()}


def score_page(norm_page_text: str, words: list[str], idf: dict[str, float]) -> float:
    return sum(idf.get(w, 1.0) for w in words if w in norm_page_text)


def split_file(subject: str, ocr_path: str, topics: list[dict]) -> dict:
    with open(ocr_path, encoding='utf-8', errors='replace') as f:
        full_text = f.read()

    chapters = flatten_chapters(topics)
    idf = build_idf_weights(chapters)
    volumes = re.split(r'\n?===== ARQUIVO: (.+?) =====\n?', full_text)

    # Concatena todas as páginas de todos os volumes numa lista única
    # (volume, pagina, texto) — a ordem dos arquivos já reflete a ordem de
    # leitura (volume 1, 2, 3, 4).
    all_pages = []
    for i in range(1, len(volumes), 2):
        vol_name = volumes[i]
        vol_text = volumes[i + 1] if i + 1 < len(volumes) else ''
        for page_num, page_text in parse_pages(vol_text):
            all_pages.append((vol_name, page_num, page_text, normalize(page_text)))

    if not all_pages:
        return {'subject': subject, 'topics': {t['id']: [] for t in topics}, 'anchors': []}

    # Pra cada capítulo, acha a página com maior pontuação (soma de janela de
    # 3 páginas, pra suavizar ruído de OCR concentrado numa página só).
    anchors = []
    for ch in chapters:
        words = significant_words(ch['title'])
        if not words:
            continue
        best_idx, best_score = None, 0.0
        for idx in range(len(all_pages)):
            window_text = ' '.join(all_pages[j][3] for j in range(idx, min(idx + 3, len(all_pages))))
            s = score_page(window_text, words, idf)
            if s > best_score:
                best_idx, best_score = idx, s
        if best_idx is not None and best_score > 0:
            anchors.append({'topicId': ch['topicId'], 'chapter': ch['title'], 'pageIdx': best_idx, 'score': best_score})

    anchors.sort(key=lambda a: a['pageIdx'])

    by_topic: dict[str, list[dict]] = {t['id']: [] for t in topics}
    for j, anchor in enumerate(anchors):
        start_idx = anchor['pageIdx']
        end_idx = anchors[j + 1]['pageIdx'] - 1 if j + 1 < len(anchors) else len(all_pages) - 1
        if end_idx < start_idx:
            end_idx = start_idx
        text = '\n'.join(all_pages[k][2] for k in range(start_idx, end_idx + 1))
        by_topic[anchor['topicId']].append({
            'chapter': anchor['chapter'],
            'volume': all_pages[start_idx][0],
            'startPage': all_pages[start_idx][1],
            'endPage': all_pages[end_idx][1],
            'text': text.strip(),
        })

    empty_topics = [t['id'] for t in topics if not by_topic[t['id']]]
    return {'subject': subject, 'topics': by_topic, 'emptyTopics': empty_topics, 'anchorCount': len(anchors)}


if __name__ == '__main__':
    subject, ocr_path, out_path, known_path = sys.argv[1:5]
    with open(known_path, encoding='utf-8') as f:
        known_topics = json.load(f)
    output = split_file(subject, ocr_path, known_topics)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    covered = sum(1 for t in known_topics if output['topics'][t['id']])
    print(f"Tópicos com âncora encontrada: {covered}/{len(known_topics)}")
    print(f"Total de âncoras (capítulos): {output.get('anchorCount', 0)}")
    print(f"Tópicos sem nenhuma âncora: {output['emptyTopics']}")
