# Revisão independente — Unicamp 2025, provas Q e Z

Data: 14/10/2026. Revisão de conteúdo das 71 fichas, publicadas no arquivo canônico `scripts/data/unicamp-2025-qz.json`. Na etapa inicial foram lidos quatro lotes temporários (01–18, 19–36, 37–54, 55–72); referências a esses lotes adiante são históricas, anteriores à agregação e retirada dos temporários. Nenhuma ficha, banco ou código foi alterado por esta revisão.

**Resultado final: sem bloqueantes confirmados após a correção e revalidação de Q56 e Q7.** A revisão inicial encontrou somas parciais impossíveis na transferência Q56; os novos dados foram reconstruídos e conferidos. Os achados iniciais abaixo ficam registrados como histórico, com a resolução no apêndice final.

## Fontes e abrangência

Fonte primária: `/tmp/expansao-unicamp-2025/f12025Q_Z.pdf`. Confronto com texto extraído `prova-colunas.txt` e inspeção visual de todas as páginas completas `paginas/p03.png` a `p23.png`, inclusive figuras, gráficos, alternativas e conteúdo compartilhado entre páginas. Gabarito: `QZ_gabarito_2025_FINAL_site.pdf`, por sua extração `gabarito.txt`. A Q53 é explicitamente anulada no gabarito final e não está nas 71 fichas.

Os números de página abaixo são físicos do PDF/nomes dos PNG. A página impressa da prova é dois números menor: física 19 = impressa 17, por exemplo. Isso evita confundir os campos `pages` com a numeração do rodapé.

Foram lidos conceito, passos, armadilha, perguntas de recuperação, transferência, critérios e alternativas das 71 fichas. Os cálculos oficiais e autorais foram refeitos; os resultados mais relevantes estão documentados adiante. As interpretações foram confrontadas com os excertos e imagens, sem considerar a mera coincidência com a letra oficial como prova de correção. Não se trata de um checklist estrutural.

Limites: não foram lidos integralmente os romances e livros citados, nem consultados os artigos e sites originais externos que a prova adaptou. Nas questões que exigem o todo da obra, o parecer combina excerto primário, alternativa oficial e conhecimento literário; não constitui conferência das edições completas. Não foram realizados testes com alunos nem análise empírica da eficácia dos exercícios. O gabarito foi lido na extração local fornecida, sem nova consulta remota. O relatório registra o conteúdo visto nesta sessão; eventuais alterações posteriores nas fichas exigem revalidação.

## Bloqueante confirmado: Q56, transferência impossível

Fonte: ficha Q56 em `unicamp-2025-qz-55-72.json`; problema oficial na física 19/impressa 17, coluna esquerda.

A transferência afirma: “três somas parciais consecutivas de uma PA são 90, 125 e 166”. Seus critérios dão parcelas 35 e 41 e razão 6. As subtrações estão certas, mas os três dados são incompatíveis com a definição de soma dos primeiros termos de uma PA.

Se as somas forem `s_n`, `s_(n+1)` e `s_(n+2)`, então:

- `a_(n+1) = 125 − 90 = 35`;
- `a_(n+2) = 166 − 125 = 41`, portanto `r = 6`;
- `a_1 = 35 − 6n`;
- `a_n = 29`;
- `s_n = n(a_1 + a_n)/2 = n(64 − 6n)/2 = 32n − 3n²`.

Impor `s_n = 90` exige `3n² − 32n + 90 = 0`. Seu discriminante é `1024 − 1080 = −56`. Não existe sequer `n` real, muito menos índice natural. Assim, o exercício não representa uma PA existente, apesar de produzir por diferenças os resultados anunciados.

Correção concreta recomendada, sem alterar o objetivo ou os critérios: usar **77, 112 e 153**. Uma PA com `a_1 = −7` e `r = 6` tem `s_7 = 77`, `s_8 = 112`, `s_9 = 153`, `a_8 = 35` e `a_9 = 41`. Se forem desejados termos positivos, **52, 87 e 128** são válidos: `a_1 = 23`, `r = 6`, `s_2 = 52`, `s_3 = 87`, `s_4 = 128`.

O oficial não apresenta esse defeito: 168, 220 e 279 dão 52, 59 e razão 7. Existe PA com `a_1 = 3`, `r = 7`, `s_7 = 168`, `s_8 = 220` e `s_9 = 279`. A resposta B permanece correta.

## Precisões pedagógicas

### Q7: a justificativa da alternativa B precisa aderir ao que ela diz

