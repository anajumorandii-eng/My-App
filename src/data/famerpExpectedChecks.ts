// O que o corretor confere em cada item das discursivas da Famerp, no formato
// das respostas esperadas que a Vunesp publica para a Unesp: termo exato,
// justificativa curta, conta com unidade. A Famerp não publica respostas
// esperadas próprias (só os cadernos), por isso a lista é autoral do CRIVO,
// escrita a partir da resposta-modelo de cada questão.
//
// Cada entrada tem uma lista por item, na ordem dos subItems. Não há peso por
// ponto: o edital diz que cada questão vale de 0 a 4, mas não publica a divisão
// interna, e inventar decimais daria uma precisão que a banca não deu.

export const famerpExpectedChecks: Record<string, string[][]> = {
  // 2026
  disc_famerp_2026_q01: [
    ['Nomeia o CO₂.', 'Escreve a formação do ácido carbônico e a liberação de H⁺.', 'Conclui que o pH da água diminui.'],
    ['Diz que o óleo bloqueia a luz (e as trocas gasosas).', 'Cita as algas simbiontes (zooxantelas) sem fotossíntese.', 'Liga a falta de matéria orgânica e O₂ à morte do coral.'],
  ],
  disc_famerp_2026_q02: [
    ['Tubo neural.', 'Celoma (verdadeiro).'],
    ['Coluna vertebral.', 'Vírus no sangue materno atravessam a placenta até a circulação do embrião.'],
  ],
  disc_famerp_2026_q03: [
    ['Fagocitose.', 'Actina é proteína.'],
    ['Fosfolipídios da bicamada.', 'Apresentação do antígeno no MHC de classe II.', 'Reconhecimento pelo receptor do linfócito T CD4.'],
  ],
  disc_famerp_2026_q04: [
    ['Luz → entrada de K⁺ nas células-guarda.', 'Água entra por osmose, células túrgidas, ostíolo abre.', 'Umidade alta reduz a transpiração (menor diferença de vapor).'],
    ['Ácido abscísico.', 'Horas mais quentes e secas, com transpiração maior que a absorção (déficit hídrico).'],
  ],
  disc_famerp_2026_q05: [
    ['Estômago.', 'Ácido clorídrico (HCl).'],
    ['O ácido ativa o pepsinogênio em pepsina e garante o pH ácido.', 'O bicarbonato neutraliza o ácido, sem ativação nem digestão.'],
  ],
  disc_famerp_2026_q06: [
    ['Etapa 1 (replicação), em células da linhagem germinativa.', 'Ribossomo.'],
    ['Código degenerado: códons diferentes para o mesmo aminoácido.', 'Splicing alternativo.'],
  ],
  disc_famerp_2026_q07: [
    ['Permutação (crossing-over).', 'Anáfase I.'],
    ['Um par de genes em cromossomos diferentes (A e B, ou P e B).', '74% parentais divididos em dois tipos: 37% de Ap.'],
  ],
  disc_famerp_2026_q08: [
    ['Transgênico (organismo geneticamente modificado).', 'Enzimas de restrição cortam o DNA em sequências específicas.'],
    ['Cromossomo Z, com a justificativa de que a fêmea é ZW e passa o Z aos machos.', 'Cruzamento Z^G Z × ZW escrito.', 'Probabilidade 1/2.'],
  ],
  disc_famerp_2026_q09: [
    ['Ca²⁺ (carga +2).', 'Óxido básico.'],
    ['Perda de massa = CO₂: 44 g = 1 mol.', '1 mol de CaCO₃ = 100 g.', 'Teor de 80%.'],
  ],
  disc_famerp_2026_q10: [
    ['Fórmula estrutural com C ligado a 4 H por ligações simples.', 'Ligação covalente (praticamente apolar).'],
    ['128 g de CCl₄ (com a conversão mg → g).', '80 mL pelo uso da densidade.'],
  ],
  disc_famerp_2026_q11: [
    ['Cl₂, grupo 17 (halogênios).', 'Lewis com um par compartilhado e três pares livres em cada Cl.'],
    ['Aplicação de Hess com os coeficientes (4 × HCl).', 'ΔH = −390,2 kJ.', 'Exotérmica.'],
  ],
  disc_famerp_2026_q12: [
    ['Mn(OH)₂.', 'Base (hidróxido).'],
    ['Equação global balanceada, com o zinco se oxidando.', 'ddp = 2,44 V.'],
  ],
  disc_famerp_2026_q13: [
    ['118 nêutrons.', '76 elétrons no Au³⁺.'],
    ['Nêutron, justificado por A = 1 e Z = 0.', '¹⁹⁸₈₀Hg.'],
  ],
  disc_famerp_2026_q14: [
    ['C₁₀H₁₀O₄.', 'Isômero cis com os H da dupla do mesmo lado.'],
    ['Etanol, CH₃–CH₂–OH.', 'Éster.'],
  ],
  disc_famerp_2026_q15: [
    ['Resultante nula.', 'Normal de 400 N, vertical para cima.'],
    ['a = g sen θ − μ g cos θ montada.', 'μ = 0,25.'],
  ],
  disc_famerp_2026_q16: [
    ['Ep = 5 500 J pela conservação.', 'H = 10 m.'],
    ['Empuxo de 530 N.', 'Trabalho resultante de 5 500 J em módulo, pelo teorema da energia cinética.'],
  ],
  disc_famerp_2026_q17: [
    ['γ = 1,5 × 10⁻⁵ °C⁻¹.', 'α = γ/3 = 5,0 × 10⁻⁶ °C⁻¹.'],
    ['ΔV da glicerina = 19,20 cm³ (volume final do recipiente menos o livre).', 'γ = 5,0 × 10⁻⁴ °C⁻¹.'],
  ],
  disc_famerp_2026_q18: [
    ['Temperatura em kelvin (330 K).', 'PV/T constante: T_C = 440 K.'],
    ['Trabalho = área do ciclo = 45 J.', 'Potência = 60 W.'],
  ],
  disc_famerp_2026_q19: [
    ['β = 60°, com a lei da reflexão justificada.', 'h = 1,90 m.'],
    ['Snell: sen r = 0,50/1,4.', 'X = 1,5 mm.'],
  ],
  disc_famerp_2026_q20: [
    ['3,0 × 10⁻⁶ T (metade, pelo dobro da distância).', 'Perpendicular à folha, para dentro.'],
    ['F = 8,0 × 10⁻⁵ N, com a conversão de mA e cm.', 'Horizontal, para a esquerda.'],
  ],
  // 2025
  disc_famerp_2025_q01: [
    ['Mutualismo.', 'Pele fina, úmida e permeável (respiração cutânea).'],
    ['A concentração aumenta a cada nível trófico (biomagnificação), maior no topo.', 'Carcinogênico: induz câncer, em geral por mutação.'],
  ],
  disc_famerp_2025_q02: [
    ['Mitose.', 'Fase S.'],
    ['Anel contrátil de actina na citocinese separa as células-filhas.', 'Em G0 a célula sai do ciclo e não se divide mais (diferenciada).'],
  ],
  disc_famerp_2025_q03: [
    ['Nematoda.', 'Osmose.'],
    ['Glicólise.', 'Perto de 0 °C as enzimas ficam muito mais lentas.'],
  ],
  disc_famerp_2025_q04: [
    ['O equívoco: o hormônio é o glucagon, não o glicogênio.', 'Insulina reduz a glicemia (glicose entra nas células).'],
    ['Fígado.', 'Gônadas fazem hormônios esteroides a partir do colesterol.'],
  ],
  disc_famerp_2025_q05: [
    ['X: óvulo.', 'Y: semente.'],
    ['Aplicação de auxina (ou giberelina) sem polinização.', 'Endosperma 3n: dois núcleos polares maternos e um núcleo espermático.'],
  ],
  disc_famerp_2025_q06: [
    ['Néfron.', 'Proteínas grandes não atravessam a filtração no glomérulo.'],
    ['ADH (hipotálamo, neuro-hipófise) aumenta a reabsorção de água no túbulo distal e ducto coletor.', 'ATP para o transporte ativo de reabsorção e secreção.'],
  ],
  disc_famerp_2025_q07: [
    ['Herança quantitativa (poligênica).', 'Gameta ABE.'],
    ['AaBbEe × AaBbEe.', '200 g por alelo e classe central de 800 g.'],
  ],
  disc_famerp_2025_q08: [
    ['Cromossomo X inativado e condensado.', 'Imagem 2.'],
    ['Não disjunção na anáfase (I ou II).', 'XXX: cromossomo sexual; Down: autossomo (21).'],
  ],
  disc_famerp_2025_q09: [
    ['Óxido básico (reage com ácido formando sal e água).', 'Sublimação.'],
    ['Combinação das equações com inversões e divisão por 2, cancelando as espécies intermediárias.', 'ΔH = +619 kJ por mol de Y.'],
  ],
  disc_famerp_2025_q10: [
    ['36 elétrons.', 'Piramidal (pirâmide trigonal).'],
    ['⁹⁰₄₀Zr.', 'Meia-vida de 64 h, lida no gráfico ou na tabela.'],
  ],
  disc_famerp_2025_q11: [
    ['LiOH.', 'Nox +3.'],
    ['Equação global balanceada, com o Fe se oxidando.', 'ddp = 1,37 V.'],
  ],
  disc_famerp_2025_q12: [
    ['3 NO₂ + H₂O → 2 HNO₃ + NO, balanceada.'],
    ['Conversão de mL para L e [HNO₃] = 1 × 10⁻³ mol/L.', 'pH = 3 (ácido forte).'],
  ],
  disc_famerp_2025_q13: [
    ['Cl–O–O–Cl.', 'Kc = [(ClO)₂]/[ClO]².'],
    ['Kc cai com a temperatura: reação exotérmica; aquecer favorece o ClO.', 'Gás inerte a volume constante não altera nenhuma concentração.'],
  ],
  disc_famerp_2025_q14: [
    ['C₆H₁₂ (3-metilpent-2-eno).', 'Butanona polar.'],
    ['Butan-2-ol: 74 g/mol.', 'Éster.'],
  ],
  disc_famerp_2025_q15: [
    ['v = 60 m/s.', 'F = 9,0 × 10⁴ N.'],
    ['Deslocamento de 1 200 m.', 'Faltavam 400 m.'],
  ],
  disc_famerp_2025_q16: [
    ['Q = 2,4 kg·m/s (com 60 g em kg).', 'Impulso de 2,4 N·s, porque a velocidade inicial era nula.'],
    ['Ec = 1,5 J.', 'Perda máxima de 0,72 J, usando a altura mínima de 1,3 m.'],
  ],
  disc_famerp_2025_q17: [
    ['Q = 16 000 cal.', '2 000 cal/min.'],
    ['0 °C, justificado pela coexistência de gelo e água.', '300 g de gelo fundidos.'],
  ],
  disc_famerp_2025_q18: [
    ['Altura de 10 cm.', 'Real (projetada) e invertida.'],
    ['f = 20 cm.', 'V = 5,0 di, com f em metros.'],
  ],
  disc_famerp_2025_q19: [
    ['L = 90 cm (três fusos de λ/2).', 'v = 540 m/s.'],
    ['Tubo fechado: 15 cm (λ/4).', 'Tubo aberto: 30 cm (λ/2).'],
  ],
  disc_famerp_2025_q20: [
    ['Q = 0,64 C.', '4,0 × 10¹⁸ elétrons.'],
    ['R = 1,1 × 10⁻³ Ω.', 'L = 40 cm.'],
  ],
  // 2024
  disc_famerp_2024_q01: [
    ['Sucessão secundária.', 'Súber (cortiça) espesso.'],
    ['Raízes longas e profundas até o lençol freático.', 'Nutrientes na biomassa e na serapilheira, com decomposição e reabsorção rápidas.'],
  ],
  disc_famerp_2024_q02: [
    ['Citoplasma (nucleoide).', 'Envoltório nuclear (carioteca).'],
    ['Todos os ribossomos traduzem o mesmo RNAm.', 'Splicing: remoção dos íntrons.'],
  ],
  disc_famerp_2024_q03: [
    ['Difuso.', 'Bulbo.'],
    ['Y, medula espinal.', 'Neurônio sensitivo → medula → neurônio motor, sem o encéfalo, com os nervos aferente e eferente nomeados.'],
  ],
  disc_famerp_2024_q04: [
    ['44 autossomos.', 'X e Y diferem em tamanho, forma e genes.'],
    ['Translocação.', 'Permutação só ocorre entre homólogos; 10 e 14 não são.'],
  ],
  disc_famerp_2024_q05: [
    ['Proteínas.', 'Depende de contato prévio e de resposta específica (sensibilização).'],
    ['Mastócito.', 'Broncoconstrição (e edema) das vias aéreas.'],
  ],
  disc_famerp_2024_q06: [
    ['Óvulo vegetal multicelular, com saco embrionário e oosfera; o animal é uma célula.'],
    ['O ovário libera o ovócito secundário (metáfase II), não o óvulo.', 'A fecundação (entrada do espermatozoide) completa a meiose II.'],
  ],
  disc_famerp_2024_q07: [
    ['Nematoda.', 'Ingestão de ovos em água ou alimento contaminados por fezes.'],
    ['Intestino delgado.', 'Larvas migram pelo sangue até os pulmões e inflamam os alvéolos.'],
  ],
  disc_famerp_2024_q08: [
    ['Predadores evitam o sinal de advertência, e os rosas sobrevivem mais.', 'A seleção natural aumenta a frequência do alelo.'],
    ['P(Aa) = 2/3.', '2/3 × 1/2 × 1/2 = 1/6, logo 15 fêmeas rosas.'],
  ],
  disc_famerp_2024_q09: [
    ['PO₄³⁻.', 'H₂SO₄ + H₂O → H₃O⁺ + HSO₄⁻.'],
    ['Equação balanceada (2 H₂SO₄).', 'Pureza aplicada (400 kg) e cerca de 253 kg de ácido.'],
  ],
  disc_famerp_2024_q10: [
    ['Composto 1.', 'C₂H₄.'],
    ['Par 1 e 5.', 'Propan-2-ol, CH₃–CH(OH)–CH₃.'],
  ],
  disc_famerp_2024_q11: [
    ['Ligação de hidrogênio.', 'Aldeído.'],
    ['Equação global somada.', 'Cadeia de cálculo: 20 g de etanol, 0,004 g/mL e cerca de 8,7 × 10⁻⁵ mol.'],
  ],
  disc_famerp_2024_q12: [
    ['HBr.', 'Nox +5.'],
    ['Ordem 2 em H⁺, pela comparação dos experimentos 2 e 4.', 'v = k[BrO₃⁻][Br⁻][H⁺]².'],
  ],
  disc_famerp_2024_q13: [
    ['O=C=O, com os pares livres.', '1 250 L.'],
    ['1 430 kJ.', 'ΔHc = −1 368 kJ/mol, usando −286 kJ/mol da água.'],
  ],
  disc_famerp_2024_q14: [
    ['6 carbonos assimétricos.', '2 carbonos quaternários.'],
    ['Cerca de 22,3% de oxigênio.', 'Redução.'],
  ],
  disc_famerp_2024_q15: [
    ['16 m/s.', '160 m.'],
    ['Resultante de 1,6 × 10⁴ N.', 'Força de R₁ em R₂ de 1,9 × 10⁴ N.'],
  ],
  disc_famerp_2024_q16: [
    ['Q_A = 3,2 × 10⁴ kg·m/s.', 'Impulso de 6,4 × 10³ N·s (variação de Q de A).'],
    ['Ec_A = 1,6 × 10⁵ J.', 'Dissipada: 3,2 × 10⁴ J.'],
  ],
  disc_famerp_2024_q17: [
    ['Trabalho nulo (volume constante).', 'Calor perdido de 225 kJ.'],
    ['P = 2,0 × 10⁴ Pa.', '180 mol a introduzir.'],
  ],
  disc_famerp_2024_q18: [
    ['E₁: imagens a 40 cm e 100 cm.', 'E₂: imagens a 30 cm e 110 cm.'],
    ['4 imagens (360°/72° − 1).', '2 primárias e 2 secundárias.'],
  ],
  disc_famerp_2024_q19: [
    ['U_R = 2,0 V.', 'R = 100 Ω.'],
    ['P = 0,050 W.', 'E = 15 J (5 min em segundos).'],
  ],
  disc_famerp_2024_q20: [
    ['Q = 3,2 × 10⁻¹² C.', '2,0 × 10⁷ elétrons.'],
    ['1,8 × 10⁻² V a 9 m (proporção inversa).', 'Esboço de hipérbole decrescente.'],
  ],
  // 2023
  disc_famerp_2023_q01: [
    ['Catalisar a quebra do polímero em moléculas menores.', 'Temperatura ou pH.'],
    ['Descobrir o gene (sequência de DNA) da enzima.', 'Universalidade do código genético.'],
  ],
  disc_famerp_2023_q02: [
    ['Doença de Chagas.', 'Fase 3 (amastigota).'],
    ['Destruição das fibras cardíacas, inflamação e fibrose, levando a cardiomegalia e insuficiência.', 'Fezes do barbeiro com o parasita entram pela lesão ou mucosa.'],
  ],
  disc_famerp_2023_q03: [
    ['Pioneiros autótrofos, resistentes e pouco exigentes (liquens).', 'Vento, correntes marinhas ou aves.'],
    ['Produção igual ao consumo (produtividade líquida perto de zero).', 'Mais espécies e estratos geram mais nichos.'],
  ],
  disc_famerp_2023_q04: [
    ['Hemácia.', 'Baço.'],
    ['Autoanticorpos contra as próprias hemácias.', 'Menos O₂ aos músculos, menos ATP, fadiga.'],
  ],
  disc_famerp_2023_q05: [
    ['Células do próprio paciente (mesmo MHC).', 'Mitose descontrolada.'],
    ['Proteínas.', 'Não é herdada, porque a alteração foi em células somáticas.'],
  ],
  disc_famerp_2023_q06: [
    ['Evita perder água quando não há fotossíntese.', 'Solo seco ou salino.'],
    ['Momento 3.', 'Ácido abscísico: saída de K⁺, perda de água por osmose, células flácidas.'],
  ],
  disc_famerp_2023_q07: [
    ['Cromossomo X.', 'O homem XY forma gametas com X ou com Y.'],
    ['Genótipos da família (mãe portadora).', '1/2 × 1/2 × 1/2 = 1/8, com cada fator justificado.'],
  ],
  disc_famerp_2023_q08: [
    ['D. waialealae no ramo externo; A. sandwicense e D. scabra como grupo-irmão.', 'Um mecanismo pós-zigótico (inviabilidade ou esterilidade do híbrido).'],
    ['Isolamento geográfico pelo mar.', 'Interrompe o fluxo gênico, e as diferenças se acumulam até o isolamento reprodutivo.'],
  ],
  disc_famerp_2023_q09: [
    ['C₆H₁₂O₂.', 'Ácido hexanoico em cadeia normal.'],
    ['Ácido etanoico.', 'Butan-1-ol.'],
  ],
  disc_famerp_2023_q10: [
    ['K = 2, L = 6.', 'Nox de 0 para −2 (variação de 2).'],
    ['H₂ limitante, comparando os mols.', '2 420 kJ.'],
  ],
  disc_famerp_2023_q11: [
    ['Ca²⁺ < K⁺ < Cl⁻, justificado pela carga nuclear.', '75% de ³⁵Cl.'],
    ['[Ca²⁺] = 0,06 mol/L.', '[Cl⁻] = 0,20 mol/L, somando as duas fontes.'],
  ],
  disc_famerp_2023_q12: [
    ['2 simples e 3 compostas.', 'n = 3,2 mol.'],
    ['195 g de NaN₃.', '20 g de Fe₂O₃ em excesso.'],
  ],
  disc_famerp_2023_q13: [
    ['Fe + Pb²⁺ → Fe²⁺ + Pb.', 'ddp = 0,31 V.'],
    ['Cátodo de Pb, onde o Pb²⁺ se reduz.', 'K⁺ para o lado do Pb e NO₃⁻ para o lado do Fe.'],
  ],
  disc_famerp_2023_q14: [
    ['H–C≡N.', 'H₂SO₄ + 2 KOH → K₂SO₄ + 2 H₂O.'],
    ['[HF] ≈ 0,14 mol/L.', 'Ka não muda (só depende da temperatura); o equilíbrio desloca.'],
  ],
  disc_famerp_2023_q15: [
    ['Δt = 5,0 × 10⁻¹⁰ s.', '1,0 × 10¹⁰ colisões.'],
    ['T = 1,0 × 10³ K.', 'v = 1,0 × 10³ m/s.'],
  ],
  disc_famerp_2023_q16: [
    ['a = 5,0 × 10⁹ m/s².', 'F em A = 1,0 × 10¹⁸ N (dobro da distância, força dividida por 4).'],
    ['g = 3,3 × 10⁻⁵ m/s².', 'Peso de 6,6 × 10⁻⁵ N.'],
  ],
  disc_famerp_2023_q17: [
    ['Φ = 5,0 cal/s.', '300 cal em 1 min.'],
    ['β = 4,4 × 10⁻⁵ °C⁻¹.', 'α = 2,2 × 10⁻⁵ °C⁻¹.'],
  ],
  disc_famerp_2023_q18: [
    ['θ = 30° (lei da reflexão).', 'd = 80 cm (simetria do espelho plano).'],
    ['n₂ = 2,5.', 'v = 1,2 × 10⁵ km/s.'],
  ],
  disc_famerp_2023_q19: [
    ['λ = 30 cm.', 'f = 300 Hz.'],
    ['μ_Z = 1,5 g/m.', 'Massa de 0,90 g.'],
  ],
  disc_famerp_2023_q20: [
    ['Resultante nula pela 1ª lei; F = 4,0 × 10⁻⁸ N.', 'Vertical, para cima (+z).'],
    ['qvB = mv²/R, com B = 2,0 × 10³ T.', 'B na direção do eixo z, perpendicular ao plano do movimento.'],
  ],
  // 2022
  disc_famerp_2022_q01: [
    ['Respiração celular consumindo as reservas.', 'Vantagem: crescer rápido em direção à luz antes de esgotar as reservas.'],
    ['Endosperma.', 'Origem na dupla fecundação: núcleo espermático + dois núcleos polares (3n).'],
  ],
  disc_famerp_2022_q02: [
    ['Simetria bilateral.', 'Um cefalópode (polvo, lula, sépia, náutilo).'],
    ['Rádula raspa o alimento.', 'Homóloga: presente no ancestral comum, na base do cladograma.'],
  ],
  disc_famerp_2022_q03: [
    ['Cadeia com três organismos do texto (juçara → macaco → onça ou harpia).', 'Consumidor primário, 2º nível trófico.'],
    ['Um fator biótico (predação, competição, doença, alimento).', 'Não cresce indefinidamente: resistência do meio e capacidade de suporte.'],
  ],
  disc_famerp_2022_q04: [
    ['Veia safena.', 'Valvas impedem o refluxo do sangue.'],
    ['Pressão arterial, maior que a venosa.', 'Coronárias levam O₂ e nutrientes ao miocárdio; obstrução causa infarto.'],
  ],
  disc_famerp_2022_q05: [
    ['Cromossomos em pares de homólogos (2n = 6).', '6 centrômeros.'],
    ['12 cromátides, todas marcadas.', 'Replicação semiconservativa.'],
  ],
  disc_famerp_2022_q06: [
    ['Tuba uterina.', 'pH ácido.'],
    ['Progesterona ou estrógeno.', 'Inibem FSH e LH por retroalimentação negativa, e não há ovulação.'],
  ],
  disc_famerp_2022_q07: [
    ['Dominância incompleta.', 'Heterozigoto MB com fenótipo intermediário (creme).'],
    ['Loci em cromossomos diferentes (segregação independente).', '4 × 8 = 32 combinações.'],
  ],
  disc_famerp_2022_q08: [
    ['Dois fatores entre mutação, seleção natural, migração e deriva.'],
    ['f(Iᴮ) = 0,3.', 'B heterozigoto = 0,24.', 'AB = 0,18.'],
  ],
  disc_famerp_2022_q09: [
    ['Dipolo induzido (London).', 'Etanol.'],
    ['Água < etanol < hexano < éter.', 'Razão ≈ 0,47, com densidade e massa molar.'],
  ],
  disc_famerp_2022_q10: [
    ['Solução 2 (glicose, sem íons).', 'HF + KOH → KF + H₂O.'],
    ['Água angular com o oxigênio voltado para o K⁺.', 'pH = 2,2.'],
  ],
  disc_famerp_2022_q11: [
    ['Ácida.', 'CO₂ como óxido ácido (forma ácido carbônico).'],
    ['7,92 g de CO₂.', 'Rendimento de 90%.'],
  ],
  disc_famerp_2022_q12: [
    ['Pent-2-eno.', 'Isomeria de posição.'],
    ['x = −53 kJ/mol.', 'Complexo ativado em 50 kJ/mol, com o mesmo ΔH.'],
  ],
  disc_famerp_2022_q13: [
    ['Potencial de redução menor que o do ferro: oxidam-se no lugar dele.', 'Zinco, comparando com a redução da água (−0,83 V).'],
    ['2,16 g de Al.', '900 s para a mesma massa de Mg.'],
  ],
  disc_famerp_2022_q14: [
    ['Lipídios.', 'Etapa 1.'],
    ['NaOH forma o sal de sódio, a ponta iônica solúvel em água.', 'Isômero orto do ácido sulfônico.'],
  ],
  disc_famerp_2022_q15: [
    ['a = g = 10 m/s².', 'vy = 4,0 m/s.'],
    ['d = 0,60 m.', 'a₂ = 7,5 m/s².'],
  ],
  disc_famerp_2022_q16: [
    ['4,0 s.', 'ω = π/40 rad/s.'],
    ['ΔEp = 25 J (h = 0,5 m).', '3,6 × 10⁵ voltas, com kWh convertido em joules.'],
  ],
  disc_famerp_2022_q17: [
    ['Aço.', 'α ≈ 1,2 × 10⁻⁵ K⁻¹.'],
    ['0,5 °C/s.', '200 s.'],
  ],
  disc_famerp_2022_q18: [
    ['Imagem a 50 mm, do mesmo lado do objeto.', 'f = 50/9 ≈ 5,6 mm.'],
    ['0,2 mm/s.', 'A(t) = π(2,0 + 0,1t)² mm².'],
  ],
  disc_famerp_2022_q19: [
    ['λ = 7,5 × 10⁻⁸ m.', 'Ultravioleta.'],
    ['E do fóton = 2,64 × 10⁻¹⁸ J.', 'Ec = 1,4 × 10⁻¹⁹ J.'],
  ],
  disc_famerp_2022_q20: [
    ['R_eq = 12,5 Ω.', 'i = 0,40 A.'],
    ['V_a = V_b e as duas igualdades de queda de tensão.', 'Divisão que chega a R₁R₄ = R₂R₃.'],
  ],
};
