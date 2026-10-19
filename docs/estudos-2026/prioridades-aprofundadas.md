# Prioridades FUVEST: corpus 2022–2026 e exame 2027

A aba começa pela leitura de 15 cadernos oficiais: 680 questões e cinco propostas de redação. Duas anuladas permanecem na auditoria e saem das frequências. As 448 questões válidas da primeira fase, 50 questões de Português, cinco propostas e 180 questões do banco completo do segundo dia têm escopos separados.

- [Relatório completo, tabelas anuais e fontes](fuvest-incidencia/relatorio-2022-2026.md)
- [Estratégias e conexões com exemplos reais](fuvest-incidencia/estrategias-2027.md)
- [Mudanças e regras oficiais de 2027](fuvest-2027-regras-verificadas.md)

Cada item tem fonte/página, síntese, assunto principal, subassuntos, justificativa, habilidades, estratégia e erro a evitar. A classificação é editorial. A leitura das fontes foi complementada por revisão de habilidades e conexões, harmonização de subassuntos e revisão amostral de 60 itens; não houve dupla codificação independente de todo o corpus.

## Denominadores e Medicina

Um assunto principal por questão evita duplicação. Subassuntos e conexões são presenças múltiplas. A frequência é n/N da matéria e recorte, sem prever a próxima prova. Recorrência usa as cinco edições cobertas, incluindo anos com zero ocorrência. O filtro de confiança alta conserva o denominador.

Medicina tem três históricos distintos: em 2022–2024, São Paulo respondeu B/F/Q primeiras quatro; Bauru B/G/Q primeiras quatro; Ribeirão Preto B/F/G/Q primeiras três. Em 2025–2026 todos responderam B/F/G/Q primeiras três. Cada campus tem 60 itens em cinco edições, mas as seleções diferem. A interface permite escolher cada um e o relatório/CSV os exportam separadamente. Para 2027 B/F/G/Q está confirmado; a numeração futura não é presumida.

A prioridade pessoal conserva sinais de domínio e revisão separados do histórico. Não infere campus pelo nome Medicina. O banco completo é o padrão explícito nesse painel; Ribeirão Preto é uma opção identificada. Para comparar campi, use a tabela de incidência.

## Reprodução e integração

`node --import tsx scripts/buildFuvestIncidence.ts` valida cinco arquivos anuais, cobertura, números, fontes/hashes e taxonomia; gera corpus, contagens, CSVs e relatório. Os arquivos públicos ficam em `public/analises/fuvest/`. As 683 fichas FUVEST válidas substituem as antigas amostras na evidência do app, preservando 198 fichas de outras bancas (881 fichas e 22 recortes no total).

O catálogo curricular de 109 tópicos e 628 capítulos continua como complemento; ele não equivale a 628 incidências medidas. Ausência de contagem principal não retira conteúdo do programa. Não se estima dificuldade, taxa de acerto, chance de aprovação ou retorno por minuto sem dados específicos.