Fonte: física 5/impressa 3, figura à esquerda e alternativa B no topo da coluna direita. A resposta oficial D e os critérios da transferência estão corretos.

A ficha explica que a plataforma continental não implica soberania territorial plena sobre toda a coluna de água. A afirmação é juridicamente correta, mas a alternativa B fala em “soberania de exploração de recursos em toda a extensão da área da plataforma continental”; ela não afirma literalmente soberania plena sobre toda a coluna de água. A rejeição não deve imputar à alternativa essa frase ausente. Recomenda-se explicar a diferença entre soberania territorial e direitos soberanos específicos sobre recursos do leito e subsolo, e a precisão da combinação territorial/ZEE em D. Não é um resultado numérico falso nem muda a letra oficial, mas a refutação atual simplifica excessivamente o distrator.

### Q11: conservar a ressalva da aproximação

Fonte: física 6/impressa 4. Mesmo meio material não garante em geral igual velocidade para comprimentos de onda diferentes devido à dispersão. A ficha corretamente escreve “na aproximação adotada pela questão”, antes de assumir `v_1 = v_2`. A transferência também explicita igual velocidade. Conservar essa condição evita ensinar igualdade universal de velocidades em qualquer meio dispersivo.

### Q32: Estado na alternativa, não como citação de Gilman

Fonte: físicas 12–13/impressas 10–11. O texto 1 menciona cozinhas comuns, pessoas contratadas coletivamente, cuidadores profissionais e creches; não nomeia o Estado. “Vinculando-as também ao Estado” consta na alternativa oficial D. A ficha distingue expressamente essa formulação da literalidade do excerto. Ressalva correta e necessária. A transferência é autoral e realmente descreve uma creche pública, permitindo o critério proposto sem inventar palavras de Gilman.

### Q63: a razão determina M/n

Fonte: física 21/impressa 19. `42,4 − 37,5 = 4,9 mg` é a parcela de HCl. Para `n` HCl por molécula de base, `4,9/37,5 = n·36,5/M`, logo `M/n = 279,3367 g/mol`. Os dados sozinhos não isolam `n`. A alternativa B é o único par oferecido que satisfaz a razão; um par com dois HCl exigiria aproximadamente 559 g/mol e não aparece. A ficha registra exatamente esse limite. A transferência fornece tanto `M = 200` como `n = 1`, portanto os 7,3 mg de HCl e 47,3 mg totais estão determinados.

### Q69: limiar não universal

Fonte: físicas 22–23/impressas 20–21. O enunciado fornece as quatro condições, mas não um limiar numérico da espécie. III e IV correspondem à resposta A no modelo didático apresentado. A ressalva da ficha de que plantas reais têm limiares próprios é adequada. A transferência fornece explicitamente o limiar de 10 h e um pulso eficaz; sob essa regra, 16 h contínuas impedem floração e dois blocos de 8 h permitem.

### Q72: números e exceção biológica

Fonte: física 23/impressa 21, figura do terceiro cromossomo. Conferidos visualmente `ABC = abc = 3453`, `ABc = abC = 476`, `AbC = aBc = 6`, `Abc = aBC = 134`.

- Total: `2·3453 + 2·476 + 2·6 + 2·134 = 8138`.
- AB: `(134 + 134 + 6 + 6)/8138 = 280/8138`, aproximadamente 3,44065%.
- BC: `(476 + 476 + 6 + 6)/8138 = 964/8138`, aproximadamente 11,84566%.
- Os duplos somam 12 e entram nos dois intervalos. AB < BC; resposta D.

A soma 8000 seria falsa. Os valores atuais da ficha são corretos. O enunciado diz “mosca macho”, embora machos de Drosophila melanogaster normalmente não apresentem crossing-over meiótico. A ficha ressalva a inconsistência e trata os números como modelo hipotético. Não apresentar esses dados como observação biologicamente usual do macho.

A transferência usa fêmea e total 1000: `800 + 120 + 70 + 10 = 1000`, `AB = 8 cM`, `BC = 13 cM`, recombinação observada AC de 19%. Soma do mapa de 21 cM difere de 19% porque duplos restauram a associação dos genes externos. Critérios corretos.

## Recálculos dos problemas quantitativos

Todos os resultados desta tabela foram refeitos a partir dos valores enunciados. “Transferência” se refere ao exercício autoral da ficha correspondente.

