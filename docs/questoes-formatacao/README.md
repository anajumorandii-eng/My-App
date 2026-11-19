# Formatação dos enunciados

A caixa do enunciado na tela de questões acompanha a largura das alternativas.
O componente de leitura separa blocos por linhas em branco e preserva quebras
simples dentro de cada bloco, incluindo versos e tabelas textuais. Palavras
longas podem quebrar para respeitar a largura disponível.

Na questão `ap_hisbra_unesp_003`, as palavras e a pontuação foram preservadas;
apenas espaços foram convertidos em quebras de linha para separar versos,
omissão, referência e comando. A divisão dos versos foi conferida com o
mesmo poema já transcrito no banco (`unesp_2023_v1_q09`), preservando a versão
abreviada da apostila, sem substituí-la pelo soneto integral.

## Conferência

Capturas da rota real `/questoes?topic=his_brasil_colonia`, filtrada pelo início
do poema, em Chromium. Largura do enunciado igual à das alternativas:

| Janela | Enunciado | Rolagem horizontal |
| --- | --- | --- |
| 390×844 | 308 px | não |
| 834×1112 | 740 px | não |
| 1366×900 | 1016 px | não |

Conferidos tema claro e escuro, parágrafos, versos, referência e comando.
As capturas completas incluem os controles fixos de navegação já existentes.
O ambiente usa o banco local sem conta conectada. A apresentação dos textos
sem quebras na origem continua corrida; nenhuma heurística inventa divisões.
