# Entrega O — Redação R1

Base: a branch das Entregas L e N (PR #269, integrada). Trata os 16 capítulos
R1 de Redação, oito pares de repertório e análise de tema. Não promove
aprovação editorial.

## Texto

Os dezesseis estavam em revisão 1, com ~300 caracteres por seção. Agora são
80 seções de 900 a 1.100 caracteres, em `rev: 2`, com casos e propostas
autorais declarados, seis armadilhas com correção e dois problemas
resolvidos; o primeiro problema de cada capítulo continua respondendo à
pergunta de recuperação já existente.

Correção de fato: o texto de Cidadania e Poder atribuía a cidadania regulada
a José Murilo de Carvalho. O conceito é de Wanderley Guilherme dos Santos
(1979); Carvalho o usa na leitura histórica. Um teste fixa a atribuição.

Datas e nomes conferidos, entre outros: Acordo de Paris e ODS (2015), PNRS
(2010), Mariana (2015) e Brumadinho (2019), LDB (1996), Fundeb permanente
(2020), Pé-de-Meia (2024), Berlin (1958), Han (2010), Bauman (2000), Mill
(1859), Lei 8.080/1990, Reforma Psiquiátrica (2001), Lei 13.935/2019, ECA
(1990), LEP (1984), Marshall (1950), Ficha Limpa (2010), LAI (2011), Lei
Rouanet (1991), Decreto 3.551/2000, Lei 10.639/2003, Marco Civil (2014),
LGPD (2018), McCombs e Shaw (1972).

## Representação

Os dezesseis reutilizavam a cena LENTE→TESE, trocando só o ícone do domínio.
`WritingOperations.tsx` monta cada cena com dados do próprio capítulo, em seis
formas:

- **conceito escolhido:** o mesmo caso relido por dois ou três conceitos;
- **lei × prática:** a distância entre o escrito e o que acontece;
- **passos:** a adaptação do repertório ao recorte;
- **recorte:** as palavras que restringem o tema e o assunto vizinho riscado;
- **argumentos:** duas dimensões convergindo na tese;
- **intervenção:** agente, ação, meio, finalidade e detalhamento como
  condições; cada elemento retirado vira vaga vazia e muda a contagem.

As configurações antigas de `writingInstrumentLab.ts` para esses 16 ficaram
sem uso no registro; os demais capítulos de Redação (R2/R3) seguem nelas.

## Conferência no navegador

Build de produção, 256 configurações (16 capítulos × 360/390/834/1366 ×
claro/escuro × movimento normal/reduzido): 256 aprovadas, sem violação axe,
texto cortado, colisão ou overflow, com as fontes reais carregadas.
Safari/iPad físico e estados autenticados não certificados.

Testes: lint limpo, 922 Node + 1.338 Vitest aprovados.