| Questão | Física PDF | Oficial: cálculo e resultado | Transferência: resultado conferido |
|---|---|---|---|
| 1 | 3 | Escala maior implica menor generalização, B | 3 cm × 10.000 = 300 m; escolher 1:10.000 |
| 8 | 5 | 750 + 250 = 1000 km/h; 2000/1000 = 2 h, D | 600 − 100 = 500 km/h; 1400/500 = 2,8 h |
| 9 | 5–6 | 2·3·1,848·10⁶/7200 = 1540 m/s, B | 14,4·10⁶/14.400 = 1000 m/s |
| 10 | 5–6 | (1 − 0,9)·380.000 = 38.000 km à Lua, A | 400.000 e 100.000 km |
| 11 | 6 | f₂/f₁ = 128/350 ≈ 0,3657; mesma velocidade no modelo, B | 200/500 = 0,4; redução de 60% |
| 12 | 6 | −0,0005/(2·50) = −5·10⁻⁶ °C⁻¹, B | −0,010 mm; 99,990 mm |
| 13 | 7 | 462/42 = 11 A; 462/12 = 38,5 A, A | 8 A de entrada; 216 W e 18 A na saída |
| 14 | 7 | 462/(924·2,5) = 20%, B | 15%; 720 Wh = 0,72 kWh |
| 17 | 8 | Gráfico: software developer/housekeeper, C | +40 pontos percentuais de mulheres; −50 de brancos |
| 47 | 17 | 100 − 55 = 45% em Ciências, A | Pelo menos nível 2: 58%; níveis 2–4: 52% |
| 48 | 17 | 675 + 289 − 96 = 868; 868/2025, A | 30 + 20 − 10 = 40; probabilidade 1/3 |
| 49 | 17–18 | 2000·1,10²·0,80 = 1936, B; queda líquida 3,2% | 500·1,20·0,80 = 480; queda de 4% |
| 50 | 18 | sen²(π/12) = (2 − √3)/4; raiz positiva, A | sen(π/8) = √(2 − √2)/2 ≈ 0,383 |
| 51 | 18 | 65 − 33 − 7 = 25; 25/65 = 5/13, A | 30/80 = 3/8; pelo menos dois: 39/80 |
| 52 | 18 | x ∈ [0,4], y ∈ [2,4]; soma ∈ [2,8], C | u ∈ [3,7], v ∈ [−4,2]; soma ∈ [−1,9] |
| 54 | 18 | (x − 2)(x − 6) < 0; inteiros 3,4,5; B | (x + 1)(x − 5) < 0; inteiros 0,1,2,3,4 |
| 55 | 18–19 | AD = 5; AE = 5 + 12/5 = 37/5; EF = (37/5)·(3/4) = 111/20, B | Duplicação: AD = 10, AE = 74/5, EF = 111/10 |
| 56 | 19 | 220 − 168 = 52; 279 − 220 = 59; r = 7, B | **Bloqueada: dados impossíveis**, demonstrados acima |
| 57 | 19 | c = −4; a = 3/2, b = −3/2; abc = 9, D | a = 2, b = 1, c = −2; abc = −4 |
| 58 | 19 | Q(0) = 16, Q′(0) = 2; amplitude 2√5, período 2π; A | R(0) = 6, imagem [5,15], período 2π e crescimento inicial |
| 59 | 20 | Impacto da geração elétrica impede conclusão automática de sustentabilidade, B | 80 e 10 kg CO₂; redução de 70 kg ou 87,5% |
| 60 | 20 | Massas relativas 5,208/9,43; total 640/9; 7,03125%,32,5%,60,46875%; A | Massas 10,20,45; 13⅓%,26⅔%,60% |
| 61 | 20 | Metano; digestão diminui carga orgânica e DBO, D | 600 m³; DBO 1000 → 300 kg O₂; redução 700 kg/70% |
| 62 | 20–21 | Eletrólise e captura por base, B; balanços corretos | 36 g = 2 mol H₂O → 1 mol O₂; 1 mol NaOH para 0,5 mol CO₂ |
| 63 | 21 | M/n ≈ 279,34 g/mol; único par compatível B | HCl = 7,3 mg; sal = 47,3 mg |
| 64 | 21 | Vermelho troca mais devagar; sólido ligado/pontilhado livre, D | Perdas R = 25%, S = 75%; R mais persistente |
| 65 | 21 | Repelência nas três substâncias; mortalidade apenas transflutrina, C | 70%/5% e 50%/40%; distinguir os efeitos |
| 68 | 22 | Motilidade ciliar prejudicada e menor transporte, C | 3 e 1 mm/min; redução de 66,7% |
| 72 | 23 | 8138; AB ≈ 3,44 cM, BC ≈ 11,85 cM, D, com ressalva biológica | 1000; AB = 8, BC = 13 cM; AC observado 19% |

