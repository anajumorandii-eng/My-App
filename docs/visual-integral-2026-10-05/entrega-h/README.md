# Entrega H — Machado e Modernismo até a geração de 30

Base: `fd4bc49b47112b8a3eeba7886b54060f306c4d5a`, depois da integração da Entrega G (PR #263).
Esta entrega trata oito capítulos do lote LG3; restam 13 (autores de 45 em
diante, poesia concreta, 1960-1980, contemporâneos, lusófonos, artes plásticas,
teatro e cancioneiro). Não promove aprovação editorial.

## Mudanças verificáveis

| Capítulo | Operação central (exemplos autorais) |
| --- | --- |
| Machado de Assis | Separar o fato (sorriso) da dedução (“soube tudo”), com controle manipulável; defunto autor; alforria no testamento. |
| Vanguardas Artísticas | Motor × estátua; frente e perfil simultâneos; acaso dadá × surrealista; locomotiva cubista entre bananeiras. |
| Semana de Arte Moderna | Recepção do soneto e do verso livre; palco heterogêneo; linha 1917–1922–1928. |
| Primeira geração | Poema-piada; soneto devorado que volta modinha; herói de traços contraditórios. |
| Segunda geração: Poesia | Mesmo verso livre com outro tom; repetição que leva a efemeridade ao sujeito; poema que duvida de si. |
| Segunda geração: Prosa | Secura narrativa; usina que engole o engenho; cacimba que seca antes do gado. |
| Fernando Pessoa | Caeiro, Reis, Campos e ortônimo reconhecidos pela visão de mundo; fingimento como elaboração. |
| Drummond | Gauche à margem; jornal que entra no poema; repetição que dá peso ao banal. |

São 40 seções com 906 a 1.048 caracteres, cinco etapas, seis armadilhas com
correção e dois problemas resolvidos por capítulo. Títulos e recalls
preservados; só esses oito registros recebem `rev: 2`. Nenhum verso dos
autores foi reproduzido como exemplo; cada âncora aparece literalmente na seção
citada (teste `LiteratureFoundations.test.tsx`).

Vanguardas, Fernando Pessoa e a Prosa de 30 abriam cenas genéricas (tipologia
e contraste de posições); ganham instrumento de tópico exato. Machado e
Drummond trocam o cartão de autor pela operação de leitura. As frases que as
cenas antigas citam continuam no texto, para que não percam lastro. Matriz:
8 experimentos, 43 pranchas, 336 instrumentos, 226 cenas, zero lacunas.

## Revisão de conteúdo

- Capitu: nem traição nem inocência provadas; a leitura sustenta a dúvida.
- Brás Cubas é livre para ironizar, mas continua vaidoso.
- A Semana é marco entre 1917 e 1928; o exemplo da recepção não relata episódio documentado.
- “Sem nenhum caráter” é sem identidade fixa, não desonestidade.
- O meio no romance de 30 é estrutura social, não determinismo biológico.
- Heterônimo se reconhece pela concepção de mundo; fingir é elaborar.

## Conferência no navegador

Build de produção, 128 configurações (360/390/834/1366, claro/escuro,
movimento normal/reduzido): 128 aprovadas, sem violação axe, texto cortado,
colisão ou overflow horizontal, com Kalam, Newsreader e Inter carregadas.

A primeira rodada reprovou Vanguardas nas 16 configurações: a conclusão
manuscrita de “Futurismo” e de “Dadá × Surrealismo” estava em y=232 e a fonte
Kalam descia abaixo do viewBox de 240. Subi as linhas e conferi de novo.

Safari/iPad físico e estados autenticados reais não foram certificados.
Testes: lint limpo, 922 Node + 1.186 Vitest aprovados.
