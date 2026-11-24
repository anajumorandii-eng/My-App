// Temas das 30 discursivas de Física da Famerp 2022–2026 (6 por prova),
// reescritos a partir da leitura de cada questão real. Os tipos de cobrança
// citam as questões ("2024 q16" = disc_famerp_2024_q16) e o teste confere que
// as 30 aparecem. As perguntas de treino são autorais.
//
// Achados que organizam tudo: a banca pede justificativa por uma lei em quase
// todo item, resolve metade das perguntas por proporção (distância dobrada,
// força a um quarto) e força conversões de unidade. Por isso há um tema só
// para essas ferramentas.

import type { DiscursiveTheme } from '../types';

const md = String.raw;

export const discursivasFisica: DiscursiveTheme[] = [
  {
    id: 'fis-ferramentas',
    subject: 'Física',
    title: 'Ferramentas da resposta: justificar, proporcionar e converter',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Atravessa todas as 30 questões. A Famerp escreve "justificando pelas leis de Newton", "pelas leis da reflexão e pela formação de imagens", "pelo fato de ter sido projetada", "pela configuração final"; pede a força a uma distância dobrada (2023), o campo a $2d$ (2026), o potencial a um terço da distância (2024), a corda com velocidade dobrada (2023); e obriga conversões: kWh para joules (2022), °C para kelvin (2026), cal/s em aquecimento (2022), mm, g/m e mA.`,
    explanation: md`### 1. Justificar com a lei certa
Quando o enunciado diz "justifique", a nota vem da **lei citada pelo nome** e aplicada ao caso. Respostas que só dão o número perdem esse ponto. As justificativas que mais apareceram:
- **1ª lei de Newton**: velocidade constante (ou repouso) → resultante nula. Daí sai "a força elétrica equilibra o peso" ou "a resultante sobre a criança parada é zero".
- **2ª lei**: $F_R = m\,a$; no movimento circular, a força que curva é a **resultante centrípeta**.
- **Leis da reflexão**: ângulo de reflexão = ângulo de incidência; espelho plano forma imagem simétrica.
- **Natureza da imagem**: imagem **projetada** numa tela é **real** (formada pelo encontro dos próprios raios); real em lente convergente é **invertida**.
- **Equilíbrio de fases**: gelo e água juntos ao nível do mar → temperatura de **0 °C**.
- **Teorema da energia cinética**: trabalho da resultante = variação da energia cinética.
- **Conservação**: sem perdas, energia mecânica constante; em colisão, quantidade de movimento constante.

### 2. Raciocínio por proporção
Antes de substituir números, veja **como a grandeza depende** da variável que mudou:
- **Inverso do quadrado** ($1/d^2$): força gravitacional e elétrica, campo de carga puntiforme. Distância dobrada → **1/4**.
- **Inverso** ($1/d$): potencial de carga puntiforme, campo de fio retilíneo. Distância dobrada → **1/2**; um terço da distância → **triplo**.
- **Raiz**: $v = \sqrt{T/\mu}$. Dobrar $v$ com a mesma tração exige $\mu$ **quatro** vezes menor.
- **Quadrado**: energia cinética com a velocidade, área com o aumento linear ($A^2$).
- **Linear**: dilatação com $\Delta T$, carga com o tempo, tempo de aquecimento com o calor.
Isso resolve a questão em uma linha e serve de conferência quando você faz a conta completa.

### 3. Conversões que a banca usa
- $1\ \text{kWh} = 1\,000\ \text{W} \times 3\,600\ \text{s} = 3{,}6 \times 10^6\ \text{J}$.
- $T(\text{K}) = \theta(^\circ\text{C}) + 273$. **Variação** de 1 °C = variação de 1 K.
- $1\ \text{cal} \approx 4{,}2\ \text{J}$ (use se for dado).
- km/h ÷ 3,6 = m/s; 1 L de água = 1 kg; 1 g/cm³ = 1 000 kg/m³; 1 cm² $= 10^{-4}$ m²; mA, mm, μ = $10^{-6}$.
- Trabalhe em SI, **salvo** quando o enunciado dá constantes em outras unidades (cal/(s·cm·°C), Ω·cm): aí mantenha as unidades dele do começo ao fim.

### 4. Ler figura e gráfico
Muitos dados estão só na figura: o número de fusos, a altura dos olhos, as coordenadas do ciclo, o comprimento a 800 K. Copie esses números para o rascunho antes de começar.

### 5. Apresentação que pontua
Para cada pedido: **fórmula literal → substituição com unidades → resultado com unidade e sentido** (quando é vetor). Dois pedidos no item = duas respostas separadas e identificadas.`,
    formulas: [
      { tex: String.raw`F \propto \frac{1}{d^2} \quad\Rightarrow\quad \frac{F_2}{F_1} = \left(\frac{d_1}{d_2}\right)^2`, meaning: md`Gravitação, Coulomb, campo de carga puntiforme.` },
      { tex: String.raw`V,\ B_{\text{fio}} \propto \frac{1}{d}`, meaning: md`Potencial de carga puntiforme e campo de fio retilíneo.` },
      { tex: String.raw`1\ \text{kWh} = 3{,}6 \times 10^6\ \text{J}`, meaning: md`Energia elétrica de consumo para joules.` },
      { tex: String.raw`T = \theta + 273`, meaning: md`Temperatura absoluta, obrigatória em gases.` },
    ],
    applications: [
      md`**Todas as discursivas de Física**: a justificativa e a proporção aparecem em quase todo item.`,
      md`**Química**: gases (kelvin) e conversões de volume e massa.`,
      md`**Matemática**: grandezas diretamente e inversamente proporcionais.`,
    ],
    strategy: [
      md`Grife "justifique" e escreva a lei pelo nome na resposta.`,
      md`Diante de "a uma distância dobrada", escreva a dependência ($1/d$ ou $1/d^2$) antes da conta.`,
      md`Converta tudo no começo e escreva as unidades em cada substituição.`,
      md`Para vetores, dê intensidade, direção e sentido.`,
    ],
    examples: [
      {
        title: 'Proporção',
        prompt: md`A força elétrica entre duas cargas a 30 cm é 0,9 N. Qual a força a 10 cm?`,
        steps: [md`$F \propto 1/d^2$; a distância cai a 1/3.`, md`A força fica $3^2 = 9$ vezes maior: 8,1 N.`],
      },
      {
        title: 'Conversão',
        prompt: md`Um aparelho de 1 500 W fica ligado 2 h. Quantos kWh e quantos joules consome?`,
        steps: [md`$1{,}5\ \text{kW} \times 2\ \text{h} = 3{,}0$ kWh.`, md`$3{,}0 \times 3{,}6\times10^6 = 1{,}08 \times 10^7$ J.`],
      },
    ],
    discursive: {
      prompt: md`Uma esfera de 0,20 kg, presa a um fio, sobe com velocidade constante puxada por um motor. (a) Qual a resultante sobre a esfera? Justifique. (b) Qual a tração no fio ($g = 10\ \text{m/s}^2$)? (c) Se a esfera sobe 3,0 m em 6,0 s, qual a potência útil do motor?`,
      modelAnswer: [md`(a) Zero: pela 1ª lei de Newton, velocidade constante implica resultante nula.`, md`(b) $T = P = 0{,}20 \times 10 = 2{,}0$ N, vertical para cima.`, md`(c) $P = \tau/\Delta t = 2{,}0 \times 3{,}0 / 6{,}0 = 1{,}0$ W.`],
      scoring: [md`Cita a 1ª lei para a resultante nula.`, md`Tração com unidade, direção e sentido.`, md`Potência como trabalho por tempo.`],
    },
    patterns: [
      {
        title: 'Justificar pela lei',
        questions: ['2023 q20', '2023 q18', '2025 q18', '2025 q17', '2026 q15'],
        asks: md`Força elétrica que mantém velocidade constante; ângulo de reflexão e posição da imagem; natureza da imagem projetada; temperatura com gelo e água juntos; resultante sobre a criança em repouso.`,
        solve: [md`Identifique a situação (velocidade constante, reflexão, imagem projetada, coexistência de fases, repouso).`, md`Escreva a lei e a consequência numa frase.`],
        distractors: md`Não há alternativas: perde-se o ponto ao dar só o número, sem nomear a lei.`,
      },
      {
        title: 'Proporção e demonstração',
        questions: ['2023 q16', '2024 q20', '2026 q20', '2022 q20'],
        asks: md`Força do Sol no afélio a $2d$; potencial a 9 m conhecido a 27 m; campo do fio a $2d$ do outro lado; provar a condição de equilíbrio da ponte de Wheatstone.`,
        solve: [md`Escreva a dependência e aplique a razão.`, md`Na prova, parta da corrente nula no galvanômetro: mesmo potencial nos dois pontos, e iguale as quedas de tensão.`],
        distractors: md`Usar $1/d$ onde é $1/d^2$ (ou o contrário) e esquecer que o sentido do campo do fio inverte do outro lado.`,
      },
      {
        title: 'Conversões decisivas',
        questions: ['2022 q16', '2026 q18', '2022 q17'],
        asks: md`Voltas da roda d'água para gerar 50 kWh; temperatura em kelvin no ciclo; aquecimento em cal/s.`,
        solve: [md`kWh → J com $3{,}6\times10^6$.`, md`°C → K antes de $PV/T$.`, md`Capacidade térmica = $m\,c$; taxa = potência / capacidade.`],
        distractors: md`Dividir energia em kWh por energia em J, e usar 57 °C em vez de 330 K.`,
      },
    ],
    traps: [
      { trap: md`Dar só o número quando o enunciado pede justificativa.`, fix: md`Nomeie a lei e aplique ao caso.` },
      { trap: md`Esquecer direção e sentido de uma grandeza vetorial.`, fix: md`Força, campo e velocidade: intensidade, direção e sentido.` },
      { trap: md`Usar °C em $PV = nRT$.`, fix: md`Some 273.` },
    ],
  },

  {
    id: 'fis-dinamica',
    subject: 'Física',
    title: 'Cinemática e dinâmica',
    years: [2022, 2024, 2025, 2026],
    howItFalls: md`Caiu em 4 anos: lançamento horizontal de um gato e outro gato em MUV chegando juntos (2022), caminhão com dois reboques e forças de resistência (2024), decolagem com MUV e 2ª lei (2025), criança em repouso numa plataforma e descendo uma rampa com atrito (2026). A estrutura é sempre: (a) cinemática ou equilíbrio; (b) dinâmica com $F_R = ma$.`,
    explanation: md`### 1. MUV
Aceleração constante:
- $v = v_0 + a\,t$
- $s = s_0 + v_0 t + \dfrac{a t^2}{2}$
- $v^2 = v_0^2 + 2a\Delta s$ (sem tempo)
Partindo do repouso, $v_0 = 0$ simplifica tudo. A **distância restante** numa pista é o comprimento total menos o percorrido.

### 2. Lançamento horizontal
Dois movimentos independentes que duram o **mesmo tempo**:
- Horizontal: MU, $x = v_0\,t$.
- Vertical: queda livre, $y = \frac{g t^2}{2}$ e $v_y = g\,t$.
- Depois de solto, a **única força é o peso**: a aceleração é $g$, em qualquer ponto.
- Dois corpos que "chegam juntos" a um ponto compartilham o **tempo**: ache o tempo por um e use no outro.

### 3. Leis de Newton
1. **Inércia**: resultante nula ↔ repouso ou MRU.
2. $\vec F_R = m\,\vec a$.
3. **Ação e reação**: pares em corpos diferentes, mesma intensidade, sentidos opostos.

### 4. Sistemas de corpos
- Para a **aceleração**, trate o conjunto como um corpo só.
- Para uma **força interna** (tração, força entre reboques), **isole um corpo** e aplique $F_R = ma$ só nele. Se há resistência sobre ele: $F_{\text{puxa}} - F_{\text{resist}} = m\,a$.

### 5. Plano inclinado com atrito
Decomponha o peso: $P\sin\theta$ ao longo da rampa e $P\cos\theta$ perpendicular. A normal é $N = P\cos\theta$ e o atrito $f = \mu N$.
- Descendo com aceleração $a$: $m a = m g\sin\theta - \mu\,m g\cos\theta$, logo $a = g(\sin\theta - \mu\cos\theta)$ (a massa some).
- Com velocidade constante: $\mu = \tan\theta$.
- Numa **superfície horizontal** em repouso, a força da superfície (normal) equilibra o peso.`,
    formulas: [
      { tex: String.raw`v = v_0 + a\,t, \qquad s = s_0 + v_0 t + \frac{a t^2}{2}`, meaning: md`MUV.` },
      { tex: String.raw`v^2 = v_0^2 + 2\,a\,\Delta s`, meaning: md`Torricelli.` },
      { tex: String.raw`x = v_0\,t, \qquad y = \frac{g\,t^2}{2}, \qquad v_y = g\,t`, meaning: md`Lançamento horizontal.` },
      { tex: String.raw`a = g\,(\sin\theta - \mu\cos\theta)`, meaning: md`Descida em rampa com atrito.` },
    ],
    applications: [
      md`**Trânsito**: distância de frenagem cresce com $v^2$; reboques e engates.`,
      md`**Aviação**: comprimento de pista e aceleração de decolagem.`,
      md`**Saúde**: rampas de acessibilidade, quedas.`,
      md`**Matemática**: parábolas e trigonometria.`,
    ],
    strategy: [
      md`Desenhe as forças de cada corpo.`,
      md`Em sistema, ache $a$ pelo conjunto e a força interna isolando um corpo.`,
      md`Em rampa, eixos ao longo e perpendicular ao plano.`,
      md`Use o tempo comum quando dois movimentos acontecem juntos.`,
    ],
    examples: [
      {
        title: 'Distância restante',
        prompt: md`Um carro parte do repouso com $a = 2{,}0\ \text{m/s}^2$ numa reta de 500 m. Onde está após 15 s, e quanto falta?`,
        steps: [md`$s = \frac{2{,}0 \times 15^2}{2} = 225$ m.`, md`Faltam $500 - 225 = 275$ m.`],
      },
      {
        title: 'Atrito na rampa',
        prompt: md`Um bloco desce uma rampa com $\sin\theta = 0{,}6$ e $\cos\theta = 0{,}8$ com $a = 2{,}0\ \text{m/s}^2$ ($g = 10$). Qual $\mu$?`,
        steps: [md`$2{,}0 = 10(0{,}6 - 0{,}8\mu)$.`, md`$0{,}2 = 0{,}6 - 0{,}8\mu \Rightarrow \mu = 0{,}5$.`],
      },
    ],
    discursive: {
      prompt: md`Um trem de dois vagões de 10 t cada é puxado por uma locomotiva e parte do repouso com $a = 0{,}50\ \text{m/s}^2$. Sobre o último vagão atuam 2 000 N de resistência. (a) Qual a velocidade e a distância após 30 s? (b) Qual a resultante sobre o último vagão e a força que o vagão da frente faz sobre ele?`,
      modelAnswer: [md`(a) $v = 0{,}50 \times 30 = 15$ m/s; $d = 0{,}50 \times 30^2 / 2 = 225$ m.`, md`(b) $F_R = 10\,000 \times 0{,}50 = 5{,}0 \times 10^3$ N. $F - 2\,000 = 5\,000 \Rightarrow F = 7{,}0 \times 10^3$ N.`],
      scoring: [md`Equações do MUV com unidades.`, md`Isola o último vagão e aplica $F_R = ma$.`, md`Inclui a resistência na equação.`],
    },
    patterns: [
      {
        title: 'MUV a partir do repouso',
        questions: ['2025 q15', '2024 q15'],
        asks: md`Velocidade e distância após um tempo; força resultante pela 2ª lei; distância que sobra numa pista.`,
        solve: [md`$v = at$, $d = at^2/2$.`, md`$F_R = ma$ com a massa em kg (toneladas × 1 000).`, md`Sobra = total − percorrido.`],
        distractors: md`Usar a massa do conjunto quando a pergunta é sobre um reboque só.`,
      },
      {
        title: 'Força interna e forças de resistência',
        questions: ['2024 q15'],
        asks: md`Resultante no último reboque e força do reboque da frente sobre ele, com 3 000 N de resistência.`,
        solve: [md`Isole o reboque: $F - F_{\text{res}} = ma$.`],
        distractors: md`Esquecer a resistência ou usar a massa total.`,
      },
      {
        title: 'Lançamento horizontal e encontro',
        questions: ['2022 q15'],
        asks: md`Aceleração do gato após o salto, velocidade vertical no chão, distância horizontal e aceleração do outro gato que chega junto.`,
        solve: [md`Após o salto, só o peso: $a = g$.`, md`$v_y = gt$; $d = v_0 t$; $a_2 = 2d/t^2$ com o mesmo $t$.`],
        distractors: md`Dar aceleração horizontal ao gato no ar ou somar velocidades.`,
      },
      {
        title: 'Repouso e rampa com atrito',
        questions: ['2026 q15'],
        asks: md`Resultante e força da plataforma com a criança parada; coeficiente de atrito pela aceleração na rampa.`,
        solve: [md`Parada: resultante zero; normal = peso na horizontal.`, md`$a = g(\sin\theta - \mu\cos\theta)$.`],
        distractors: md`Usar $P\cos\theta$ como normal na plataforma horizontal.`,
      },
    ],
    traps: [
      { trap: md`Achar que velocidade constante exige força.`, fix: md`Velocidade constante = resultante nula.` },
      { trap: md`Usar o peso inteiro como normal na rampa.`, fix: md`$N = P\cos\theta$.` },
      { trap: md`Usar a massa no tempo de queda.`, fix: md`O tempo de queda só depende da altura.` },
    ],
  },

  {
    id: 'fis-energia',
    subject: 'Física',
    title: 'Energia, impulso, colisões e gravitação',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**: roda d'água com energia potencial e kWh (2022), asteroide com força gravitacional a $2d$ e gravidade na superfície (2023), colisão inelástica entre veículos com impulso e energia dissipada (2024), saque e quique da bola de tênis (2025), salto ornamental com energia, empuxo e trabalho (2026).`,
    explanation: md`### 1. Energias
- Cinética $E_c = \frac{m v^2}{2}$; potencial gravitacional $E_p = m g h$; elástica $\frac{k x^2}{2}$.
- Sem atrito nem resistência, a **energia mecânica se conserva**: o que se perde de $E_p$ vira $E_c$.
- Com perdas: energia dissipada = $E_{\text{mec,inicial}} - E_{\text{mec,final}}$.
- **Altura** é a do centro de massa em relação ao nível escolhido (na roda d'água, $h = R\sin 60^\circ$).

### 2. Trabalho e potência
$\tau = F\,d\cos\theta$. **Teorema da energia cinética**: $\tau_{\text{resultante}} = \Delta E_c$. Se a atleta entra na água com 5 500 J e para, o trabalho resultante é $-5\,500$ J. Potência = energia ÷ tempo; energia de um conjunto = energia de um elemento × quantidade.

### 3. Quantidade de movimento e impulso
$\vec Q = m\vec v$ (vetor). Impulso $\vec I = \vec F\Delta t = \Delta\vec Q$. Se o corpo parte do repouso (bola no ponto mais alto do saque), o impulso é a própria $Q$ final. Num quique, a velocidade muda de sentido: use sinais.

### 4. Colisões
- A quantidade de movimento do **sistema** sempre se conserva.
- **Perfeitamente inelástica**: seguem juntos, $m_1v_1 + m_2v_2 = (m_1 + m_2)v'$; é a que mais dissipa energia.
- O impulso sobre **um** dos corpos é a variação da $Q$ **dele**.
- Energia dissipada = $E_c$ antes (soma) − $E_c$ depois.

### 5. Gravitação
$F = \dfrac{G M m}{d^2}$: distância dobrada, força a 1/4. Aceleração de um corpo: $a = F/m$. Gravidade na superfície de um astro: $g = \dfrac{G M}{R^2}$; peso $= m g$ (num asteroide, minúsculo).

### 6. Empuxo junto com energia
Totalmente submerso: $E = d_{\text{água}} V g$. Na desaceleração dentro da água, peso, empuxo e resistência fazem trabalho; o **resultante** é $\Delta E_c$.`,
    formulas: [
      { tex: String.raw`E_c = \frac{m v^2}{2}, \qquad E_p = m g h`, meaning: md`Energias cinética e potencial gravitacional.` },
      { tex: String.raw`\tau_{F_R} = \Delta E_c`, meaning: md`Teorema da energia cinética.` },
      { tex: String.raw`\vec I = \vec F\,\Delta t = \Delta\vec Q, \qquad \vec Q = m\vec v`, meaning: md`Impulso e quantidade de movimento.` },
      { tex: String.raw`F = \frac{G M m}{d^2}, \qquad g = \frac{G M}{R^2}`, meaning: md`Gravitação e gravidade na superfície.` },
    ],
    applications: [
      md`**Energia**: hidrelétricas e rodas d'água (potencial → elétrica).`,
      md`**Trânsito**: perícia de colisões, airbag.`,
      md`**Esportes**: saques, quiques, saltos.`,
      md`**Astronomia**: órbitas e gravidade de asteroides.`,
    ],
    strategy: [
      md`Defina os instantes inicial e final e o que se conserva entre eles.`,
      md`Colisão: conserve $Q$ do sistema; impulso de um corpo = $\Delta Q$ dele.`,
      md`Sem perdas, energia; com perdas, dissipada = diferença.`,
    ],
    examples: [
      {
        title: 'Colisão',
        prompt: md`Um carro de 1 000 kg a 20 m/s bate na traseira de outro de 1 500 kg parado e seguem juntos. Velocidade final e energia dissipada?`,
        steps: [md`$1\,000 \cdot 20 = 2\,500\,v' \Rightarrow v' = 8$ m/s.`, md`Antes: 200 kJ; depois: $\frac{2\,500 \cdot 64}{2} = 80$ kJ; dissipada: 120 kJ.`],
      },
      {
        title: 'Gravidade de um astro',
        prompt: md`Um asteroide esférico de raio 100 m tem massa $1{,}5\times10^{10}$ kg ($G = 6{,}6\times10^{-11}$). Qual a gravidade na superfície?`,
        steps: [md`$g = \dfrac{6{,}6\times10^{-11} \cdot 1{,}5\times10^{10}}{100^2} = \dfrac{0{,}99}{10^4} \approx 9{,}9\times10^{-5}\ \text{m/s}^2$.`],
      },
    ],
    discursive: {
      prompt: md`Uma bola de 0,10 kg cai de 1,8 m e, após o quique, sobe 0,80 m ($g = 10$, sem ar). (a) Com que velocidade chega ao chão? (b) Qual a energia mecânica perdida no quique? (c) Qual o impulso do chão sobre a bola?`,
      modelAnswer: [md`(a) $v = \sqrt{2gh} = \sqrt{36} = 6{,}0$ m/s.`, md`(b) $0{,}10 \cdot 10 \cdot (1{,}8 - 0{,}80) = 1{,}0$ J.`, md`(c) Sobe com $\sqrt{16} = 4{,}0$ m/s. Para cima positivo: $I = 0{,}10\,(4{,}0 - (-6{,}0)) = 1{,}0$ N·s, para cima.`],
      scoring: [md`Conservação da energia na queda.`, md`Perda pela diferença de alturas.`, md`Impulso com sinais e sentido.`],
    },
    patterns: [
      {
        title: 'Energia potencial, potência e kWh',
        questions: ['2022 q16', '2026 q16'],
        asks: md`Tempo para encher reservatórios, velocidade angular, variação de $E_p$ e voltas para 50 kWh; energia potencial da atleta, altura, empuxo e trabalho até parar.`,
        solve: [md`$\omega = 2\pi/T$; altura geométrica pela trigonometria.`, md`Energia total = energia por volta × voltas; kWh em J.`, md`Sem perdas: $E_p = E_c$ na água; $\tau_R = \Delta E_c$.`],
        distractors: md`Usar o raio inteiro como altura e esquecer o fator $3{,}6\times10^6$.`,
      },
      {
        title: 'Impulso e colisão',
        questions: ['2024 q16', '2025 q16'],
        asks: md`$Q$ de um veículo e impulso que ele recebe; energia dissipada; $Q$ e impulso no saque; energia máxima que a bola pode perder.`,
        solve: [md`Impulso sobre A = $Q_A$ depois − $Q_A$ antes.`, md`Dissipada = soma das $E_c$ antes − depois.`, md`Perda máxima = $E_c$ no chão − $mgh_{\text{mínima}}$.`],
        distractors: md`Usar a $Q$ do sistema para o impulso de um carro só.`,
      },
      {
        title: 'Gravitação',
        questions: ['2023 q16'],
        asks: md`Aceleração do asteroide no periélio, força no afélio a $2d$, gravidade e peso na superfície.`,
        solve: [md`$a = F/m$.`, md`$1/d^2$: força a 1/4.`, md`$g = GM/R^2$; peso $= mg$.`],
        distractors: md`Reduzir a força à metade.`,
      },
    ],
    traps: [
      { trap: md`Somar velocidades sem sinal num quique.`, fix: md`$\vec Q$ é vetor.` },
      { trap: md`Conservar energia cinética numa colisão inelástica.`, fix: md`Só $Q$ se conserva sempre.` },
      { trap: md`Força gravitacional à metade com distância dobrada.`, fix: md`É a um quarto.` },
    ],
  },

  {
    id: 'fis-termologia',
    subject: 'Física',
    title: 'Termologia: dilatação, calorimetria, gases e termodinâmica',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**, com sete questões: escolha de eixo pela dilatação num gráfico e taxa de aquecimento (2022), teoria cinética dos gases (2023), condução de calor e dilatação superficial (2023), resfriamento isovolumétrico com 1ª lei e Clapeyron (2024), aquecimento e equilíbrio água–gelo (2025), dilatação do recipiente e aparente da glicerina (2026), ciclo de máquina térmica no diagrama P × V com potência (2026).`,
    explanation: md`### 1. Dilatação
- Linear: $\Delta L = L_0\,\alpha\,\Delta T$; superficial: $\Delta A = A_0\,\beta\,\Delta T$, $\beta = 2\alpha$; volumétrica: $\Delta V = V_0\,\gamma\,\Delta T$, $\gamma = 3\alpha$.
- Calcular o coeficiente: $\alpha = \dfrac{\Delta L}{L_0\,\Delta T}$. Num gráfico $L \times T$, leia $\Delta L$ e $\Delta T$ nos pontos indicados.
- **Limite por faixa**: "0,025 cm a cada 100 K" vira 0,125 cm em 500 K: compare cada material com esse valor.
- **Recipiente com líquido**: os dois dilatam. Volume livre final = volume do recipiente dilatado − volume do líquido dilatado. Dilatação aparente: $\gamma_{\text{ap}} = \gamma_{\text{líq}} - \gamma_{\text{rec}}$.

### 2. Calorimetria e potência térmica
- $Q = m c \Delta\theta$; $Q = m L$; capacidade térmica $C = m c$.
- Fonte com potência $P$ (cal/s): $\Delta\theta / \Delta t = P / C$. Tempo = calor ÷ potência.
- Equilíbrio: $\sum Q = 0$. Se **sobra gelo com água**, o equilíbrio é **0 °C** (ao nível do mar) e o calor cedido pela água só funde parte do gelo: $m_{\text{fundida}} = Q_{\text{cedido}}/L$.

### 3. Condução
Fluxo de calor por uma barra: $\Phi = \dfrac{k A \Delta\theta}{L}$. Calor em um tempo: $Q = \Phi \cdot \Delta t$.

### 4. Gases ideais e teoria cinética
- $PV = nRT$; $\dfrac{PV}{T}$ constante para a mesma massa de gás. **T em kelvin**.
- Transformações: isovolumétrica ($P/T$ const.), isobárica ($V/T$), isotérmica ($PV$).
- Para a pressão voltar ao valor inicial a uma temperatura menor, com volume fixo, é preciso **mais mols**: $n \propto P/T$.
- **Teoria cinética**: a energia cinética média de cada molécula é $\frac32 k T$; a temperatura mede essa agitação. Velocidade com energia média: $\frac12 m v^2 = E_c$. Tempo entre colisões = caminho livre médio ÷ velocidade.

### 5. Primeira lei e ciclos
$\Delta U = Q - \tau$.
- **Volume constante**: $\tau = 0$, então $Q = \Delta U$ (se $U$ caiu 225 kJ, o gás perdeu 225 kJ).
- Trabalho = **área** sob a curva em $P \times V$.
- **Ciclo**: $\Delta U = 0$; trabalho = **área interna** (trapézio, retângulo); sentido horário = máquina (trabalho positivo).
- Potência da máquina = trabalho por ciclo × ciclos por segundo.`,
    formulas: [
      { tex: String.raw`\Delta L = L_0\,\alpha\,\Delta T,\quad \beta = 2\alpha,\quad \gamma = 3\alpha`, meaning: md`Dilatações.` },
      { tex: String.raw`\gamma_{\text{ap}} = \gamma_{\text{líq}} - \gamma_{\text{rec}}`, meaning: md`Dilatação aparente.` },
      { tex: String.raw`Q = m c \Delta\theta,\qquad Q = m L,\qquad \frac{\Delta\theta}{\Delta t} = \frac{P}{m c}`, meaning: md`Calorimetria e taxa de aquecimento.` },
      { tex: String.raw`\Phi = \frac{k A \Delta\theta}{L}`, meaning: md`Condução.` },
      { tex: String.raw`\frac{P_1V_1}{T_1} = \frac{P_2V_2}{T_2},\qquad \Delta U = Q - \tau`, meaning: md`Gases e 1ª lei.` },
      { tex: String.raw`\bar{E}_c = \tfrac32\,k\,T`, meaning: md`Energia cinética média por molécula.` },
    ],
    applications: [
      md`**Engenharia**: eixos, trilhos e pontes com folga de dilatação.`,
      md`**Cotidiano**: gelo no refrigerante, chaleira, frascos que transbordam.`,
      md`**Motores**: ciclos térmicos e potência.`,
      md`**Química**: gases ideais e estequiometria.`,
    ],
    strategy: [
      md`Identifique o que fica constante (volume, pressão, temperatura).`,
      md`Converta para kelvin em gases.`,
      md`Com gelo, decida primeiro se sobra gelo.`,
      md`No ciclo, calcule a área como figura geométrica.`,
    ],
    examples: [
      {
        title: 'Recipiente e líquido',
        prompt: md`Um frasco de 400 cm³ ($\gamma = 3\times10^{-5}$) cheio de um líquido ($\gamma = 9\times10^{-4}$) é aquecido em 50 °C. Quanto transborda?`,
        steps: [md`$\gamma_{\text{ap}} = 8{,}7\times10^{-4}$.`, md`$\Delta V = 400 \cdot 8{,}7\times10^{-4} \cdot 50 = 17{,}4$ cm³.`],
      },
      {
        title: 'Ciclo',
        prompt: md`Um ciclo horário é um retângulo entre $P = 1$ e $3\times10^5$ Pa e $V = 2$ e $5\times10^{-3}$ m³, a 10 ciclos por segundo. Trabalho por ciclo e potência?`,
        steps: [md`$\tau = 2\times10^5 \cdot 3\times10^{-3} = 600$ J.`, md`$P = 600 \times 10 = 6\,000$ W.`],
      },
    ],
    discursive: {
      prompt: md`Num recipiente rígido, 20 mol de gás a 400 K e $2{,}0\times10^5$ Pa são resfriados a 200 K, perdendo 50 kJ de calor. (a) Qual o trabalho e a variação de energia interna? (b) Qual a nova pressão? Quantos mols é preciso acrescentar, a 200 K, para voltar a $2{,}0\times10^5$ Pa?`,
      modelAnswer: [md`(a) Volume constante: $\tau = 0$. $\Delta U = Q = -50$ kJ.`, md`(b) $P/T$ constante: $P = 2{,}0\times10^5 \cdot 200/400 = 1{,}0\times10^5$ Pa. Com $V$ e $T$ fixos, $n \propto P$: são necessários 40 mol, acrescentar 20 mol.`],
      scoring: [md`Justifica $\tau = 0$ pelo volume constante.`, md`Aplica a 1ª lei com o sinal do calor.`, md`Proporção $P/T$ e $n \propto P$.`],
    },
    patterns: [
      {
        title: 'Dilatação por gráfico, por área e com recipiente',
        questions: ['2022 q17', '2023 q17', '2026 q17'],
        asks: md`Escolher o material pelo limite e calcular α; β e α pela variação de área; γ do vidro e dilatação e γ da glicerina pelo volume livre.`,
        solve: [md`Converta o limite para a faixa do gráfico.`, md`$\alpha = \Delta L / (L_0 \Delta T)$; $\beta = 2\alpha$; $\gamma = 3\alpha$.`, md`Volume da glicerina = recipiente dilatado − volume livre.`],
        distractors: md`Esquecer que o recipiente também dilata.`,
      },
      {
        title: 'Calorimetria, condução e equilíbrio',
        questions: ['2022 q17', '2023 q17', '2025 q17'],
        asks: md`Taxa de variação de temperatura e tempo; fluxo e calor em 1 min; taxa de absorção e massa de gelo fundida.`,
        solve: [md`Taxa = potência / capacidade térmica.`, md`$\Phi = kA\Delta\theta/L$.`, md`Sobrou gelo → 0 °C → $m = Q/L$.`],
        distractors: md`Calcular uma temperatura de equilíbrio acima de 0 °C quando sobra gelo.`,
      },
      {
        title: 'Gases, teoria cinética e ciclos',
        questions: ['2023 q15', '2024 q17', '2026 q18'],
        asks: md`Tempo entre colisões, temperatura e velocidade pela energia média; trabalho, calor, pressão e mols num resfriamento isovolumétrico; temperatura em C, trabalho do ciclo e potência.`,
        solve: [md`$\bar E_c = \frac32 kT$; $\frac12 mv^2 = \bar E_c$.`, md`Isovolumétrico: $\tau = 0$, $Q = \Delta U$, $P/T$ const.`, md`$PV/T$ const. entre A e C; área do trapézio; potência = $\tau \times$ ciclos/s.`],
        distractors: md`Usar °C e esquecer de passar ciclos por minuto para por segundo.`,
      },
    ],
    traps: [
      { trap: md`Usar °C em gases.`, fix: md`Sempre kelvin.` },
      { trap: md`Esquecer a dilatação do recipiente.`, fix: md`Volume livre = recipiente − líquido, ambos dilatados.` },
      { trap: md`Calcular equilíbrio acima de 0 °C com gelo sobrando.`, fix: md`Gelo e água juntos ao nível do mar: 0 °C.` },
    ],
  },

  {
    id: 'fis-optica',
    subject: 'Física',
    title: 'Óptica geométrica',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**: lupa com imagem virtual e taxa de crescimento da imagem de uma colônia (2022), reflexão e refração numa interface com índice e velocidade (2023), imagens entre espelhos paralelos e em ângulo de 72° (2024), lente que projeta imagem numa parede com altura, foco e vergência (2025), lâmpada vista por reflexão no vidro de uma janela e desvio do raio dentro do vidro (2026).`,
    explanation: md`### 1. Reflexão e espelho plano
- Ângulo de reflexão = ângulo de incidência, **medidos da normal**.
- Imagem num espelho plano: virtual, direita, do mesmo tamanho e **simétrica** (mesma distância atrás do espelho).
- Para **ver a imagem** de um objeto, o ponto de reflexão fica onde o raio refletido chega aos olhos. Se objeto e olho estão na mesma vertical diante de um espelho vertical, o ponto de reflexão fica na **metade** do desnível entre eles.

### 2. Associação de espelhos
- **Paralelos**: infinitas imagens. Cada imagem de um espelho serve de objeto para o outro. Distâncias: a 1ª imagem de E₁ fica à distância do objeto a E₁; a 2ª é a imagem, em E₁, da 1ª imagem de E₂.
- **Em ângulo** $\alpha$: $N = \dfrac{360^\circ}{\alpha} - 1$. Imagens **primárias**: uma por espelho (2); o resto são secundárias.

### 3. Refração
$n = c/v$; Snell: $n_1\sin\theta_1 = n_2\sin\theta_2$. Entrando num meio mais refringente, o raio se aproxima da normal. Frequência não muda.
- **Lâmina de faces paralelas**: o raio sai **paralelo** ao incidente, deslocado. Dentro da lâmina, com o ângulo de refração $r$ e o caminho $a$ percorrido, a componente perpendicular à normal é $a \sin r$.

### 4. Lentes
Equação de Gauss $\dfrac1f = \dfrac1p + \dfrac1{p'}$ e aumento $A = -\dfrac{p'}{p}$ (convenção: $p' > 0$ real; $A < 0$ invertida).
- **Lupa**: objeto antes do foco; imagem **virtual, direita, maior**, do mesmo lado do objeto ($p' < 0$).
- **Projeção**: imagem **real** (a tela só recebe imagem real), invertida.
- **Vergência**: $V = 1/f$ com $f$ em **metros** (dioptrias, "graus").
- A imagem amplia **todas** as dimensões lineares por $|A|$: uma taxa de crescimento também é multiplicada por $|A|$; áreas por $A^2$.`,
    formulas: [
      { tex: String.raw`n_1\sin\theta_1 = n_2\sin\theta_2,\qquad n = \frac{c}{v}`, meaning: md`Snell e índice.` },
      { tex: String.raw`\frac{1}{f} = \frac{1}{p} + \frac{1}{p'},\qquad A = -\frac{p'}{p}`, meaning: md`Gauss e aumento.` },
      { tex: String.raw`V = \frac{1}{f}\ (\text{m}) \ \Rightarrow\ \text{di}`, meaning: md`Vergência em dioptrias.` },
      { tex: String.raw`N = \frac{360^\circ}{\alpha} - 1`, meaning: md`Imagens entre dois espelhos.` },
    ],
    applications: [
      md`**Saúde**: lentes corretivas em dioptrias, olho humano, endoscopia.`,
      md`**Biologia**: lupa e microscópio para observar colônias.`,
      md`**Cotidiano**: reflexos em vidraças, projetores, periscópios.`,
    ],
    strategy: [
      md`Desenhe a normal e os raios.`,
      md`Em lente, decida real/virtual pela situação (projetada → real).`,
      md`Use sinais na equação de Gauss e confira o resultado.`,
      md`Vergência: $f$ em metros.`,
    ],
    examples: [
      {
        title: 'Lupa',
        prompt: md`Uma lupa a 4,0 mm de um objeto dá imagem virtual 5 vezes maior. Onde fica a imagem e qual o foco?`,
        steps: [md`$5 = -p'/4 \Rightarrow p' = -20$ mm.`, md`$\frac1f = \frac14 - \frac1{20} = \frac{4}{20} \Rightarrow f = 5{,}0$ mm.`],
      },
      {
        title: 'Espelhos em ângulo',
        prompt: md`Quantas imagens formam dois espelhos a 60°? Quantas primárias?`,
        steps: [md`$N = 360/60 - 1 = 5$.`, md`2 primárias (uma por espelho) e 3 secundárias.`],
      },
    ],
    discursive: {
      prompt: md`Uma lente convergente projeta numa tela, a 1,2 m da lente, a imagem de um slide de 3,0 cm colocado a 0,40 m dela. (a) A imagem é real ou virtual, direita ou invertida? Justifique. (b) Qual a altura da imagem? (c) Qual a vergência da lente?`,
      modelAnswer: [md`(a) Real, porque foi projetada numa tela; numa lente convergente, imagem real é invertida.`, md`(b) $A = -1{,}2/0{,}40 = -3$: 9,0 cm, invertida.`, md`(c) $\frac1f = \frac1{0{,}40} + \frac1{1{,}2} = 2{,}5 + 0{,}83 = 3{,}33$ di.`],
      scoring: [md`Justifica "real" pela projeção.`, md`Aumento com sinal e altura com unidade.`, md`Vergência com $f$ em metros.`],
    },
    patterns: [
      {
        title: 'Lentes: lupa e projeção',
        questions: ['2022 q18', '2025 q18'],
        asks: md`Posição da imagem e foco de uma lupa que amplia 10×; taxa de crescimento e área da imagem; altura, natureza, foco e vergência de uma imagem projetada.`,
        solve: [md`$A = -p'/p$ dá $p'$; Gauss dá $f$.`, md`Taxas lineares multiplicam por $|A|$.`, md`Projetada → real → invertida.`],
        distractors: md`Usar $p'$ positivo numa imagem virtual e $f$ em cm na vergência.`,
      },
      {
        title: 'Reflexão: espelhos e vidraças',
        questions: ['2023 q18', '2024 q18', '2026 q19'],
        asks: md`Ângulo de reflexão e distância da imagem; imagens em espelhos paralelos e em 72°; ângulo com a parede e altura máxima do vidro para ver a lâmpada.`,
        solve: [md`Reflexão = incidência; imagem simétrica.`, md`Paralelos: cada imagem é objeto do outro espelho.`, md`Vidro vertical: normal horizontal; ponto de reflexão na metade do desnível.`],
        distractors: md`Medir ângulos da superfície e contar a imagem do objeto e a imagem da imagem como a mesma.`,
      },
      {
        title: 'Refração: índice, velocidade e lâmina',
        questions: ['2023 q18', '2026 q19'],
        asks: md`Índice e velocidade da luz no meio 2 por Snell; deslocamento do raio dentro do vidro.`,
        solve: [md`Snell com os senos dados.`, md`$v = c/n$.`, md`Componente do caminho: $a\sin r$.`],
        distractors: md`Inverter a razão dos senos.`,
      },
    ],
    traps: [
      { trap: md`Medir ângulos a partir da superfície.`, fix: md`Ângulos são medidos da normal.` },
      { trap: md`Vergência com $f$ em cm.`, fix: md`$f$ em metros.` },
      { trap: md`Achar que imagem projetada pode ser virtual.`, fix: md`Só imagem real se projeta.` },
    ],
  },

  {
    id: 'fis-eletricidade',
    subject: 'Física',
    title: 'Circuitos e eletrostática',
    years: [2022, 2024, 2025],
    howItFalls: md`Caiu em 3 anos: ponte de Wheatstone com resistência equivalente e demonstração da condição de equilíbrio (2022), lanterna de LEDs em série com resistor, potência e energia (2024), potencial de carga puntiforme e elétrons removidos (2024), fio de tungstênio com número de elétrons e 2ª lei de Ohm em centímetros (2025).`,
    explanation: md`### 1. Carga e corrente
$i = \dfrac{Q}{\Delta t}$; $Q = n\,e$ ($e = 1{,}6\times10^{-19}$ C). Um corpo **positivo** perdeu elétrons; negativo ganhou.

### 2. Leis de Ohm
- 1ª: $U = R\,i$.
- 2ª: $R = \rho\,\dfrac{L}{A}$. Se $\rho$ vem em Ω·cm e $A$ em cm², o comprimento sai em cm: mantenha as unidades do enunciado.

### 3. Associações
- **Série**: mesma corrente; tensões somam; $R_{eq} = \sum R$. Num circuito com LEDs e resistor em série, o resistor fica com a tensão que **sobra**.
- **Paralelo**: mesma tensão; correntes somam; dois resistores: $R_{eq} = \dfrac{R_1R_2}{R_1 + R_2}$.
- Dois ramos em série ligados em paralelo: some cada ramo e depois combine em paralelo.

### 4. Ponte de Wheatstone
Amperímetro (ou galvanômetro) entre os pontos $a$ e $b$ marca zero → $V_a = V_b$. Então a queda de tensão de $c$ até $a$ é igual à de $c$ até $b$ ($i_1R_1 = i_2R_3$), e de $a$ até $d$ igual à de $b$ até $d$ ($i_1R_2 = i_2R_4$). Dividindo: $R_1R_4 = R_2R_3$. A banca pede **essa demonstração**.

### 5. Potência e energia
$P = U\,i = R\,i^2 = U^2/R$; $E = P\,\Delta t$ (em joules com t em segundos; em kWh com P em kW e t em horas).

### 6. Eletrostática
- Potencial de carga puntiforme: $V = \dfrac{kQ}{d}$ (escalar, com sinal). $V \propto 1/d$: gráfico $V \times d$ é ramo de **hipérbole**, tendendo a zero longe.
- Campo: $E = \dfrac{k|Q|}{d^2}$; força: $F = \dfrac{k|q_1q_2|}{d^2}$.
- Se o meio muda, $k$ muda; use a proporção com dois pontos no mesmo meio.`,
    formulas: [
      { tex: String.raw`i = \frac{Q}{\Delta t},\qquad Q = n\,e`, meaning: md`Corrente e quantização.` },
      { tex: String.raw`U = R\,i,\qquad R = \rho\,\frac{L}{A}`, meaning: md`Leis de Ohm.` },
      { tex: String.raw`P = U\,i,\qquad E = P\,\Delta t`, meaning: md`Potência e energia.` },
      { tex: String.raw`R_1R_4 = R_2R_3`, meaning: md`Ponte equilibrada.` },
      { tex: String.raw`V = \frac{kQ}{d}`, meaning: md`Potencial de carga puntiforme.` },
    ],
    applications: [
      md`**Cotidiano**: lanternas de LED, chuveiros, conta de luz.`,
      md`**Saúde**: choque elétrico, eletrocardiograma.`,
      md`**Química**: eletrólise usa $Q = it$.`,
      md`**Instrumentação**: a ponte de Wheatstone mede resistências e é base de sensores.`,
    ],
    strategy: [
      md`Redesenhe o circuito com série e paralelo claros.`,
      md`Ache $R_{eq}$, a corrente total e volte aos ramos.`,
      md`Em demonstração, parta de $V_a = V_b$ e escreva as quedas.`,
    ],
    examples: [
      {
        title: 'LEDs',
        prompt: md`Três LEDs de 3,0 V em série com um resistor, numa bateria de 12 V, com 30 mA. Qual o resistor e a energia de cada LED em 10 min?`,
        steps: [md`$U_R = 12 - 9 = 3{,}0$ V; $R = 3{,}0/0{,}030 = 100\ \Omega$.`, md`$P = 3{,}0 \cdot 0{,}030 = 0{,}090$ W; $E = 0{,}090 \cdot 600 = 54$ J.`],
      },
      {
        title: 'Potencial',
        prompt: md`O potencial a 10 m de uma carga é 4,0 mV. Quanto vale a 2,0 m?`,
        steps: [md`$V \propto 1/d$: a distância cai a 1/5.`, md`$V = 20$ mV.`],
      },
    ],
    discursive: {
      prompt: md`Dois ramos em paralelo, um com 10 Ω e 20 Ω em série e outro com 15 Ω e 15 Ω em série, estão ligados a 6,0 V. (a) Qual a resistência equivalente e a corrente total? (b) Qual a potência dissipada no resistor de 20 Ω?`,
      modelAnswer: [md`(a) Ramos de 30 Ω e 30 Ω em paralelo: $R_{eq} = 15\ \Omega$; $i = 6{,}0/15 = 0{,}40$ A.`, md`(b) Cada ramo recebe 6,0 V; no de 30 Ω passa 0,20 A. $P = R i^2 = 20 \cdot 0{,}04 = 0{,}80$ W.`],
      scoring: [md`Soma em série e combina em paralelo.`, md`Corrente do ramo pela tensão comum.`, md`Potência com unidade.`],
    },
    patterns: [
      {
        title: 'Resistência equivalente e ponte',
        questions: ['2022 q20'],
        asks: md`$R_{eq}$ e corrente com a chave aberta; demonstrar $R_1R_4 = R_2R_3$ com o amperímetro em zero.`,
        solve: [md`Ramos em série, depois em paralelo.`, md`$V_a = V_b$; iguale as quedas e divida.`],
        distractors: md`Somar todos os resistores em série e "provar" substituindo números.`,
      },
      {
        title: 'Circuito série, potência e energia',
        questions: ['2024 q19'],
        asks: md`Tensão e resistência do resistor de uma lanterna; potência e energia de cada LED em 5 min.`,
        solve: [md`$U_R$ = bateria − soma dos LEDs.`, md`$P = Ui$; $E = P\,\Delta t$ com t em segundos.`],
        distractors: md`Usar mA como A e minutos como segundos.`,
      },
      {
        title: 'Carga, elétrons, resistividade e potencial',
        questions: ['2025 q20', '2024 q20'],
        asks: md`Elétrons que atravessam o fio em 32 s e comprimento pela resistividade; carga e elétrons removidos pelo potencial; potencial a 9 m e gráfico.`,
        solve: [md`$Q = it$; $n = Q/e$.`, md`$R = U/i$; $L = RA/\rho$.`, md`$Q = Vd/k$; $V \propto 1/d$; hipérbole.`],
        distractors: md`Misturar cm e m na 2ª lei e esboçar o gráfico como reta.`,
      },
    ],
    traps: [
      { trap: md`Somar resistências em paralelo.`, fix: md`Some os inversos.` },
      { trap: md`Achar que a corrente se gasta no resistor.`, fix: md`Em série, a corrente é a mesma.` },
      { trap: md`Desenhar $V \times d$ como reta.`, fix: md`É hipérbole: $V \propto 1/d$.` },
    ],
  },

  {
    id: 'fis-ondas',
    subject: 'Física',
    title: 'Ondas, espectro e física moderna',
    years: [2022, 2023, 2025],
    howItFalls: md`Caiu em 3 anos: opacidade do vidro a partir de uma frequência, região do espectro e efeito fotoelétrico no argônio (2022), onda estacionária com quatro fusos e densidade linear (2023), onda estacionária em corda e em tubos fechado e aberto (2025).`,
    explanation: md`### 1. Equação fundamental
$v = \lambda f$. A velocidade depende do **meio**; a frequência, da **fonte**. Para a luz, $c = \lambda f$ com $c = 3\times10^8$ m/s.

### 2. Espectro eletromagnético
Do maior para o menor comprimento de onda: rádio, micro-ondas, infravermelho, **visível** (cerca de 700 nm a 400 nm, do vermelho ao violeta), **ultravioleta**, raios X, gama. Menor $\lambda$ = maior $f$ = fótons mais energéticos. Para localizar um $\lambda$ calculado, compare com as faixas dadas.

### 3. Efeito fotoelétrico e ionização
$E = hf$; energia cinética do elétron arrancado $= hf - W$ (W = energia mínima de remoção ou de ionização). Só há emissão se $hf \geq W$.

### 4. Corda
$v = \sqrt{T/\mu}$, com $\mu = m/L$ (kg/m). Mesma tração: $v \propto 1/\sqrt{\mu}$; dobrar $v$ exige $\mu/4$.

### 5. Ondas estacionárias
Nós (parados) e ventres; cada **fuso** = $\lambda/2$.
- **Corda presa nas duas pontas** e **tubo aberto nas duas**: $L = n\dfrac{\lambda}{2}$. Menor tubo aberto para um $\lambda$: $\lambda/2$.
- **Tubo fechado numa ponta**: $L = (2n - 1)\dfrac{\lambda}{4}$, só harmônicos ímpares. Menor tubo fechado: $\lambda/4$.
- Conte os fusos na figura para achar $\lambda$; depois $f = v/\lambda$ ou $v = \lambda f$.`,
    formulas: [
      { tex: String.raw`v = \lambda f,\qquad c = \lambda f`, meaning: md`Equação fundamental.` },
      { tex: String.raw`v = \sqrt{\frac{T}{\mu}}`, meaning: md`Corda.` },
      { tex: String.raw`L = n\frac{\lambda}{2},\qquad L = (2n-1)\frac{\lambda}{4}`, meaning: md`Corda/tubo aberto e tubo fechado.` },
      { tex: String.raw`E_c = h f - W`, meaning: md`Fotoelétrico e ionização.` },
    ],
    applications: [
      md`**Música**: cordas e tubos (flauta, órgão), afinação pela tração.`,
      md`**Saúde**: ultravioleta e pele; vidro que bloqueia UV.`,
      md`**Química**: energia de ionização e espectros.`,
    ],
    strategy: [
      md`Conte fusos ou quartos de onda na figura.`,
      md`Converta cm e g/m para m e kg/m.`,
      md`Calcule $\lambda$ e compare com as faixas do espectro.`,
    ],
    examples: [
      {
        title: 'Tubo',
        prompt: md`Para $\lambda = 80$ cm, qual o menor tubo fechado e o menor tubo aberto que ressoam?`,
        steps: [md`Fechado: $\lambda/4 = 20$ cm.`, md`Aberto: $\lambda/2 = 40$ cm.`],
      },
      {
        title: 'Espectro',
        prompt: md`Qual o comprimento de onda de $f = 1{,}0\times10^{15}$ Hz e em que região está?`,
        steps: [md`$\lambda = 3\times10^8/10^{15} = 3\times10^{-7}$ m = 300 nm.`, md`Abaixo de 400 nm: ultravioleta.`],
      },
    ],
    discursive: {
      prompt: md`Uma corda de 1,2 m, presa nas pontas, tem 15 g e vibra com 3 fusos sob tração de 200 N. (a) Qual a velocidade da onda? (b) Qual o comprimento de onda e a frequência? (c) Que tração faria a velocidade dobrar?`,
      modelAnswer: [md`(a) $\mu = 0{,}015/1{,}2 = 0{,}0125$ kg/m; $v = \sqrt{200/0{,}0125} = 126{,}5 \approx 1{,}3\times10^2$ m/s.`, md`(b) $\lambda = 2L/3 = 0{,}80$ m; $f = 126{,}5/0{,}80 \approx 158$ Hz.`, md`(c) $v \propto \sqrt{T}$: tração 4 vezes maior, 800 N.`],
      scoring: [md`Calcula $\mu$ em kg/m.`, md`Relaciona fusos a $\lambda$.`, md`Justifica pela proporção com $\sqrt{T}$.`],
    },
    patterns: [
      {
        title: 'Ondas estacionárias em cordas e tubos',
        questions: ['2023 q19', '2025 q19'],
        asks: md`λ e f com quatro fusos em 60 cm; μ e massa de outra corda com velocidade dobrada; L e velocidade com três fusos; menores tubos fechado e aberto.`,
        solve: [md`Fuso = λ/2.`, md`Mesma tração: $\mu \propto 1/v^2$.`, md`Tubos: λ/4 e λ/2.`],
        distractors: md`Contar ventres como comprimentos de onda e dar ao tubo fechado o mesmo comprimento do aberto.`,
      },
      {
        title: 'Espectro e fotoelétrico',
        questions: ['2022 q19'],
        asks: md`Comprimento de onda a partir do qual o vidro fica opaco e região do espectro; energia cinética do elétron arrancado do argônio.`,
        solve: [md`$\lambda = c/f$ e compare com as faixas.`, md`$E_c = hf - W$.`],
        distractors: md`Situar o ultravioleta acima do visível em comprimento de onda.`,
      },
    ],
    traps: [
      { trap: md`Achar que a frequência muda ao trocar de meio.`, fix: md`Muda velocidade e comprimento de onda.` },
      { trap: md`Harmônicos pares no tubo fechado.`, fix: md`Só ímpares.` },
    ],
  },

  {
    id: 'fis-magnetismo',
    subject: 'Física',
    title: 'Eletromagnetismo',
    years: [2023, 2026],
    howItFalls: md`Caiu em 2023 (partícula com velocidade constante num campo elétrico e depois em movimento circular num campo magnético) e 2026 (campo de um fio a $d$ e a $2d$, dos dois lados, e força num trecho do condutor). Sempre pede **intensidade, direção e sentido** com justificativa.`,
    explanation: md`### 1. Campo elétrico e equilíbrio
Força elétrica $F = qE$ (no sentido de $E$ se $q > 0$). Partícula com velocidade constante: resultante nula (1ª lei), logo a força elétrica equilibra o peso: $qE = mg$, vertical para cima.

### 2. Campo de fio retilíneo
$B = \dfrac{\mu_0 i}{2\pi d}$: proporcional à corrente, inversamente à distância. Linhas circulares em volta do fio, sentido pela **regra da mão direita** (polegar na corrente, dedos curvados = campo). **Do outro lado do fio, o sentido se inverte**: se à esquerda sai da folha, à direita entra.

### 3. Força magnética sobre carga
$F = |q|vB\sin\theta$, **perpendicular** a $\vec v$ e a $\vec B$. Com $\vec v \perp \vec B$, movimento circular uniforme: $|q|vB = \dfrac{mv^2}{R} \Rightarrow B = \dfrac{mv}{|q|R}$. Para o movimento ficar num plano, $\vec B$ é **perpendicular a esse plano**.

### 4. Força sobre condutor
$F = BiL\sin\theta$. Direção pela regra da mão esquerda (ou direita espalmada): campo, corrente e força mutuamente perpendiculares. Corrente para cima e campo entrando na folha: força para a esquerda.

### 5. Unidades
Corrente em mA → A; comprimento em cm → m; campo em T.`,
    formulas: [
      { tex: String.raw`F = qE,\qquad qE = mg`, meaning: md`Força elétrica e equilíbrio com o peso.` },
      { tex: String.raw`B = \frac{\mu_0\,i}{2\pi d}`, meaning: md`Campo de fio retilíneo.` },
      { tex: String.raw`R = \frac{m v}{|q| B}`, meaning: md`Raio da trajetória circular.` },
      { tex: String.raw`F = B\,i\,L\sin\theta`, meaning: md`Força sobre condutor.` },
    ],
    applications: [
      md`**Saúde**: ressonância magnética, espectrômetro de massa.`,
      md`**Tecnologia**: motores, alto-falantes, aceleradores.`,
      md`**Geografia**: campo magnético terrestre.`,
    ],
    strategy: [
      md`Desenhe $\vec v$ (ou $i$) e $\vec B$; aplique a regra da mão.`,
      md`Carga em círculo: iguale magnética e centrípeta.`,
      md`Sempre intensidade, direção e sentido.`,
    ],
    examples: [
      {
        title: 'Campo do outro lado',
        prompt: md`A 3 cm à esquerda de um fio, $B = 8\,\mu$T saindo da folha. Quanto vale a 6 cm à direita?`,
        steps: [md`Distância dobrada: $4\,\mu$T.`, md`Do outro lado: entrando na folha.`],
      },
      {
        title: 'Campo para a órbita',
        prompt: md`Partícula de $2\times10^{-8}$ kg e $4\times10^{-8}$ C a 100 m/s descreve círculo de 0,5 m. Qual $B$?`,
        steps: [md`$B = \dfrac{2\times10^{-8} \cdot 100}{4\times10^{-8} \cdot 0{,}5} = 100$ T.`],
      },
    ],
    discursive: {
      prompt: md`Um fio horizontal de 20 cm, com 500 mA, está num campo de 0,30 T perpendicular a ele. (a) Qual a força magnética? (b) Se o fio tem 3,0 g, que corrente faz a força equilibrar o peso ($g = 10$)? Indique a direção dessa força.`,
      modelAnswer: [md`(a) $F = 0{,}30 \cdot 0{,}500 \cdot 0{,}20 = 0{,}030$ N.`, md`(b) $BiL = mg \Rightarrow i = \dfrac{0{,}003 \cdot 10}{0{,}30 \cdot 0{,}20} = 0{,}50$ A; a força precisa ser vertical, para cima.`],
      scoring: [md`Converte mA e cm.`, md`Iguala força magnética e peso.`, md`Direção e sentido.`],
    },
    patterns: [
      {
        title: 'Equilíbrio elétrico e órbita magnética',
        questions: ['2023 q20'],
        asks: md`Força elétrica que mantém velocidade constante, com direção e sentido justificados; campo magnético para um círculo de raio dado e sua direção.`,
        solve: [md`1ª lei: $qE = mg$, para cima.`, md`$B = mv/(qR)$; $\vec B$ perpendicular ao plano do movimento.`],
        distractors: md`Pôr $\vec B$ no plano do movimento.`,
      },
      {
        title: 'Campo do fio e força no condutor',
        questions: ['2026 q20'],
        asks: md`Vetor campo a $2d$ do outro lado do fio; força sobre 1,0 cm do condutor num campo uniforme.`,
        solve: [md`$B \propto 1/d$: metade; sentido invertido.`, md`$F = BiL$ em SI; regra da mão.`],
        distractors: md`Manter o mesmo sentido do outro lado e usar 200 mA como 200 A.`,
      },
    ],
    traps: [
      { trap: md`Achar que a força magnética acelera a carga ao longo da trajetória.`, fix: md`Ela é perpendicular à velocidade.` },
      { trap: md`Esquecer que o campo do fio inverte de sentido do outro lado.`, fix: md`Linhas circulares em volta do fio.` },
    ],
  },
];
