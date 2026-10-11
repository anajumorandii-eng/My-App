# Lote ciências — 56 capítulos e 3D integrado às pranchas

Base: `349ba97` (main após a PR #306). Duas mudanças, pedidas juntas pela Ana Júlia em 11/10/2026:

1. **Modelo 3D sem botão.** O "Explorar modelo 3D" (e os equivalentes "Explorar campo/gerador/trajetória/campos/bicamada/alotropia 3D", "Dupla-hélice 3D") escondia o modelo atrás de um clique e o tratava como anexo. Agora o modelo abre junto com a cena: nos instrumentos de eletrostática, vetores, magnetismo e biologia, nas pranchas de membrana, onda eletromagnética e ligações, e no suplemento espacial de todos os lotes anteriores (130 capítulos). A projeção 2D anotada continua acima; o 3D vem logo abaixo, no mesmo palco, com câmera por arraste/toque/teclado.
2. **56 capítulos novos com modelo espacial próprio**: os 46 de Física, 9 de Química e COP30 que estavam "a confrontar" em `continuidade-613.csv`. Cada um tem objeto próprio do capítulo (nenhuma geometria emprestada), parâmetro ligado a uma grandeza real, condições quando o capítulo compara situações e percurso finito (pausável; movimento reduzido entrega o término) quando o fenômeno acontece no tempo.

O palco do modelo ganhou enquadramento automático pelo raio do objeto (girar a câmera não muda o tamanho), layout em duas colunas no desktop e entrada suave respeitando movimento reduzido.

## Capítulos

| Capítulo (ID) | Modelo |
| --- | --- |
| `fis-termologia-calor` | Calor: do quente para o frio |
| `atu-cop30-belem` | Gases de efeito estufa e balanço de energia |
| `summary-fisica-cinematica-escalar-conceitos-fundamentais` | Mesmo movimento, referenciais diferentes |
| `summary-fisica-movimento-uniforme` | Deslocamentos iguais em tempos iguais |
| `summary-fisica-movimento-uniformemente-variado` | Velocidade muda o mesmo tanto a cada segundo |
| `summary-fisica-as-leis-de-newton` | Força resultante e aceleração |
| `summary-fisica-plano-inclinado` | Rampa: componentes do peso |
| `summary-fisica-leis-da-gravitacao` | Inverso do quadrado da distância |
| `summary-fisica-analisando-movimentos-contidos-em-um-plano-vertical` | Lançamento vertical |
| `summary-fisica-orbitas` | Órbita elíptica e segunda lei de Kepler |
| `summary-fisica-balistica` | Lançamento oblíquo |
| `summary-fisica-movimento-harmonico-simples-mhs` | Massa e mola: MHS |
| `summary-fisica-impulso-e-quantidade-de-movimento` | Impulso muda a quantidade de movimento |
| `summary-fisica-sistemas-isolados-e-a-conservacao-da-quantidade-de-movimento` | Explosão: quantidade de movimento total nula |
| `summary-fisica-colisoes` | Colisão frontal em trilho |
| `summary-fisica-trabalho-e-energia-teorema-da-energia-cinetica` | Trabalho da resultante = ΔEc |
| `summary-fisica-trabalho-e-energia-o-teorema-da-energia-potencial` | Trabalho do peso e energia potencial |
| `summary-fisica-sistemas-conservativos-e-sistemas-nao-conservativos` | Pista em U: energia conservada ou dissipada |
| `summary-fisica-potencia-maquina-e-rendimento` | Guindaste: potência útil e rendimento |
| `summary-fisica-a-fisica-por-tras-da-obtencao-de-energia-eletrica-das-quedas-d-agua-aos-reatores-nucleares` | Da energia primária à elétrica |
| `summary-fisica-equivalencia-massa-energia` | E = Δm·c² |
| `summary-fisica-estatica` | Equilíbrio de momentos |
| `summary-fisica-dilatacao-ou-contracao-termica-dos-solidos-e-liquidos` | Dilatação linear, superficial e volumétrica |
| `summary-fisica-calor-sensivel-e-calor-latente` | Gelo a −10 °C recebendo calor |
| `summary-fisica-maquinas-termicas-e-ciclo-de-carnot` | Ciclo de Carnot entre duas fontes |
| `summary-fisica-eletrostatica-processos-de-eletrizacao-e-aplicacoes` | Atrito, contato e indução |
| `summary-fisica-corrente-eletrica` | Carga atravessando uma seção |
| `summary-fisica-potencia-eletrica` | Potência dissipada em um resistor |
| `summary-fisica-resistores` | Associação de resistores |
| `summary-fisica-medidores-eletricos` | Amperímetro em série, voltímetro em paralelo |
| `summary-fisica-geradores` | Gerador real: U = ε − r·i |
| `summary-fisica-receptores` | Receptor: U = ε′ + r′·i |
| `summary-fisica-circuitos-de-malha-unica` | Malha única: lei de Pouillet |
| `summary-fisica-eletrodinamica-as-leis-de-kirchhoff` | Nós e malhas |
| `summary-fisica-capacitores` | Capacitor de placas paralelas |
| `summary-fisica-fundamentos-da-optica-geometrica` | Câmara escura: propagação retilínea |
| `summary-fisica-reflexao-em-superficies-planas` | Espelho plano: imagem simétrica |
| `summary-fisica-reflexao-em-superficies-esfericas` | Espelho côncavo e equação de Gauss |
| `summary-fisica-optica-da-visao` | Olho: onde a imagem se forma |
| `summary-fisica-microscopio-e-luneta-astronomica-ou-telescopio-refrator-nocoes-basicas` | Duas lentes, dois instrumentos |
| `summary-fisica-conceitos-basicos` | Onda transversal e longitudinal |
| `summary-fisica-equacao-fundamental-da-ondulatoria` | v = λ·f |
| `summary-fisica-ondulatoria-som-e-suas-propriedades` | Som: compressões no ar |
| `summary-fisica-intensidade-sonora` | Esferas de mesma potência |
| `summary-fisica-fenomenos-ondulatorios-difracao-polarizacao-e-ressonancia` | Difração, polarização e ressonância |
| `summary-fisica-efeito-doppler-descricao-e-estudo-quantitativo` | Fonte em movimento: frentes de onda |
| `summary-fisica-nocoes-basicas-de-fisica-quantica` | Efeito fotoelétrico |
| `summary-quimica-quimica-ambiental` | Chuva ácida e calcário |
| `summary-quimica-combustiveis-fosseis` | Combustão completa do metano |
| `summary-quimica-reacoes-de-adicao` | Adição de Br₂ ao eteno |
| `summary-quimica-acidos-graxos-e-esterificacao` | Esterificação de Fischer |
| `summary-quimica-transesterificacao-alcoolise` | Triglicerídeo + metanol |
| `summary-quimica-acidez-e-basicidade-pka` | pH × pKa: fração ionizada |
| `summary-quimica-equilibrios-ionicos` | Ionização de ácido fraco |
| `summary-quimica-equilibrios-ionicos-ii` | Produto de solubilidade e íon comum |
| `qui-equilibrio-acidificacao` | N₂O₄ ⇌ 2 NO₂: Q e K |

As grandezas da leitura saem de `src/lib/scienceSpatialBatch.ts` (funções puras, testadas em `node:test`), nunca das coordenadas desenhadas. As notas de cada modelo delimitam o recorte (valores fixados, idealizações, o que o desenho não mede).

## Validação

- `npm run lint` limpo.
- `npm test`: 1.010 testes Node e 1.707 Vitest (194 arquivos) — ver a execução final na PR.
- Novos invariantes: 56 IDs sem sobreposição com lotes anteriores; relações físicas/químicas (Newton com atrito, alcance de ângulos complementares, colisões, patamar de fusão, Carnot, Gauss, fotoelétrico, Henderson-Hasselbalch); todos os valores × condições × tempos geram pontos finitos e dentro do quadro nas câmeras extremas; teste de interface por capítulo (parâmetro, condições, câmera preservada, restaurar vista).
- Chromium 1194 local, 1440 px e 390 px: capturas em `capturas/`, sem erros de página.

Não houve mudança em histórico, Firestore, chaves de progresso ou aprovação editorial. Os 56 modelos ficam em **revisão editorial e pedagógica pendente**, como os lotes anteriores. Restam 427 capítulos "a confrontar" (Matemática, Redação, História, Geografia, Biologia, Literatura, Filosofia, Sociologia, Gramática, Inglês, Entendimento de Texto).