Q55: a inspeção da figura confirmou GD perpendicular a AB, GD = GH = 3 e o contato do canto inferior direito do quadrado inclinado com a lateral esquerda do quadrado apoiado em AC. Coordenadas da ficha são compatíveis com A na origem e AC horizontal: G = (16/5,12/5), H = (28/5,21/5), D = (5,0), canto inferior direito = (37/5,9/5). Não foi presumido ângulo reto em B.

Q58: os quatro gráficos foram vistos na física 19. A começa em 16 crescendo e oscila em torno de 20; B/D apresentam queda de nível médio e C começa em 20. Máximo inicial em π − arctan(1/2) ≈ 2,678 e imagem [15,5279;24,4721], compatíveis com o desenho.

## Confronto interpretativo e conceitual por área

| Questões | Páginas físicas | Evidência e conclusão |
|---|---|---|
| 2–7 | 3–5 | Fronteira política; cacau no Golfo da Guiné; escudos ígneos/metamórficos e metais; bloqueio por alta pressão; planejamento nos três entes; distinção mar territorial/ZEE. Transferências coerentes. Q7 tem precisão de refutação indicada acima. |
| 15–16 | 7–8 | “Police under fire” e “Scotland Yard criticised” fazem da polícia o alvo de crítica; “threat to arrest” não é prisão consumada. Diálogo da médica contém compound fracture, Bro, spill the tea, finna, glow up e no cap. Oralidade e procedimentos futuros, sem novo diagnóstico. B/D corretas; transferências não acrescentam diagnóstico nem fechamento consumado. |
| 17 | 8 | Legenda e extremos dos dois gráficos confirmam software developer exclusivamente masculino/branco e housekeeper exclusivamente feminino/majoritariamente não branco na IA. Dados reais diferem. C correta. |
| 18–19 | 8–9 | Dery liga a perplexidade à experiência de violência semelhante à ficção científica. Butler: “Let the past / Teach you”, “What was / Cannot / Come again” e “know the past”. Memória ensina sem repetição literal; não esquecer obrigatoriamente. D/A corretas. |
| 20–21 | 9 | “don’t object to remaining object”; “subject yourself to me”; quem pode falar e controlar sentidos. B correta. Resumo climático exige análise multicausal e opõe responsabilização política ao apagamento de vulnerabilidades; D correta. Transferências preservam as relações sem atribuir intenções ausentes. |
| 22–24 | 10 | Bem alcançado “a custo” e necessário à ação sensata; Wollstonecraft exige prova para excluir mulheres, não afirma irracionalidade; monocultura é metáfora de imposição cultural, oposta a confluências. C/D/B corretas; critérios autorais coerentes. |
| 25–27 | 10–11 | Atenienses têm funções cívicas sem igualdade de direitos políticos; Juana recorre à Justiça sem desfecho confirmado; avaliações de Lavradio são historicamente situadas, não obstáculo absoluto ao porto. D/D/B corretas; transferências mantêm esses limites. |
| 28–29 | 11–12 | Goya: camisa branca, luz e braços abertos evocam martírio na repressão napoleônica de 1808; não Revolução Francesa. Eugenia: seleção racial e reprodução são crenças históricas, não critérios científicos válidos. D/A corretas. A ficha Q29 explicita que parte da resposta depende de conhecimento histórico além da capa. |
| 30–34 | 12–13 | Cabral propõe unidade política acima das divisões étnicas; ESMA: indígenas querem produzir a narrativa nacional; Gilman/Cooper divergem sobre dependência; Dagnino articula diferença e igualdade; cordialidade privatiza vínculos e pode coexistir com violência. D/B/D/B/A corretas. Q32 tem ressalva literal adequada. |
| 35–38 | 14–15 | Grafite: primeira pessoa e interioridade; “Sou Maria... E vou com as outras!” altera forma/valor, enquanto canção singulariza a Maria socialmente rotulada. Tira mostra encolhimento da figura que ostenta dinheiro/cargo/títulos/avô; Bispo distingue importância autoproclamada e necessidade comunitária. B/C/D/A corretas; transferências coerentes. |
| 39–41 | 15–16 | Macetando sem complemento; ligar como telefonar e importar-se; Alice/Gato atribuem sentidos diferentes ao pedido de chegar a algum lugar. D/B/D corretas. Transferências preservam mecanismo verbal e não alegam resultado externo inexistente. |
| 42–46 | 16–17 | Sátira da burocracia e valor do indivíduo em Gonzaga de Sá; lágrimas/desamparo em Chiziane/Evaristo; indicativo/subjuntivo em Abreu; conhecimento indígena não predatório em Krenak; imagens funerárias de cipreste/cruz. C/D/A/C/C compatíveis com os trechos. Transferências distinguem agência de sofrimento e símbolo de conclusão arbitrária. Limite: obras integrais não relidas. |
| 59–65 | 20–21 | Cartum da eletrificação ligado à usina; conversão energia/massa; biodigestão anaeróbica e DBO; eletrólise/base; razão M/n; velocidade de troca de ligantes; repelência versus mortalidade. Soluções e critérios corretos sob condições explícitas, com precisões registradas. |
| 66–71 | 22–23 | Manguezal e crustáceos; X/Y parcialmente homólogos, silenciamento de transcrição e genoma; cílios móveis; fotoperiodismo com noite interrompida; seleção sem isolamento espacial obrigatório e especiação simpátrica; endemismo e cnidários. A/C/C/A/B/B corretas no modelo da prova. Transferências não confundem tecido/simetria/filo nem genoma/código genético. |

