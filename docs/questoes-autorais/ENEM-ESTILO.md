# Questões autorais no estilo do ENEM

Base: as 1.440 questões reais de 2018–2025 do banco, as 906 questões de
2019–2023 do caderno oficial (lidas só para medir, fora do repositório) e o
estudo de incidência em `docs/estudos-2026/enem-incidencia/`
(`probabilidades-2026.json` e `padroes-de-questao.md`). As questões são escritas
do zero: nenhum texto-base, alternativa ou resolução é copiado de prova,
apostila ou material de cursinho.

## O que muda em relação ao estilo FUVEST

A FUVEST (`FUVEST-1FASE-ESTILO.md`) e o ENEM pedem questões diferentes na forma,
não só no assunto:

| Traço | ENEM (medido) | FUVEST (medido) |
|---|---|---|
| Enunciado mediano | ~690 caracteres | ~840 |
| Alternativa mediana | ~34 caracteres (Matemática 6, Natureza 17, Humanas 34, Linguagens 56) | ~94 |
| Alternativas em ordem crescente de tamanho | 44% das questões (o acaso daria 1 em 120) | sem padrão |
| Alternativas numéricas em ordem crescente | 77% | maioria |
| Texto-base com fonte citada | 53% | 47% |
| Questão com figura | 36% | 39% |
| Comando que completa a frase | 82% | 76% |

Daí as regras do ENEM:

- **Alternativa curta, sintagma com ponto final.** "Concentração de terras.",
  "Decantação e filtração.", "R$ 106,00." A justificativa ("X, pois…") é marca
  da FUVEST e fica no comentário, não na alternativa.
- **Ordem pela forma.** Alternativas textuais saem ordenadas pelo tamanho, e as
  numéricas, pelo valor. A letra da resposta é consequência dessa ordem, e o
  gerador (`comum_enem.E`) escreve as pegadinhas por letra depois de ordenar.
  O gabarito do lote é conferido depois: todas as cinco letras, nenhuma acima
  de 30%. A resposta varia de posição (às vezes a mais curta, às vezes a mais
  longa), para que o tamanho não denuncie a correta.
- **Situação-problema do cotidiano.** Conta de água, bula de remédio, mapa de
  trilha, aquário, festival de cinema, cartaz de doação de sangue. O conteúdo é
  a ferramenta para resolver a situação, como no padrão "unidades antes de
  qualquer conta" de `padroes-de-questao.md`.
- **Texto-base antes do comando, com a origem logo abaixo.** No ENEM a
  referência fica entre o texto e o comando. Aqui, o texto escrito pelo CRIVO
  traz "Texto elaborado para esta questão." no mesmo lugar, e dados hipotéticos,
  "Dados ilustrativos.". Fonte real só entra conferida e em domínio público (o
  art. 98 da Constituição de 1824; os versos de abertura da "Canção do exílio").
  Inventar referência no formato "SOBRENOME, I. Título. Cidade: Editora, ano"
  seria o mesmo erro de inventar enunciado.
- **Figura descrita em palavras.** Sem imagem própria, o cartaz, a tabela e o
  quadro entram como descrição ou como lista no próprio texto.
- **Inglês com comando e alternativas em português**, como na prova.

## Os distratores

Em Linguagens e Humanas, cada alternativa errada tem um dos cinco vícios
listados em `padroes-de-questao.md` (seção 11): contradição, redução,
extrapolação, generalização ou fuga. O comentário diz qual é.

Em Matemática e Natureza, cada valor errado sai de um erro concreto: a base da
porcentagem, a casa decimal na conversão, o diâmetro no lugar do raio, a lista
não ordenada na mediana, a condição invertida na probabilidade, o coeficiente
esquecido na estequiometria. O comentário mostra a conta que leva a ele.

## Distribuição de cada lote de 50

As quatro provas objetivas têm 45 questões cada. Um lote de 50 segue essa
proporção, com tolerância de 5 pontos por área, que o teste confere:
Matemática 12; Linguagens 12 (Português 11, Inglês 1); Natureza 13
(Biologia 5, Física 4, Química 4); Humanas 13 (Geografia 4, História 4,
Sociologia 3, Filosofia 2).

Dentro de cada matéria, os capítulos saem dos de maior chance histórica em
`probabilidades-2026.json`: razão, proporção e porcentagem, probabilidade,
estatística e geometria espacial em Matemática; tecnologias digitais, gêneros
não verbais e variação linguística em Linguagens; ecologia, biotecnologia,
calorimetria, circuitos, separação de misturas e cinética em Natureza; espaço
agrário e urbano, Brasil Império, Era Vargas, cultura e etnocentrismo em
Humanas.

## Comentário

O comentário segue o formato das autorais FUVEST: abre com "Resposta X.", traz
a resolução completa e uma linha por alternativa errada dizendo qual erro leva
a ela.

## Teste

`src/lib/crivoAuthoredQuestions.test.ts` confere em cada lote ENEM:

- enunciado mediano de pelo menos 600 caracteres;
- alternativa mediana entre 20 e 60 caracteres;
- pelo menos 40% das questões com alternativas em ordem crescente de tamanho;
- alternativas numéricas sempre em ordem crescente;
- ponto final em toda alternativa;
- origem declarada em todo enunciado;
- proporção das quatro áreas.

Vale também tudo o que já vale para as autorais FUVEST: gabarito distribuído,
comentário pela resposta, `styleOf` sem `examSource` e capítulo existente no
currículo.

## Como acrescentar um lote

1. Gerar `scripts/data/crivo-enem-loteN.json`, com `skill` e `trap` em cada
   questão.
2. `python3 scripts/aplicar-questoes-autorais.py scripts/data/crivo-enem-loteN.json`.
3. Atualizar a contagem do banco em `src/lib/questionBankContent.test.ts` e no
   `CLAUDE.md`.

O enunciado abre com "Questão autoral CRIVO · estilo ENEM.", e os ids são
`crivo_enem_l{N}_{XX}`.

## Lote 1 (50 questões)

Gabarito: A 9, B 12, C 9, D 9, E 11. Enunciado mediano de 602 caracteres;
alternativa mediana de 45. É mais longa que a mediana geral da banca, porque o
lote não tem as alternativas de um só número que derrubam a mediana real em
Matemática.
