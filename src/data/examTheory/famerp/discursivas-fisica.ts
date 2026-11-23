// Temas que se repetem nas 30 discursivas de Física da Famerp 2022–2026
// (6 por prova). Perguntas de treino autorais.

import type { DiscursiveTheme } from '../types';

const md = String.raw;

export const discursivasFisica: DiscursiveTheme[] = [
  {
    id: 'fis-optica',
    subject: 'Física',
    title: 'Óptica geométrica',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**: lupa com imagem virtual e ampliação de área (2022), reflexão e refração numa interface plana (2023), imagens em espelhos planos paralelos e em ângulo (2024), lente convergente projetando imagem (2025), espelho plano e refração em lâmina de faces paralelas (2026).`,
    explanation: md`### Reflexão
O ângulo de incidência é igual ao de reflexão, ambos medidos em relação à **normal**.
- **Espelho plano**: a imagem é virtual, direita, do mesmo tamanho e simétrica ao objeto (mesma distância atrás do espelho).
- Dois espelhos em ângulo $\alpha$: $N = \dfrac{360^\circ}{\alpha} - 1$ imagens (quando o resultado é inteiro). Espelhos paralelos formam infinitas imagens.

### Refração
Ao mudar de meio, a luz muda de velocidade e, se a incidência é oblíqua, de direção.
- Índice de refração $n = c/v$: quanto maior, mais lenta a luz.
- Entrando num meio mais refringente, o raio se **aproxima** da normal.
- A **frequência não muda**; velocidade e comprimento de onda mudam.
- **Lâmina de faces paralelas**: o raio sai paralelo ao que entrou, só deslocado lateralmente.
- **Reflexão total**: do meio mais refringente para o menos, acima do ângulo-limite (fibra óptica).

### Lentes
- **Convergente**: objeto além de $2f$ → imagem real, invertida, menor (câmera). Entre $f$ e $2f$ → real, invertida, **maior** (projetor). Antes de $f$ → **virtual, direita, maior** (**lupa**).
- **Divergente**: sempre virtual, direita e menor.
- Convenção: $f > 0$ convergente; $p' > 0$ imagem real; $A < 0$ imagem invertida.
- Se a imagem é $A$ vezes maior em tamanho, a **área** é $A^2$ vezes maior.`,
    formulas: [
      { tex: String.raw`n_1 \sin\theta_1 = n_2 \sin\theta_2`, meaning: md`Lei de Snell; ângulos medidos da normal.` },
      { tex: String.raw`n = \frac{c}{v}`, meaning: md`Índice de refração.` },
      { tex: String.raw`\frac{1}{f} = \frac{1}{p} + \frac{1}{p'}`, meaning: md`Equação de Gauss para lentes e espelhos esféricos.` },
      { tex: String.raw`A = \frac{i}{o} = -\frac{p'}{p}`, meaning: md`Aumento linear; a área aumenta $A^2$.` },
      { tex: String.raw`N = \frac{360^\circ}{\alpha} - 1`, meaning: md`Imagens entre dois espelhos planos.` },
    ],
    applications: [
      md`**Saúde**: olho humano (cristalino é lente convergente), correção de miopia (divergente) e hipermetropia (convergente), endoscopia por fibra óptica.`,
      md`**Biologia**: microscópio óptico.`,
      md`**Cotidiano**: lupa, projetor, câmera, retrovisor.`,
      md`**Física moderna**: frequência da luz e energia do fóton.`,
    ],
    strategy: [
      md`Faça o desenho com a normal e os raios.`,
      md`Em lente, localize o objeto em relação a $f$ e $2f$ antes de calcular.`,
      md`Escreva Gauss com sinais e confira se o resultado faz sentido (real ou virtual).`,
    ],
    examples: [
      {
        title: 'Lupa',
        prompt: md`Uma lupa de $f = 10$ cm está a 5 cm de um selo. Onde se forma a imagem e qual o aumento?`,
        steps: [md`$\dfrac{1}{10} = \dfrac{1}{5} + \dfrac{1}{p'} \Rightarrow \dfrac{1}{p'} = -\dfrac{1}{10} \Rightarrow p' = -10$ cm (virtual).`, md`$A = -\dfrac{-10}{5} = 2$: direita, 2 vezes maior; área 4 vezes maior.`],
      },
      {
        title: 'Snell',
        prompt: md`Luz passa do ar ($n = 1$) para a água ($n = 1{,}33$) com incidência de 30°. Qual o seno do ângulo de refração?`,
        steps: [md`$1 \cdot \sin 30^\circ = 1{,}33 \sin\theta_2$.`, md`$\sin\theta_2 = 0{,}5/1{,}33 \approx 0{,}38$: o raio se aproxima da normal.`],
      },
    ],
    discursive: {
      prompt: md`Um projetor usa uma lente convergente de distância focal 20 cm para formar, numa tela a 3,0 m da lente, a imagem de um slide. (a) A que distância da lente deve ficar o slide? (b) A imagem é direita ou invertida? Justifique. (c) Quantas vezes a área da imagem é maior que a do slide?`,
      modelAnswer: [md`(a) $\dfrac{1}{20} = \dfrac{1}{p} + \dfrac{1}{300} \Rightarrow \dfrac{1}{p} = \dfrac{15 - 1}{300} \Rightarrow p \approx 21{,}4$ cm.`, md`(b) Invertida: é imagem real ($p' > 0$), e $A = -p'/p < 0$.`, md`(c) $|A| = 300/21{,}4 = 14$; área $14^2 = 196$ vezes maior.`],
      scoring: [md`Gauss com unidades coerentes.`, md`Justifica pela imagem real e o sinal de $A$.`, md`Usa $A^2$ para a área.`],
    },
    traps: [
      { trap: md`Medir o ângulo a partir da superfície.`, fix: md`Ângulos são medidos a partir da normal.` },
      { trap: md`Achar que a frequência muda na refração.`, fix: md`Mudam a velocidade e o comprimento de onda.` },
      { trap: md`Usar $A$ para a área.`, fix: md`A área aumenta $A^2$.` },
    ],
  },

  {
    id: 'fis-dinamica',
    subject: 'Física',
    title: 'Cinemática e dinâmica',
    years: [2022, 2024, 2025, 2026],
    howItFalls: md`Caiu em 4 anos: lançamento horizontal e MUV com dois gatos (2022), caminhão com dois reboques (2024), decolagem com MUV e 2ª lei (2025), plano inclinado com atrito num escorregador (2026).`,
    explanation: md`### Movimento uniformemente variado
Aceleração constante. Três equações; escolha a que não tem a grandeza que você não conhece.

### Lançamento horizontal
Dois movimentos independentes:
- Horizontal: MU, $x = v_0\,t$.
- Vertical: queda livre, $y = \frac{g t^2}{2}$.
O **tempo de queda depende só da altura**, não da velocidade horizontal nem da massa.

### Leis de Newton
1. Inércia: sem força resultante, o corpo mantém o estado de movimento.
2. $\vec F_R = m\,\vec a$.
3. Ação e reação: forças em corpos diferentes, mesma intensidade e sentidos opostos.

### Sistemas de corpos ligados
Trate o conjunto como um corpo só para achar a aceleração: $a = \dfrac{F}{m_{\text{total}}}$. Depois isole um corpo para achar a tração: cada fio puxa **só a massa que vem atrás dele**.

### Plano inclinado
Decomponha o peso: $P\sin\theta$ ao longo do plano, $P\cos\theta$ perpendicular. A normal é $N = P\cos\theta$ e o atrito $f = \mu N$.
- Corpo em repouso ou com velocidade constante: força resultante zero.
- Corpo prestes a deslizar: $\tan\theta = \mu_e$.`,
    formulas: [
      { tex: String.raw`v = v_0 + a\,t`, meaning: md`Velocidade no MUV.` },
      { tex: String.raw`s = s_0 + v_0\,t + \frac{a\,t^2}{2}`, meaning: md`Posição no MUV.` },
      { tex: String.raw`v^2 = v_0^2 + 2\,a\,\Delta s`, meaning: md`Torricelli: quando o tempo não aparece.` },
      { tex: String.raw`F_R = m\,a, \qquad f_{at} = \mu\,N`, meaning: md`2ª lei e atrito.` },
      { tex: String.raw`P_{\parallel} = P\sin\theta, \qquad N = P\cos\theta`, meaning: md`Componentes do peso no plano inclinado.` },
    ],
    applications: [
      md`**Trânsito**: distância de frenagem cresce com $v^2$ (Torricelli); cinto de segurança e inércia.`,
      md`**Esportes**: saltos e lançamentos.`,
      md`**Saúde**: forças em próteses e rampas de acessibilidade.`,
      md`**Matemática**: parábolas e trigonometria.`,
    ],
    strategy: [
      md`Desenhe o diagrama de forças de cada corpo.`,
      md`Escolha os eixos (ao longo do plano, perpendicular a ele).`,
      md`Aplique $F_R = ma$ em cada eixo e resolva.`,
      md`Escreva a fórmula, substitua com unidades e dê o resultado com unidade.`,
    ],
    examples: [
      {
        title: 'Decolagem',
        prompt: md`Um avião parte do repouso e decola a 72 m/s após percorrer 1800 m em MUV. Qual a aceleração e a força resultante, se a massa é 50 t?`,
        steps: [md`$72^2 = 0 + 2a \cdot 1800 \Rightarrow a = 1{,}44\ \text{m/s}^2$.`, md`$F = 5{,}0\times10^4 \times 1{,}44 = 7{,}2\times10^4$ N.`],
      },
      {
        title: 'Reboques',
        prompt: md`Um caminhão puxa dois reboques de 4 t e 2 t, nessa ordem, com aceleração de 0,5 m/s². Qual a tração entre os dois reboques?`,
        steps: [md`O fio entre eles puxa só o último: $T = 2000 \times 0{,}5 = 1000$ N.`],
      },
    ],
    discursive: {
      prompt: md`Uma criança de 30 kg desce um escorregador inclinado de 30° com velocidade constante ($g = 10\ \text{m/s}^2$). (a) Represente as forças sobre ela. (b) Calcule a força de atrito. (c) Qual o coeficiente de atrito cinético?`,
      modelAnswer: [md`(a) Peso (vertical, para baixo), normal (perpendicular ao plano) e atrito (ao longo do plano, para cima).`, md`(b) Velocidade constante: $F_R = 0$, logo $f = P\sin 30^\circ = 300 \times 0{,}5 = 150$ N.`, md`(c) $N = P\cos 30^\circ = 300 \times 0{,}87 \approx 260$ N; $\mu = 150/260 \approx 0{,}58$ (igual a $\tan 30^\circ$).`],
      scoring: [md`Três forças com direções corretas.`, md`Usa velocidade constante para $F_R = 0$.`, md`Calcula $N$ com o cosseno e o coeficiente com unidade adimensional.`],
    },
    traps: [
      { trap: md`Usar a massa no tempo de queda.`, fix: md`O tempo de queda só depende da altura.` },
      { trap: md`Achar que velocidade constante exige força.`, fix: md`Velocidade constante significa força resultante nula.` },
      { trap: md`Usar o peso inteiro como normal no plano inclinado.`, fix: md`$N = P\cos\theta$.` },
    ],
  },

  {
    id: 'fis-termologia',
    subject: 'Física',
    title: 'Termologia: dilatação, calorimetria, gases e termodinâmica',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**: escolha de eixo pela dilatação linear (2022), teoria cinética dos gases e condução com dilatação superficial do alumínio (2023), resfriamento isovolumétrico com 1ª lei e Clapeyron (2024), aquecimento e equilíbrio água–gelo (2025), dilatação aparente da glicerina e ciclo de máquina térmica no diagrama P × V (2026).`,
    explanation: md`### Dilatação
Aquecido, um corpo aumenta de tamanho na proporção do tamanho inicial e da variação de temperatura.
- Linear ($\alpha$), superficial ($\beta = 2\alpha$), volumétrica ($\gamma = 3\alpha$).
- Num recipiente cheio de líquido, os dois dilatam: o que transborda é a **dilatação aparente**, $\gamma_{\text{ap}} = \gamma_{\text{líq}} - \gamma_{\text{rec}}$.
- Um furo numa chapa **aumenta** quando a chapa esquenta, como se fosse do mesmo material.

### Calorimetria
Calor sensível e latente, e $\sum Q = 0$ em sistema isolado (veja o capítulo da objetiva).

### Gases
Gás ideal: $PV = nRT$, temperatura em **kelvin**. A temperatura mede a **energia cinética média** das moléculas (teoria cinética).
- Isotérmica: $PV$ constante. Isobárica: $V/T$ constante. Isovolumétrica: $P/T$ constante.

### Primeira lei
$\Delta U = Q - \tau$. O calor recebido vira variação de energia interna e trabalho.
- **Isovolumétrica**: $\tau = 0$, logo $\Delta U = Q$.
- **Isotérmica**: $\Delta U = 0$, logo $Q = \tau$.
- **Adiabática**: $Q = 0$, logo $\Delta U = -\tau$.
- Trabalho = **área** sob a curva no diagrama $P \times V$; expansão: $\tau > 0$.
- **Ciclo**: $\Delta U = 0$, e o trabalho é a área **dentro** do ciclo (horário: o gás realiza trabalho, é uma máquina térmica).
- Rendimento: $\eta = \tau / Q_{\text{quente}}$, sempre menor que 1 (2ª lei).`,
    formulas: [
      { tex: String.raw`\Delta L = L_0\,\alpha\,\Delta T, \quad \Delta A = A_0\,\beta\,\Delta T, \quad \Delta V = V_0\,\gamma\,\Delta T`, meaning: md`Dilatações; $\beta = 2\alpha$, $\gamma = 3\alpha$.` },
      { tex: String.raw`\gamma_{\text{ap}} = \gamma_{\text{líq}} - \gamma_{\text{rec}}`, meaning: md`Dilatação aparente do líquido no recipiente.` },
      { tex: String.raw`PV = nRT, \qquad \frac{P_1V_1}{T_1} = \frac{P_2V_2}{T_2}`, meaning: md`Gás ideal, $T$ em kelvin.` },
      { tex: String.raw`\Delta U = Q - \tau, \qquad \tau = P\,\Delta V\ \text{(pressão constante)}`, meaning: md`Primeira lei da termodinâmica.` },
      { tex: String.raw`\eta = \frac{\tau}{Q_q} = 1 - \frac{Q_f}{Q_q}`, meaning: md`Rendimento da máquina térmica.` },
    ],
    applications: [
      md`**Engenharia**: juntas de dilatação em pontes e trilhos.`,
      md`**Saúde**: termômetros, pressão nos pulmões (lei de Boyle na respiração).`,
      md`**Clima**: massas de ar que sobem se expandem e esfriam (adiabática).`,
      md`**Química**: gases na estequiometria.`,
      md`**Motores**: ciclos de máquinas térmicas e refrigeradores.`,
    ],
    strategy: [
      md`Identifique a transformação (qual grandeza é constante).`,
      md`Converta a temperatura para kelvin em gases.`,
      md`Em diagrama $P \times V$, calcule áreas como figuras geométricas.`,
      md`Na 1ª lei, cuide dos sinais: calor recebido +, trabalho realizado pelo gás +.`,
    ],
    examples: [
      {
        title: 'Dilatação aparente',
        prompt: md`Um frasco de vidro ($\gamma = 3\times10^{-5}\ {}^\circ\text{C}^{-1}$) cheio com 500 mL de glicerina ($\gamma = 5\times10^{-4}\ {}^\circ\text{C}^{-1}$) é aquecido em 40 °C. Quanto transborda?`,
        steps: [md`$\gamma_{\text{ap}} = 5\times10^{-4} - 3\times10^{-5} = 4{,}7\times10^{-4}\ {}^\circ\text{C}^{-1}$.`, md`$\Delta V = 500 \times 4{,}7\times10^{-4} \times 40 = 9{,}4$ mL.`],
      },
      {
        title: 'Ciclo',
        prompt: md`Um gás percorre, no sentido horário, um retângulo no diagrama $P \times V$ entre $P = 1\times10^5$ e $3\times10^5$ Pa e $V = 1\times10^{-3}$ e $4\times10^{-3}$ m³. Qual o trabalho por ciclo?`,
        steps: [md`Área $= (3 - 1)\times10^5 \times (4 - 1)\times10^{-3} = 600$ J.`, md`Sentido horário: o gás realiza 600 J por ciclo, e $\Delta U = 0$.`],
      },
    ],
    discursive: {
      prompt: md`Um cilindro rígido contém gás a 27 °C e $2{,}0\times10^5$ Pa. Ele é resfriado até −73 °C. (a) Qual a pressão final? (b) O gás realizou trabalho? Justifique. (c) Pela primeira lei, o que aconteceu com a energia interna?`,
      modelAnswer: [md`(a) Volume constante: $\dfrac{P_1}{T_1} = \dfrac{P_2}{T_2} \Rightarrow \dfrac{2{,}0\times10^5}{300} = \dfrac{P_2}{200} \Rightarrow P_2 \approx 1{,}3\times10^5$ Pa.`, md`(b) Não: o volume não variou, então $\tau = 0$.`, md`(c) $\Delta U = Q - 0 = Q$; como o gás cedeu calor ($Q < 0$), a energia interna diminuiu, coerente com a queda de temperatura.`],
      scoring: [md`Converte para kelvin e usa $P/T$ constante.`, md`Justifica $\tau = 0$ pelo volume constante.`, md`Aplica a 1ª lei com o sinal do calor.`],
    },
    traps: [
      { trap: md`Usar °C nos gases.`, fix: md`Sempre kelvin.` },
      { trap: md`Esquecer a dilatação do recipiente.`, fix: md`O que transborda é a dilatação aparente.` },
      { trap: md`Achar que o furo de uma chapa diminui ao aquecer.`, fix: md`O furo dilata como se fosse do mesmo material.` },
    ],
  },

  {
    id: 'fis-energia',
    subject: 'Física',
    title: 'Energia, impulso e colisões',
    years: [2022, 2024, 2025, 2026],
    howItFalls: md`Caiu em 4 anos: roda d'água com tempo, velocidade angular e energia (2022), colisão inelástica entre dois veículos (2024), impulso e energia perdida no quique de uma bola de tênis (2025) e salto ornamental com energia, empuxo e trabalho (2026).`,
    explanation: md`### Energia mecânica
Soma da cinética com as potenciais. Sem atrito nem resistência do ar, ela se **conserva**: o que se perde de potencial vira cinética.
Com forças dissipativas, a energia dissipada é a diferença entre a energia mecânica inicial e a final.

### Trabalho e potência
O trabalho de uma força transfere energia: $\tau = F\,d\cos\theta$. O **teorema da energia cinética** diz que o trabalho da resultante é a variação da energia cinética. Potência é a rapidez com que se transfere energia.

### Quantidade de movimento e impulso
$\vec Q = m\vec v$ é um vetor. O impulso de uma força é $\vec I = \vec F\,\Delta t$, e é igual à variação de $\vec Q$. Num quique, a velocidade troca de sentido: $\Delta Q = m(v_f - v_i)$ com sinais, o que dá uma variação **maior** que a velocidade de chegada.

### Colisões
A quantidade de movimento do sistema **sempre se conserva** (as forças da colisão são internas).
- **Elástica**: conserva também a energia cinética.
- **Inelástica**: perde energia cinética.
- **Perfeitamente inelástica**: os corpos seguem **juntos**; é a que mais perde energia.
- Coeficiente de restituição $e$: 1 elástica, 0 perfeitamente inelástica.

### Combinação com empuxo
Num salto na piscina, a energia potencial vira cinética até a água; dentro dela, o empuxo e a resistência fazem trabalho negativo até o mergulhador parar.`,
    formulas: [
      { tex: String.raw`E_c = \frac{m\,v^2}{2}, \quad E_p = m\,g\,h, \quad E_{el} = \frac{k\,x^2}{2}`, meaning: md`Energias cinética, potencial gravitacional e elástica.` },
      { tex: String.raw`\tau_{F_R} = \Delta E_c`, meaning: md`Teorema da energia cinética.` },
      { tex: String.raw`\vec I = \vec F\,\Delta t = \Delta \vec Q`, meaning: md`Impulso: área sob o gráfico $F \times t$.` },
      { tex: String.raw`m_1 v_1 + m_2 v_2 = (m_1 + m_2)\,v'`, meaning: md`Colisão perfeitamente inelástica.` },
      { tex: String.raw`P = \frac{\tau}{\Delta t} = F\,v`, meaning: md`Potência.` },
    ],
    applications: [
      md`**Trânsito**: airbag e zonas de deformação aumentam $\Delta t$ e reduzem a força; perícia de colisões.`,
      md`**Esportes**: saltos, quiques, chutes.`,
      md`**Energia**: hidrelétricas e rodas d'água transformam potencial em elétrica.`,
      md`**Saúde**: forças de impacto em quedas.`,
    ],
    strategy: [
      md`Defina o sistema e os instantes inicial e final.`,
      md`Colisão: conserve a quantidade de movimento (com sinais). Depois, compare as energias.`,
      md`Sem atrito, conserve a energia mecânica; com atrito, calcule a dissipada.`,
    ],
    examples: [
      {
        title: 'Colisão',
        prompt: md`Um carro de 1000 kg a 20 m/s bate na traseira de outro de 1500 kg parado e seguem juntos. Qual a velocidade depois e quanta energia se perde?`,
        steps: [md`$1000 \cdot 20 = 2500\,v' \Rightarrow v' = 8$ m/s.`, md`Antes: $\frac{1000 \cdot 400}{2} = 200$ kJ. Depois: $\frac{2500 \cdot 64}{2} = 80$ kJ. Perda: 120 kJ.`],
      },
      {
        title: 'Quique',
        prompt: md`Uma bola de 0,2 kg chega ao chão a 10 m/s e volta a 6 m/s. Qual o impulso do chão e a energia perdida?`,
        steps: [md`Para cima positivo: $\Delta Q = 0{,}2\,(6 - (-10)) = 3{,}2$ N·s, para cima.`, md`$\Delta E_c = \frac{0{,}2}{2}(100 - 36) = 6{,}4$ J perdidos.`],
      },
    ],
    discursive: {
      prompt: md`Uma atleta de 50 kg salta de uma plataforma de 10 m e entra na água ($g = 10\ \text{m/s}^2$, despreze o ar). (a) Com que velocidade chega à água? (b) Se ela para a 4 m de profundidade, qual o trabalho total das forças da água? (c) Por que a velocidade de chegada não depende da massa?`,
      modelAnswer: [md`(a) $m g h = \frac{m v^2}{2} \Rightarrow v = \sqrt{2 \cdot 10 \cdot 10} \approx 14$ m/s.`, md`(b) Do topo ao ponto mais fundo, $\Delta E_c = 0$: o peso faz $50 \cdot 10 \cdot 14 = 7000$ J; as forças da água fazem $-7000$ J.`, md`(c) A massa aparece dos dois lados da conservação de energia e se cancela.`],
      scoring: [md`Conservação da energia com a equação escrita.`, md`Usa o teorema da energia cinética do início ao fim, com sinal.`, md`Justifica o cancelamento da massa.`],
    },
    traps: [
      { trap: md`Somar velocidades sem sinal num quique.`, fix: md`$\vec Q$ é vetor: o sentido muda.` },
      { trap: md`Conservar energia cinética numa colisão inelástica.`, fix: md`Só a quantidade de movimento se conserva sempre.` },
    ],
  },

  {
    id: 'fis-eletricidade',
    subject: 'Física',
    title: 'Circuitos e eletrostática',
    years: [2022, 2024, 2025],
    howItFalls: md`Caiu em 2022 (ponte de Wheatstone), 2024 (lanterna de LEDs em série com resistor; potencial de carga puntiforme) e 2025 (fio de tungstênio: carga, número de elétrons e 2ª lei de Ohm).`,
    explanation: md`### Corrente e carga
Corrente é carga por tempo. A carga é sempre múltipla da carga elementar $e = 1{,}6\times10^{-19}$ C, então $n = Q/e$ elétrons.

### Resistência
- 1ª lei de Ohm: $U = R\,i$.
- 2ª lei: $R = \rho\,L/A$. Fio mais longo, mais resistência; mais grosso, menos. A resistividade $\rho$ do metal aumenta com a temperatura.

### Associações
- **Série**: mesma corrente; tensões se somam; $R_{eq} = R_1 + R_2 + \dots$
- **Paralelo**: mesma tensão; correntes se somam; $\dfrac{1}{R_{eq}} = \dfrac{1}{R_1} + \dfrac{1}{R_2} + \dots$
- LED com resistor em série: o resistor fica com a tensão que sobra, $U_R = U_{\text{fonte}} - U_{\text{LEDs}}$, e define a corrente.

### Ponte de Wheatstone
Quatro resistores em losango com um galvanômetro no meio. Em equilíbrio (galvanômetro em zero), os **produtos cruzados** são iguais, e o ramo do meio pode ser ignorado.

### Potência
$P = U\,i = R\,i^2 = U^2/R$. Energia consumida: $E = P\,\Delta t$ (kWh na conta de luz).

### Eletrostática
Força de Coulomb e potencial de uma carga puntiforme. O potencial é escalar (soma com sinal); o campo é vetor.`,
    formulas: [
      { tex: String.raw`i = \frac{Q}{\Delta t}, \qquad Q = n\,e`, meaning: md`Corrente e quantização da carga.` },
      { tex: String.raw`U = R\,i, \qquad R = \rho\,\frac{L}{A}`, meaning: md`Leis de Ohm.` },
      { tex: String.raw`P = U\,i = R\,i^2 = \frac{U^2}{R}`, meaning: md`Potência elétrica.` },
      { tex: String.raw`R_1\,R_4 = R_2\,R_3`, meaning: md`Ponte de Wheatstone equilibrada (produtos dos resistores opostos).` },
      { tex: String.raw`F = k\frac{|q_1 q_2|}{d^2}, \qquad V = k\frac{Q}{d}`, meaning: md`Coulomb e potencial; $k = 9\times10^9$ N·m²/C².` },
    ],
    applications: [
      md`**Saúde**: eletrocardiograma, desfibrilador, choque elétrico (a corrente pelo corpo é o perigo).`,
      md`**Biologia**: impulso nervoso como fenômeno elétrico.`,
      md`**Cotidiano**: chuveiro (posição inverno tem resistência menor e potência maior), conta de luz.`,
      md`**Química**: eletrólise usa $Q = it$.`,
    ],
    strategy: [
      md`Redesenhe o circuito e identifique série e paralelo.`,
      md`Calcule a resistência equivalente, a corrente total e depois volte aos ramos.`,
      md`Em Wheatstone, teste o equilíbrio antes de calcular.`,
    ],
    examples: [
      {
        title: 'LED',
        prompt: md`Três LEDs de 2,0 V em série com um resistor, ligados a 9,0 V, devem ter corrente de 20 mA. Qual o resistor?`,
        steps: [md`Tensão no resistor: $9{,}0 - 3 \times 2{,}0 = 3{,}0$ V.`, md`$R = 3{,}0/0{,}020 = 150\ \Omega$.`],
      },
      {
        title: 'Chuveiro',
        prompt: md`Um chuveiro de 220 V tem 5500 W. Qual a resistência e a corrente?`,
        steps: [md`$i = P/U = 25$ A.`, md`$R = U/i = 8{,}8\ \Omega$.`],
      },
    ],
    discursive: {
      prompt: md`Um fio de cobre de 10 m e área de seção $1{,}0\times10^{-6}$ m² ($\rho = 1{,}7\times10^{-8}\ \Omega\cdot$m) é percorrido por 2,0 A durante 8,0 s. (a) Qual a resistência do fio? (b) Quantos elétrons passaram por uma seção? ($e = 1{,}6\times10^{-19}$ C) (c) Se o fio tivesse o dobro do comprimento, o que aconteceria com a resistência?`,
      modelAnswer: [md`(a) $R = \rho L/A = 1{,}7\times10^{-8} \cdot 10 / 1{,}0\times10^{-6} = 0{,}17\ \Omega$.`, md`(b) $Q = i\,t = 16$ C; $n = 16/1{,}6\times10^{-19} = 1{,}0\times10^{20}$ elétrons.`, md`(c) Dobraria, pois $R$ é proporcional ao comprimento.`],
      scoring: [md`2ª lei de Ohm com unidades.`, md`Carga e número de elétrons.`, md`Justifica pela proporcionalidade.`],
    },
    traps: [
      { trap: md`Somar resistências em paralelo.`, fix: md`Em paralelo, somam-se os inversos.` },
      { trap: md`Achar que a corrente "se gasta" ao passar pelo resistor.`, fix: md`Em série, a corrente é a mesma em todos os elementos.` },
    ],
  },

  {
    id: 'fis-ondas',
    subject: 'Física',
    title: 'Ondas estacionárias',
    years: [2023, 2025],
    howItFalls: md`Caiu em 2023 (onda estacionária e densidade linear da corda) e 2025 (ondas estacionárias em corda e em tubos sonoros).`,
    explanation: md`### Equação fundamental
Toda onda obedece a $v = \lambda f$. A velocidade depende do **meio**; a frequência, da **fonte**.

### Velocidade numa corda
Depende da tração e da densidade linear: corda mais esticada ou mais leve, onda mais rápida.

### Onda estacionária
Surge da superposição de ondas que vão e voltam. Tem **nós** (pontos parados) e **ventres** (máxima vibração). A distância entre dois nós é $\lambda/2$; cada "fuso" é meio comprimento de onda.
- **Corda presa nas duas pontas** e **tubo aberto**: $L = n\,\dfrac{\lambda}{2}$, todos os harmônicos.
- **Tubo fechado numa ponta**: $L = (2n - 1)\dfrac{\lambda}{4}$, só harmônicos **ímpares**.

### Como contar
Desenhe a figura, conte os fusos (ou quartos de onda no tubo fechado) e ache $\lambda$; depois $f = v/\lambda$.

### Som
É onda mecânica e longitudinal; não se propaga no vácuo. A altura (grave ou agudo) depende da frequência.`,
    formulas: [
      { tex: String.raw`v = \lambda\,f`, meaning: md`Equação fundamental.` },
      { tex: String.raw`v = \sqrt{\frac{T}{\mu}}, \qquad \mu = \frac{m}{L}`, meaning: md`Velocidade numa corda: tração $T$ e densidade linear $\mu$.` },
      { tex: String.raw`L = n\,\frac{\lambda}{2} \qquad\text{(corda, tubo aberto)}`, meaning: md`$n$ = número de fusos.` },
      { tex: String.raw`L = (2n - 1)\,\frac{\lambda}{4} \qquad\text{(tubo fechado)}`, meaning: md`Só harmônicos ímpares.` },
    ],
    applications: [
      md`**Música**: violão, flauta, órgão; afinar é mudar a tração.`,
      md`**Saúde**: ultrassom e audição (cóclea).`,
      md`**Óptica**: luz como onda, $c = \lambda f$.`,
    ],
    strategy: [
      md`Desenhe a onda e conte fusos ou quartos de onda.`,
      md`Ache $\lambda$ pela geometria; depois $v$ ou $f$.`,
      md`Se a corda é dada por massa e comprimento, calcule $\mu$ primeiro.`,
    ],
    examples: [
      {
        title: 'Corda',
        prompt: md`Uma corda de 1,2 m presa nas pontas vibra com 3 fusos a 150 Hz. Qual a velocidade da onda?`,
        steps: [md`$1{,}2 = 3\,\lambda/2 \Rightarrow \lambda = 0{,}8$ m.`, md`$v = 0{,}8 \times 150 = 120$ m/s.`],
      },
      {
        title: 'Tubo fechado',
        prompt: md`Qual a frequência fundamental de um tubo fechado de 0,85 m, com som a 340 m/s?`,
        steps: [md`Fundamental: $L = \lambda/4 \Rightarrow \lambda = 3{,}4$ m.`, md`$f = 340/3{,}4 = 100$ Hz.`],
      },
    ],
    discursive: {
      prompt: md`Uma corda de 2,0 m e 20 g, presa nas duas pontas e tracionada com 100 N, vibra formando 4 fusos. (a) Qual a velocidade da onda? (b) Qual a frequência? (c) Para obter o mesmo número de fusos com frequência maior, a tração deve aumentar ou diminuir?`,
      modelAnswer: [md`(a) $\mu = 0{,}020/2{,}0 = 0{,}010$ kg/m; $v = \sqrt{100/0{,}010} = 100$ m/s.`, md`(b) $2{,}0 = 4\lambda/2 \Rightarrow \lambda = 1{,}0$ m; $f = 100/1{,}0 = 100$ Hz.`, md`(c) Aumentar: mais tração dá mais velocidade e, com o mesmo $\lambda$, mais frequência.`],
      scoring: [md`Calcula $\mu$ em kg/m e $v$.`, md`Relaciona fusos a $\lambda$.`, md`Justifica por $v = \sqrt{T/\mu}$ e $v = \lambda f$.`],
    },
    traps: [
      { trap: md`Achar que a frequência muda ao trocar de meio.`, fix: md`Muda a velocidade e o comprimento de onda.` },
      { trap: md`Usar harmônicos pares no tubo fechado.`, fix: md`No tubo fechado, só ímpares.` },
    ],
  },

  {
    id: 'fis-magnetismo',
    subject: 'Física',
    title: 'Magnetismo',
    years: [2023, 2026],
    howItFalls: md`Caiu em 2023 (equilíbrio de forças e movimento circular de carga em campo magnético) e 2026 (campo de fio retilíneo e força magnética em condutor).`,
    explanation: md`### Fonte do campo
Cargas em movimento (correntes) criam campo magnético. Um fio retilíneo cria linhas circulares em volta dele; o sentido sai da **regra da mão direita** (polegar na corrente, dedos curvados no sentido do campo).

### Força sobre carga
Uma carga em movimento num campo sofre $F = |q|\,v\,B\sin\theta$, **perpendicular** à velocidade e ao campo. Por isso a força não muda o módulo da velocidade, só a direção: se $\vec v \perp \vec B$, a carga faz **movimento circular uniforme**, com a força magnética como resultante centrípeta.

### Força sobre fio
Um fio com corrente num campo sofre $F = B\,i\,L\sin\theta$. Dois fios paralelos com correntes no mesmo sentido se **atraem**; em sentidos opostos, se **repelem**.

### Regra para o sentido
Regra da mão esquerda (ou do tapa da mão direita): campo, velocidade (ou corrente) e força perpendiculares entre si. Para carga negativa, o sentido se inverte.`,
    formulas: [
      { tex: String.raw`F = |q|\,v\,B\sin\theta`, meaning: md`Força magnética sobre carga.` },
      { tex: String.raw`R = \frac{m\,v}{|q|\,B}`, meaning: md`Raio da trajetória circular ($\vec v \perp \vec B$).` },
      { tex: String.raw`B = \frac{\mu_0\,i}{2\pi d}`, meaning: md`Campo de um fio retilíneo longo; $\mu_0 = 4\pi\times10^{-7}$ T·m/A.` },
      { tex: String.raw`F = B\,i\,L\sin\theta`, meaning: md`Força sobre um condutor.` },
    ],
    applications: [
      md`**Saúde**: ressonância magnética, espectrometria de massas.`,
      md`**Tecnologia**: motores elétricos, alto-falantes, trens de levitação.`,
      md`**Geografia**: campo magnético terrestre e bússola.`,
      md`**Química**: separação de isótopos por raio da trajetória.`,
    ],
    strategy: [
      md`Desenhe $\vec v$ (ou $i$) e $\vec B$ e aplique a regra da mão para a força.`,
      md`Se a carga faz círculo, iguale força magnética a $m v^2 / R$.`,
      md`Confira o sinal da carga.`,
    ],
    examples: [
      {
        title: 'Raio',
        prompt: md`Um próton ($m = 1{,}6\times10^{-27}$ kg, $q = 1{,}6\times10^{-19}$ C) entra a $2\times10^6$ m/s perpendicular a um campo de 0,2 T. Qual o raio?`,
        steps: [md`$R = \dfrac{1{,}6\times10^{-27} \cdot 2\times10^6}{1{,}6\times10^{-19} \cdot 0{,}2}$.`, md`$R = 0{,}1$ m.`],
      },
      {
        title: 'Campo do fio',
        prompt: md`Qual o campo a 5 cm de um fio com 10 A?`,
        steps: [md`$B = \dfrac{4\pi\times10^{-7} \cdot 10}{2\pi \cdot 0{,}05} = 4\times10^{-5}$ T.`],
      },
    ],
    discursive: {
      prompt: md`Um fio horizontal de 0,5 m, com 4 A, está numa região de campo magnético uniforme de 0,1 T, perpendicular ao fio. (a) Qual a força magnética no fio? (b) Se o fio tem 20 g, qual a corrente que faria a força equilibrar o peso ($g = 10\ \text{m/s}^2$)? (c) Que regra define o sentido dessa força?`,
      modelAnswer: [md`(a) $F = B\,i\,L = 0{,}1 \cdot 4 \cdot 0{,}5 = 0{,}2$ N.`, md`(b) $B\,i\,L = m\,g \Rightarrow i = \dfrac{0{,}02 \cdot 10}{0{,}1 \cdot 0{,}5} = 4$ A.`, md`(c) A regra da mão esquerda (ou da mão direita espalmada): campo, corrente e força perpendiculares entre si.`],
      scoring: [md`Fórmula com $\sin 90^\circ = 1$ e unidade.`, md`Iguala força magnética e peso.`, md`Cita a regra de sentido.`],
    },
    traps: [
      { trap: md`Achar que a força magnética acelera a carga ao longo da trajetória.`, fix: md`Ela é perpendicular à velocidade: muda só a direção.` },
      { trap: md`Esquecer de inverter o sentido para carga negativa.`, fix: md`Elétrons sofrem força no sentido oposto.` },
    ],
  },
];
