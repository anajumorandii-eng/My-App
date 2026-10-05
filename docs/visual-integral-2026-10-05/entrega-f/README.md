# Entrega F — fundamentos de Literatura

Base: `683a573204f92adc247d1493caaa08ad9de9b799`, depois da integração da
PR #261. CI e preview dessa PR foram confirmados como aprovados. Esta entrega
trata oito capítulos do lote LG3; os outros 29 continuam na fila. O recorte
reúne operações de leitura e primeiras escolas, com texto e demonstração
validados juntos. Não encerra Literatura nem promove aprovação editorial.

## Mudanças verificáveis

| Capítulo | Objeto e operação central |
| --- | --- |
| A Arte e suas Linguagens | Ausência reconstruída pela palavra, cadeira vazia e interrupção sonora; desgaste/preço e leitura contextual. |
| Texto Literário x Texto não Literário | Portão verificável ou personificado; a cidade sem sombras exige pactos diferentes no conto e na notícia. |
| Elementos da Narrativa | Encontro/hesitação/devolução com ordem do relato manipulável; declaração/inferência, duração e acesso à mente. |
| Trovadorismo e Humanismo | Voz e interlocutor nas líricas; elogio invertido/ataque direto nas satíricas; fala e gesto contraditórios no teatro. |
| Renascimento e Camões | Polos antitéticos ou experiência paradoxal; glória marítima e contraponto dos custos da partida. |
| Brasil: Primeiros Registros | Observar, julgar e propor numa frase colonial autoral; alegoria transforma regra moral em disputa cênica. |
| A Estética Barroca | Reordenar sintaxe sem eliminar a imagem; definição/condição/conclusão do argumento; desejo e temor. |
| A Estética Neoclássica | Cortar redundância preservando “sereno”; campo ideal comparado a colheita, troca e dívida. |

Os 40 textos têm 936–1.096 caracteres, cinco etapas, seis armadilhas com
correção e dois problemas resolvidos por capítulo. Títulos e recalls foram
preservados. Só esses oito registros receberam `rev: 2`; os IDs das seções
mudam apenas para eles, usando o mecanismo editorial já existente. Não há
migração, reset ou escrita no progresso real.

Os exemplos são didáticos autorais, declarados na interface. Não foram usados
PDFs, recortes, resoluções de terceiros ou dados da conta da estudante.
As citações de lastro apontam literalmente para o texto do capítulo. A entrada
antiga das cantigas foi reconciliada com as ressalvas sobre escárnio/maldizer.

## Revisão de conteúdo e implementação

- Nome próprio não é regra absoluta para separar escárnio e maldizer;
  analisar modo de ataque e predomínio. Voz feminina não identifica autora.
- Terceira pessoa não garante onisciência; flashback e duração psicológica
  são critérios diferentes; protagonismo e complexidade também.
- Função poética não é exclusiva da literatura, nem ficção requisito de
  toda literatura. A plurissignificação exige sustentação textual.
- Camões combina formas líricas; regularidade não elimina conflito. O Velho
  do Restelo tensiona a celebração, sem cancelar automaticamente a epopeia.
- Registros coloniais não inauguram todas as expressões culturais do
  território. Função documental não elimina estilo; performance indígena
  não pode ser apagada por “primeiro teatro” em sentido absoluto.
- Lemas árcades são procedimentos, não senhas; cortar o supérfluo não
  significa eliminar todos os adjetivos. Vínculos políticos são individuais.

Texto Literário permanece no experimento prioritário `literary`: a nova
operação foi integrada nele, pois um instrumento adicional ficaria oculto
pelo resolvedor. Seis instrumentos antigos recebem operações novas mantendo
os IDs; Trovadorismo ganha `medieval-voices` com tópico exato. A matriz passa
a 8 experimentos, 43 pranchas, 332 instrumentos e 230 cenas, sem lacunas.
O inventário de qualidade mantém seus estados formais; presença e teste
automático não equivalem a aprovação editorial.

Motion anima reordenação, recorte, relações e foco no trecho. A duração é
zero em movimento reduzido, com a mesma informação estática. Os controles
expõem nomes, estado pressionado e foco; a janela do desenho oferece toque,
setas, Home/End e botões equivalentes. O par do BoardShell continua ligado
aos nós 1 e 2; o diagnóstico mantém a evidência usada nos demais modos.
Os rótulos de achado no desenho usam Kalam e apontam o efeito específico,
como ausência/duração ou condição econômica, além da orientação geral da
oficina. Fontes e dimensões foram conferidas novamente após esse ajuste.
O tema tecnológico impunha Space Grotesk no SVG com um seletor mais específico;
o probe de `font-before.json` reproduziu essa família efetiva, apesar da
declaração local de Kalam. A regra foi corrigida somente nos rótulos de achado.