As transferências não quantitativas de Q2–7, Q15–16, Q18–46 e Q66–67/Q69–71 foram avaliadas quanto à suficiência do enunciado e correspondência com os critérios. Não foi identificado outro resultado falso demonstrável. Não se deve converter essa ausência de achado em garantia de eficácia pedagógica ou conferência das obras integrais.

## Conteúdo compartilhado e rastreabilidade

Conferidas as continuações que afetam interpretação ou alternativas: Q6 físicas 4–5; texto comum Q9/Q10 físicas 5–6; Q16 físicas 7–8; poema de Q19 físicas 8–9; Q23 e Q25 físicas 10–11; Q32 físicas 12–13; Q37 físicas 14–15; Q41 físicas 15–16; Q45 físicas 16–17; Q49 físicas 17–18; Q55 físicas 18–19; Q62 físicas 20–21; Q69 físicas 22–23. Todas essas páginas foram vistas integralmente, não apenas as regiões de uma questão.

As demais questões foram confrontadas nas páginas indicadas nas fichas e nas tabelas. Figuras decisivas vistas: escala/cacau, mapa meteorológico e espaço marítimo, órbita/gravitação/dilatação, diálogo médico e gráficos de viés, Goya, capa eugênica, Constituinte, grafite/tira, PISA/Venn/quadrados/função trigonométrica, cartum energético, gráficos químicos, obra do manguezal, cílios/fotoperíodo e mapa genético.

Não foi detectada citação inventada nos passos revisados. Q32 separa formulação da alternativa de afirmação literal do texto; Q19/20 tiveram as expressões em inglês conferidas no primário. As fontes bibliográficas internas do PDF foram usadas como referência do enunciado, sem alegar verificação independente das edições originais.

**Pendência para aprovação do lote:** corrigir a transferência Q56, conferir existência da PA com os novos dados e registrar a correção. Recomenda-se também aprimorar a justificativa do distrator B da Q7. Não foi necessária nem realizada alteração de banco, código ou ficha por esta revisão.


## Revalidação posterior das correções — 14/10/2026

Após as correções aplicadas pelo agente responsável, as fichas Q56 e Q7 foram relidas diretamente nos JSON. O achado histórico acima permanece como registro da revisão inicial, mas suas pendências estão **resolvidas** no estado revalidado.

Q56: a transferência agora usa77,112,153 e inclui critério de existência com a₁=−7,r=6,s₇=77,s₈=112,s₉=153. Recalculado: s₇=7(−7+29)/2=77;s₈=8(−7+35)/2=112;s₉=9(−7+41)/2=153. Diferenças35/41 e razão6 corretas. Bloqueante resolvido.

Q7: a justificativa atual deB fala em exploração de recursos da plataforma, leito/subsolo e delimitação jurídica própria; não atribui à alternativa uma frase sobre soberania plena da coluna de água. A precisão recomendada foi incorporada. OficialD e transferência8/150milhas continuam corretos.

Não resta bloqueante confirmado nesta revisão das71 fichas Unicamp, respeitados os limites de abrangência descritos no relatório. A revalidação não equivale a releitura das obras integrais nem garantia empírica de aprendizagem.


Publicação canônica: as71 fichas foram agregadas em `scripts/data/unicamp-2025-qz.json`, incluindo Q56/Q7 corrigidas. Os quatro lotes temporários deixam de integrar a publicação; não representam quatro conjuntos adicionais nem duplicação de71 questões. Revalidação final conferiu diretamente o canônico.
