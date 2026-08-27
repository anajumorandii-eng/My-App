import { summaryCurriculum } from './summaryCurriculum';
import { buildSubjectSummaries, type SubjectTopicNote } from './subjectSummaryFactory';

const topics = summaryCurriculum.find((item) => item.subject === 'Física')!.topics;

function note(title: string, track: string): SubjectTopicNote {
  const t = title.toLowerCase();
  if (t.includes('cinemática escalar')) return { focus: 'Referencial, posição, deslocamento, distância, intervalo de tempo, velocidade e aceleração descrevem o movimento sem explicar sua causa. Sinais dependem do eixo escolhido; rapidez e distância não carregam direção.' };
  if (t === 'movimento uniforme') return { focus: 'No movimento uniforme, a velocidade escalar é constante, a aceleração é nula e a posição varia linearmente: s = s₀ + vt. A inclinação do gráfico posição-tempo fornece a velocidade.' };
  if (t.includes('uniformemente variado')) return { focus: 'No MUV, a aceleração é constante: v = v₀ + at e Δs = v₀t + at²/2. A área sob v×t fornece deslocamento; Torricelli elimina o tempo: v² = v₀² + 2aΔs.' };
  if (t === 'o movimento circular') return { focus: 'Período e frequência descrevem repetição; v = ωR e ω = 2πf. Mesmo com rapidez constante, a direção da velocidade muda e existe aceleração centrípeta v²/R.' };
  if (t.includes('vetores')) return { focus: 'Grandezas vetoriais exigem módulo, direção e sentido. Soma por componentes, produto por escalar e decomposição permitem tratar movimentos e forças sem somar apenas módulos.' };
  if (t.includes('velocidade vetorial')) return { focus: 'Velocidade vetorial média é deslocamento dividido pelo tempo; a instantânea é tangente à trajetória. Ela pode mudar por alteração do módulo, da direção ou do sentido.' };
  if (t.includes('composição de movimentos')) return { focus: 'Velocidades dependem do referencial e se compõem vetorialmente: vA/C = vA/B + vB/C. Travessias de rios e esteiras exigem separar movimento relativo e arrastamento.' };
  if (t.includes('aceleração vetorial')) return { focus: 'Aceleração tangencial altera o módulo da velocidade; aceleração centrípeta altera sua direção. A aceleração total é a soma vetorial dessas componentes.' };
  if (t.includes('força e seus tipos')) return { focus: 'Força é interação, não propriedade armazenada. Peso, normal, tração, atrito, elástica e resistência devem ser identificadas pelo agente e representadas no diagrama do corpo isolado.' };
  if (t.includes('resultante')) return { focus: 'A força resultante é a soma vetorial de todas as forças sobre o mesmo corpo. Resultante nula implica aceleração nula, não necessariamente repouso.' };
  if (t.includes('leis de newton')) return { focus: 'Inércia descreve estados com resultante nula; ΣF = ma relaciona resultante e aceleração; ação e reação têm mesmo módulo e sentidos opostos, mas atuam em corpos diferentes.' };
  if (t.includes('força de contato')) return { focus: 'Normal é perpendicular à superfície e atrito é tangencial. Atrito estático se ajusta até um máximo; cinético usa aproximadamente μcN e não se soma automaticamente ao peso.' };
  if (t.includes('sistema de corpos')) return { focus: 'Ao analisar vários corpos, forças internas se cancelam no sistema completo, mas reaparecem ao isolar cada parte. Cordas e polias ideais transmitem tração sob hipóteses explícitas.' };
  if (t.includes('plano inclinado')) return { focus: 'Decomponha o peso em mg senθ ao longo do plano e mg cosθ perpendicularmente. A normal depende das forças perpendiculares; atrito depende da tendência de deslizamento.' };
  if (t.includes('gravitação')) return { focus: 'A atração gravitacional vale F = GmM/r² e o campo g = GM/r². Peso depende do campo local; massa não muda com planeta ou altitude.' };
  if (t.includes('dinâmica do movimento circular')) return { focus: 'Força centrípeta não é uma força nova, mas o nome da componente resultante radial: ΣFr = mv²/R. Normal, peso, tração ou atrito podem fornecê-la.' };
  if (t.includes('plano vertical')) return { focus: 'Em curvas verticais, a resultante radial muda porque peso e normal/tração podem somar ou se opor. No limite de contato, a normal ou tração pode chegar a zero.' };
  if (t.includes('órbitas')) return { focus: 'Em órbita circular, a gravidade fornece mv²/r, levando a v = √(GM/r). Órbita é queda livre contínua; maior raio implica menor velocidade orbital e maior período.' };
  if (t.includes('balística')) return { focus: 'Sem resistência do ar, lançamento oblíquo combina MU horizontal e MUV vertical sob gravidade. Componentes evoluem independentemente e o alcance depende da velocidade, ângulo e altura.' };
  if (t.includes('harmônico')) return { focus: 'No MHS, a força restauradora é proporcional e oposta ao deslocamento: F = −kx; a = −ω²x. Energia alterna entre cinética e potencial com período próprio.' };
  if (t.includes('impulso')) return { focus: 'Impulso J = ∫Fdt é igual à variação da quantidade de movimento Δp. A área sob F×t mede impulso, e aumentar o tempo de colisão reduz a força média para o mesmo Δp.' };
  if (t.includes('sistemas isolados')) return { focus: 'Se o impulso externo resultante é desprezível, a quantidade de movimento total se conserva. Forças internas alteram movimentos individuais, mas seus impulsos se cancelam no total.' };
  if (t === 'colisões') return { focus: 'Toda colisão isolada conserva quantidade de movimento; apenas a elástica conserva também energia cinética. Coeficiente de restituição compara velocidades relativas de afastamento e aproximação.' };
  if (t.includes('trabalho de uma força')) return { focus: 'Trabalho é transferência de energia por uma força ao longo do deslocamento: W = Fd cosθ para força constante. A área sob F×x fornece trabalho variável.' };
  if (t.includes('energia cinética')) return { focus: 'O trabalho da resultante altera a energia cinética: Wres = Δ(mv²/2). O teorema vale mesmo quando forças individuais não são conservativas.' };
  if (t.includes('energia potencial')) return { focus: 'Forças conservativas permitem energia potencial com Wcons = −ΔU. Próximo à Terra Ug = mgh; para mola Ue = kx²/2.' };
  if (t.includes('conservativos')) return { focus: 'Sem trabalho não conservativo, energia mecânica K + U se conserva. Atrito transforma energia mecânica em energia interna; energia total continua conservada em sistema ampliado.' };
  if (t.includes('potência, máquina')) return { focus: 'Potência mede rapidez da transferência: P = W/Δt e, em casos alinhados, P = Fv. Rendimento η = energia útil/total é menor ou igual a 1.' };
  if (t.includes('obtenção de energia')) return { focus: 'Usinas convertem energia potencial, química, térmica, nuclear, cinética e elétrica em cadeias de transformação. Potência instalada, energia gerada, rendimento e impacto ambiental são grandezas diferentes.' };
  if (t.includes('massa-energia')) return { focus: 'E = mc² expressa a equivalência entre massa e energia; pequenas variações de massa correspondem a grandes energias. Em reações nucleares, compare massas iniciais e finais do sistema.' };
  if (t === 'estática') return { focus: 'Equilíbrio de corpo extenso exige ΣF = 0 e Στ = 0. Torque τ = rF senθ depende do ponto de aplicação e do eixo escolhido.' };
  if (t.includes('hidrostática')) return { focus: 'Densidade é ρ = m/V e pressão p = F/A. Em fluido em repouso, Δp = ρgΔh; Pascal transmite pressão e Arquimedes dá empuxo igual ao peso do fluido deslocado.' };
  if (t.includes('dilatação')) return { focus: 'Dilatação linear obedece ΔL = αL₀ΔT; áreas e volumes usam coeficientes relacionados em sólidos isotrópicos. Furos dilatam como se fossem feitos do mesmo material.' };
  if (t.includes('calor sensível')) return { focus: 'Sem mudança de fase, Q = mcΔT; durante fase ideal, Q = mL e a temperatura permanece constante. Processos em sequência exigem somar parcelas.' };
  if (t.includes('gases ideais')) return { focus: 'Gás ideal satisfaz pV = nRT; transformações isotérmica, isobárica, isocórica e adiabática impõem restrições diferentes. Use temperatura absoluta em relações gasosas.' };
  if (t.includes('trabalho da força de pressão')) return { focus: 'O trabalho do gás é a área sob p×V e vale pΔV quando a pressão é constante. Expansão realiza trabalho positivo na convenção usual; compressão recebe trabalho.' };
  if (t === 'primeira lei da termodinâmica') return { focus: 'A primeira lei relaciona calor, trabalho e energia interna: ΔU = Q − W, com W realizado pelo gás. Sinais devem seguir uma convenção declarada.' };
  if (t.includes('transformações particulares')) return { focus: 'Isocórica tem W = 0; isotérmica de gás ideal tem ΔU = 0; adiabática tem Q = 0; isobárica permite W = pΔV. A primeira lei conecta cada restrição.' };
  if (t.includes('carnot')) return { focus: 'Máquinas térmicas recebem Qq, realizam trabalho e rejeitam Qf. Nenhuma máquina entre Tq e Tf supera ηCarnot = 1 − Tf/Tq, com temperaturas absolutas.' };
  if (t.includes('eletrização')) return { focus: 'Atrito transfere elétrons entre materiais; contato redistribui carga; indução separa cargas e pode eletrizar sem contato quando há aterramento. Carga total se conserva e é quantizada.' };
  if (t.includes('coulomb')) return { focus: 'A força elétrica entre cargas puntiformes vale F = k|qQ|/r², ao longo da linha que as une. O sinal das cargas determina atração ou repulsão; forças se somam vetorialmente.' };
  if (t === 'campo elétrico') return { focus: 'Campo elétrico é força por carga de prova: E = F/q. Para carga puntiforme, E = k|Q|/r² e aponta para fora de positiva e para dentro de negativa.' };
  if (t.includes('potencial elétrico')) return { focus: 'Potencial V = U/q é escalar; para carga puntiforme V = kQ/r. Trabalho elétrico e diferença de potencial obedecem Wcampo = −ΔU = q(Vi − Vf).' };
  if (t.includes('linhas de força')) return { focus: 'Linhas são tangentes ao campo, não se cruzam e sua densidade sugere intensidade. Superfícies equipotenciais são perpendiculares ao campo e mover carga sobre elas não exige trabalho elétrico.' };
  if (t.includes('campo elétrico uniforme')) return { focus: 'Entre placas ideais, E é aproximadamente constante e ΔV = −E·Δr. A força qE produz aceleração constante cuja direção depende do sinal da carga.' };
  if (t.includes('dinâmica das cargas')) return { focus: 'Uma carga em campo elétrico sofre F = qE e troca energia potencial por cinética. Aceleração depende de q/m; sinal da carga inverte o sentido da força.' };
  if (t === 'corrente elétrica') return { focus: 'Corrente é taxa de passagem de carga i = ΔQ/Δt. O sentido convencional é o de cargas positivas; em metais, elétrons derivam no sentido oposto.' };
  if (t === 'potência elétrica') return { focus: 'Potência elétrica P = Ui = i²R = U²/R para resistor ôhmico. Energia cobrada é potência vezes tempo, com conversão correta entre W, kW, s e h.' };
  if (t === 'resistores') return { focus: 'Resistores ôhmicos obedecem U = Ri; R = ρL/A. Em série, corrente é comum e resistências somam; em paralelo, tensão é comum e condutâncias somam.' };
  if (t.includes('medidores')) return { focus: 'Amperímetro ideal tem resistência nula e liga em série; voltímetro ideal tem resistência infinita e liga em paralelo. Ligações erradas alteram ou danificam o circuito.' };
  if (t === 'geradores') return { focus: 'Gerador converte outra forma em elétrica e tem tensão terminal U = ε − ri quando fornece corrente. Curto-circuito e rendimento dependem da resistência interna.' };
  if (t === 'receptores') return { focus: 'Receptor converte energia elétrica em forma útil e apresenta força contraeletromotriz: U = ε′ + ri. Potência total se divide em útil e dissipada.' };
  if (t.includes('malha única')) return { focus: 'Em uma malha, a mesma corrente atravessa elementos em série. Some elevações e quedas de potencial com sinais coerentes e inclua resistências internas.' };
  if (t.includes('kirchhoff')) return { focus: 'Lei dos nós conserva carga: soma das correntes que entram igual à que sai. Lei das malhas conserva energia: soma algébrica das diferenças de potencial em percurso fechado é zero.' };
  if (t === 'capacitores') return { focus: 'Capacitor armazena cargas opostas: C = Q/U; placas paralelas têm C = εA/d. Energia vale CU²/2; associações de capacitores invertem as regras dos resistores.' };
  if (t.includes('ímãs')) return { focus: 'Campo magnético tem linhas fechadas; polos isolados não foram observados. Bússola alinha-se ao campo terrestre, e materiais respondem de modos distintos à magnetização.' };
  if (t.includes('fio reto')) return { focus: 'Correntes criam campo magnético: fio longo B = μi/(2πr) e centro de espira B proporcional a i/R. Regra da mão direita fornece a direção vetorial.' };
  if (t.includes('lançamentos de cargas')) return { focus: 'Força magnética F = |q|vB senθ é perpendicular a v e B, não realiza trabalho e curva a trajetória. Em campo uniforme perpendicular, r = mv/(|q|B).' };
  if (t.includes('fios percorridos')) return { focus: 'Fio com corrente em campo sofre F = BiL senθ; direção vem do produto vetorial. Fios paralelos com correntes no mesmo sentido se atraem.' };
  if (t.includes('lei de lenz')) return { focus: 'Fluxo Φ = BA cosθ e fem induzida ε = −dΦ/dt. O sinal de Lenz indica corrente cujo campo se opõe à variação do fluxo, preservando energia.' };
  if (t.includes('geradores') && track === 'Eletromagnetismo' || t.includes('corrente induzida')) return { focus: 'Geradores variam fluxo por rotação de espiras e convertem trabalho mecânico em energia elétrica. Frequência e amplitude dependem da rotação, campo, área e número de espiras.' };
  if (t.includes('fundamentos da óptica')) return { focus: 'Óptica geométrica representa luz por raios em meios homogêneos, com propagação retilínea, independência e reversibilidade. Sombra, penumbra e câmera escura seguem geometria semelhante.' };
  if (t.includes('superfícies planas')) return { focus: 'Reflexão obedece i = r e mantém raio incidente, normal e refletido no mesmo plano. Espelho plano produz imagem virtual, direita, do mesmo tamanho e simétrica.' };
  if (t.includes('superfícies esféricas')) return { focus: 'Espelhos esféricos paraxiais obedecem 1/f = 1/p + 1/p′ e aumento A = −p′/p. Sinais e traçado de raios distinguem imagem real/virtual e direita/invertida.' };
  if (t.includes('refração')) return { focus: 'Snell: n1 sen i = n2 sen r; frequência não muda na fronteira, mas velocidade e comprimento mudam. Reflexão total exige ida do maior índice para o menor e ângulo acima do crítico.' };
  if (t.includes('lentes esféricas: estudo gráfico')) return { focus: 'Raios notáveis permitem construir imagens de lentes convergentes e divergentes. Posição do objeto em relação a F e 2F determina natureza, orientação e tamanho.' };
  if (t.includes('estudo analítico')) return { focus: 'Lentes delgadas obedecem 1/f = 1/p + 1/p′ e A = −p′/p. Convenção de sinais deve ser coerente com imagem real/virtual e lente convergente/divergente.' };
  if (t.includes('fabricante')) return { focus: 'A vergência depende dos índices e raios de curvatura; lentes em contato somam vergências. P = 1/f em dioptrias quando f está em metros.' };
  if (t.includes('óptica da visão')) return { focus: 'Córnea e cristalino focalizam luz na retina; acomodação altera a convergência. Miopia corrige-se com lente divergente, hipermetropia com convergente e astigmatismo exige correção direcional.' };
  if (t.includes('microscópio')) return { focus: 'Microscópio combina objetiva e ocular para grande aumento angular; luneta usa objetiva de longa distância focal e ocular para objetos distantes. Imagens intermediária e final devem ser acompanhadas.' };
  if (t === 'conceitos básicos') return { focus: 'Ondas transportam energia e informação sem transporte líquido de matéria. Classifique por natureza, direção de vibração e dimensão; amplitude, frequência, período e fase têm papéis distintos.' };
  if (t.includes('equação fundamental')) return { focus: 'Velocidade de propagação satisfaz v = λf. Ao mudar de meio, a frequência é fixada pela fonte, enquanto velocidade e comprimento de onda podem mudar.' };
  if (t.includes('eletromagnéticas')) return { focus: 'Ondas eletromagnéticas são transversais, propagam-se no vácuo a c e diferem por frequência e comprimento. Energia fotônica cresce com f, mas intensidade também depende do fluxo de fótons.' };
  if (t.includes('som e suas propriedades')) return { focus: 'Som é onda mecânica longitudinal em fluidos; altura relaciona-se à frequência, intensidade à amplitude/energia e timbre ao espectro. Velocidade depende do meio, não da frequência audível.' };
  if (t.includes('intensidade sonora')) return { focus: 'Intensidade é potência por área e decai como 1/r² para fonte puntiforme. Nível sonoro β = 10 log(I/I₀), portanto decibéis formam escala logarítmica.' };
  if (t.includes('eco') || t.includes('reverberação')) return { focus: 'Reflexão devolve onda; eco é percebido separadamente quando o atraso é suficiente, reverberação prolonga o som. Refração muda direção por mudança de velocidade.' };
  if (t.includes('cordas') && t.includes('reflexão')) return { focus: 'Pulso reflete invertido em extremidade fixa e sem inversão em extremidade livre. Refração na junção preserva frequência e reparte energia entre reflexão e transmissão.' };
  if (t.includes('difração')) return { focus: 'Difração é marcante quando abertura/obstáculo tem dimensão comparável a λ; polarização evidencia transversalidade; ressonância amplia resposta quando a frequência de excitação se aproxima da natural.' };
  if (t.includes('interferência de ondas')) return { focus: 'Superposição soma deslocamentos; diferença de caminho define interferência construtiva ou destrutiva. Batimentos têm frequência |f1 − f2| para frequências próximas.' };
  if (t.includes('caso particular')) return { focus: 'Onda estacionária resulta da interferência de ondas opostas iguais, formando nós e ventres fixos. Não há transporte líquido de energia ao longo do padrão ideal.' };
  if (t.includes('estacionárias em cordas')) return { focus: 'Corda fixa nas extremidades admite fn = nv/(2L), com nós nas pontas. v = √(T/μ), ligando harmônicos a tensão e densidade linear.' };
  if (t.includes('estacionárias em tubos')) return { focus: 'Tubo aberto-aberto admite todos os harmônicos; fechado-aberto admite apenas ímpares no modelo ideal. Extremidade aberta é ventre de deslocamento e fechada é nó.' };
  if (t.includes('doppler')) return { focus: 'Efeito Doppler altera frequência observada por movimento relativo fonte-observador. Aproximação aumenta frequência percebida; sinais na fórmula dependem de quem se move e em qual sentido.' };
  if (t.includes('quântica')) return { focus: 'Quantização, efeito fotoelétrico e dualidade onda-partícula mostram limites da física clássica. Energia de fóton E = hf; frequência de corte depende do material e intensidade altera principalmente o número de fótons.' };
  return { focus: `${title} integra o eixo ${track}; identifique as grandezas, a relação física, as condições de validade e a interpretação do resultado antes de calcular.` };
}

const notes = Object.fromEntries(topics.map((topic) => [topic.title, note(topic.title, topic.track)]));
const built = buildSubjectSummaries({
  subject: 'Física', topics, notes,
  sourceFile: 'materiais brutos/Física (v1) 1.pdf', idPrefix: 'fis',
  excludeTopics: new Set(['Temperatura, Calor e seus Mecanismos de Transferência']),
});

export const physicsInteractiveSummaries = built.summaries;
export const physicsSummaryMaterials = built.materials;