## Problemas reproduzidos durante a validação

Uma primeira rodada no celular mostrou overflow de 243–271 px: a largura
intrínseca do SVG ampliava ancestrais da cena. A correção contém o tamanho
inline, limita os wrappers e mantém a rolagem apenas dentro da janela do
desenho. Não foi escondida a rolagem da página com um bloqueio global.

Os testes também detectaram a precedência do experimento de Texto Literário;
a proposta foi integrada no caminho efetivamente exibido. Dois ajustes do
runner foram necessários: aguardar o chunk inicial por até 60 segundos e
consultar o controle pela classe após seu nome mudar ao ser acionado.
Uma leitura prematura do HTML durante a animação nativa de opacidade foi
substituída por espera de conclusão, sem alterar o critério de mudança.
O runner reutiliza a página e navega entre capítulos pela rota do app;
retomada opcional só deve ser usada sobre a mesma build. A rodada final após
o ajuste das anotações começou de novo, sem mesclar resultados de fontes diferentes.
Tentativas anteriores não são apresentadas como aprovadas. Testes de
opacidade de SVG conferem o atributo animado, em vez de exigir CSS inline.
Na revisão de movimento, as setas tinham alvo constante sem animação de
entrada. Elas passaram a percorrer a relação ao trocar seu traçado, com
estado completo imediato em movimento reduzido. A rodada final também
observa alterações do SVG durante movimento normal, além de conferir o
resultado estático; a declaração de Motion sozinha não foi usada como prova.

O contrato de par de cartões ultrapassou o prazo de um caso ao renderizar
todos os instrumentos. A mesma verificação foi dividida por matéria, com
os mesmos cartões, estados e seleção; os 12 casos dirigidos passaram.
A suíte geral foi repetida depois desse ajuste, sem aumentar seu timeout.

## Validação e limites

TypeScript, build e **2.076 testes** aprovados (922 Node + 1.154 Vitest em
171 arquivos). Matrizes de cobertura e qualidade aprovadas; inventário formal
preservado. Execução local em Node 24.19.0/npm 11.9.0; os workflows usam Node 22.

**128 configurações** de fluxos e mecanismos aprovadas, com 480 estados,
48 modificadores e diagnóstico/Testar/Reconstruir. Houve alteração observável
do SVG durante movimento normal nas 64 configurações correspondentes. Zero
exceções, erros de console/rede, overflow da página, textos fora do viewBox do SVG, colisões
entre textos ou violações axe confirmadas no componente.

Depois da correção localizada da fonte, foram revalidadas **32 configurações
tipográficas**, em celular claro e desktop escuro, normal/reduzido: 120 estados,
geometria, pan, contraste automático, família efetiva e FontFace Kalam 700
carregado. As capturas da galeria correspondem a essa versão tipográfica.
O ajuste não muda lógica, estrutura ou dados; os fluxos não foram repetidos
nessa segunda rodada. Contagens e resultados inconclusivos no manifesto,
`browser-evidence.json` e `typography-evidence.json`.

O runner percorre os oito IDs em 360/390/834/1366, claro/escuro e movimento
normal/reduzido. Confere todos os estados, modificadores por Enter, pan,
geometria do texto, console, rede e axe no componente. Testar usa resposta
deliberadamente incompleta em contexto local sem login; Reconstruir oferece
seleção por teclado. As capturas são de viewport real, com navegação do app.

Chromium não certifica Safari ou iPad físico. Axe é uma checagem automática
local ao componente e seus resultados inconclusivos requerem conferência;
não representa certificação de acessibilidade integral. O feedback mantém
o avaliador heurístico existente; não foi reescrita sua qualidade semântica.
Login, sincronização real, serviços pagos e dados remotos da estudante não
foram exercitados. Avisos de chunks grandes permanecem no build.

## Continuidade

Depois da revisão e integração desta PR, reconciliar a nova ponta de main e
prosseguir com os 29 capítulos restantes de LG3, incluindo Romantismo,
Realismo/autores e Modernismos. A fila proposta passa a 126 achados visuais
e 106 aprofundamentos, com 172 achados tratados e 315 mecanismos preservados.
Literatura permanece pendente em 29; Redação em 58 e Sociologia em 19 textos.
Filosofia e COP30 continuam no escopo visual separado. Sem merge automático.
