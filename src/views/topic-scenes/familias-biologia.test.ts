import { describe, it, expect } from 'vitest';
import chapters from '../../data/deepSummaryContent.json';
import { summaryCurriculum } from '../../data/summaryCurriculum';
import { biologia, biologiaSemCena } from './data/biologia';

// Biologia usa o `id` do currículo como chapterId (sem prefixo `summary-`,
// ao contrário de Geografia/História/Sociologia/Filosofia) — convenção
// fixada pela Parte A do inventário e mantida aqui. O catálogo real é
// cruzado por título entre deepSummaryContent.json (subject === 'Biologia')
// e summaryCurriculum.ts, tal como o inventário determinou.
type DeepChapter = { subject: string; topic: string };
const topicsDeBiologia = new Set((chapters as DeepChapter[]).filter((c) => c.subject === 'Biologia').map((c) => c.topic));
const capitulosDeBiologia = summaryCurriculum
  .find((item) => item.subject === 'Biologia')!
  .topics.filter((t) => topicsDeBiologia.has(t.title))
  .map((t) => t.id);

// O inventário (Parte A + Parte B, docs/visual-personalizado/15-familias-biologia.md)
// já decidiu família ou lacuna para os 72 capítulos, mas a escrita das
// SceneEntry reais fica para uma task futura — por isso `biologia` continua
// vazio nesta fase, e só os capítulos com família atribuída (sem cena ainda
// escrita) aparecem nesta lista auxiliar, só para provar que o inventário
// fecha os 72 capítulos sem lacuna nem duplicata.
const chapterIdsComFamiliaAtribuidaSemCenaAinda = [
  // Parte A — tipologia (9)
  'biologia-algas', 'biologia-anelideos', 'biologia-biomas-brasileiros', 'biologia-ciclos-de-vida',
  'biologia-composicao-quimica-celular-carboidratos-e-lipidios', 'biologia-dinamica-de-populacoes',
  'biologia-equinodermos', 'biologia-especies-invasoras-e-controle-biologico', 'biologia-ciclo-hidrologico-e-poluicao-da-agua',
  // Parte A — cadeia-de-derivacao (12)
  'biologia-bioenergetica-fermentacao-e-respiracao', 'biologia-bioenergetica-fotossintese-e-quimiossintese',
  'biologia-biomagnificacao', 'biologia-ciclo-do-nitrogenio', 'biologia-composicao-quimica-celular-proteinas-e-sua-funcao-estrutural',
  'biologia-coordenacao-endocrina-ii', 'biologia-coordenacao-nervosa-ii', 'biologia-divisao-celular',
  'biologia-embriologia-animal', 'biologia-eutrofizacao', 'biologia-fisiologia-vegetal-transporte-no-floema',
  'biologia-fisiologia-da-coordenacao-nervosa-i',
  // Parte A — escala-de-graus (2)
  'biologia-classificacao-biologica-nomenclatura-cientifica-e-nocoes-de-sistematica-filogenetica', 'biologia-cordados-tetrapodes',
  // Parte A — contraste-de-posicoes (1)
  'biologia-evolucao-biologica-construcao-historica',
  // Parte B — tipologia (8)
  'biologia-fungos', 'biologia-heranca-sexual', 'biologia-mecanismos-da-evolucao-biologica', 'biologia-moluscos',
  'biologia-mutacoes-genicas', 'biologia-protozoarios-e-protozooses', 'biologia-sangue-e-imunologia',
  'biologia-segunda-lei-de-mendel-e-interacao-genica',
  // Parte B — cadeia-de-derivacao (5)
  'biologia-fisiologia-da-digestao', 'biologia-fisiologia-da-excrecao', 'biologia-origem-da-vida-e-as-primeiras-celulas',
  'biologia-traqueofitas-transpiracao-e-reposicao-rapida-de-agua', 'biologia-virus',
  // Parte B — escala-de-graus (2)
  'biologia-plantas-terrestres-i-briofitas-e-pteridofitas', 'biologia-sucessao-ecologica',
];

describe('Inventário de família em Biologia (Parte A + Parte B)', () => {
  it('o inventário decidido (família atribuída + lacuna) fecha os 72 capítulos, sem duplicata', () => {
    const decididos = [...chapterIdsComFamiliaAtribuidaSemCenaAinda, ...biologiaSemCena.map((g) => g.chapterId)];
    expect(new Set(decididos).size, 'nenhum capítulo decidido duas vezes').toBe(decididos.length);
    expect([...decididos].sort()).toEqual([...capitulosDeBiologia].sort());
  });

  it('só cita capítulos que existem no catálogo real', () => {
    const ids = new Set(capitulosDeBiologia);
    for (const id of chapterIdsComFamiliaAtribuidaSemCenaAinda) expect(ids.has(id), id).toBe(true);
    for (const gap of biologiaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo específico (não genérico) para cada lacuna', () => {
    for (const gap of biologiaSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });

  it('conta 33 lacunas no total (12 da Parte A + 21 da Parte B)', () => {
    expect(biologiaSemCena.length).toBe(33);
  });

  it(
    'teste de completude de produção (biologia + biologiaSemCena) ainda falha: ' +
      'a escrita das SceneEntry reais é uma task futura, então `biologia` continua vazio nesta fase',
    () => {
      const atribuidosEmProducao = [...biologia.map((e) => e.chapterId), ...biologiaSemCena.map((g) => g.chapterId)];
      expect(biologia.length).toBe(0);
      expect(atribuidosEmProducao.length).not.toBe(capitulosDeBiologia.length);
      expect(atribuidosEmProducao.length).toBe(biologiaSemCena.length);
    },
  );
});
