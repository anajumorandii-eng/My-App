# Abas da banca sem esperar o banco de questões

Antes, as abas "O que mais cai" e "Simulado" só apareciam depois que as 7.150
questões terminavam de carregar. No iPad, a fileira passava de 5 para 7 abas
alguns segundos depois da entrada.

Captura em Chromium (Playwright), com o `questions.json` atrasado em 4 s para
reproduzir a entrada lenta:

| Captura | Momento | Abas |
| --- | --- | --- |
| `abas-durante-carga.png` | banco ainda carregando | as 7 |
| `abas-depois-da-carga.png` | banco carregado | as mesmas 7, na mesma ordem |

A fileira não muda mais de tamanho. Abrir "O que mais cai" ou "Simulado"
durante a carga mostra "Carregando as provas…", o aviso que já existia.
