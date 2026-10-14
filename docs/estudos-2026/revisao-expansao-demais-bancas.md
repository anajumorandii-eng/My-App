# Revisão independente — expansão das demais bancas

Data: 14/10/2026. Escopo: **64 fichas**, sendo FUVEST 2026 V1 (16), UNESP 2025 V1 (12), FAMERP 2025 V1 (12), UNIFESP 2025 V1 (12) e ENEM 2022, segundo dia, caderno 5 amarelo (12). Arquivos `scripts/data/{fuvest-2026-v1,unesp-2025-v1,famerp-2025-v1,unifesp-2025-v1,enem-2022-d2-cd5}-expansao.json`.

**Resultado final: sem bloqueantes confirmados. Não foi encontrado resultado numérico falso nos oficiais ou nas transferências das 64 fichas. A insuficiência inicial de dados na transferência UNESP Q61 foi corrigida e revalidada: o enunciado final explicita alimento escasso e redução de disponibilidade à outra espécie.** Não foram alteradas fichas, código ou banco por esta revisão.

## Método, fontes e limites

Foram lidos conceitos, passos, alternativas, armadilhas, recuperação, transferências e critérios. Cálculos foram refeitos, incluindo condição de existência/minimalidade, base dos percentuais, sinais, unidades e pressupostos de aplicação. Interpretações foram confrontadas com os textos primários e com as alternativas, além das letras dos gabaritos.

Fontes locais:

- FUVEST: `/tmp/expansao-fuvest-2026/prova-V1.pdf`, texto segmentado e apoio completo `texto-apoio-q58-q59.txt`; `gabarito.pdf`/`gabarito.txt`, retificado em 25/11/2025, colunas V1. As 16 questões selecionadas não incluem a Q3 anulada.
- UNESP: `/tmp/expansao-bancas/unesp/prova-oficial.pdf`, extração direta por página durante a revisão; `gabarito.pdf`/`gabarito.txt`, versão 1.
- FAMERP: `/tmp/expansao-bancas/famerp/prova-oficial.pdf`/`prova-oficial.txt`; `gabarito.pdf`/`gabarito.txt`, versão 1.
- UNIFESP: `/tmp/expansao-bancas/unifesp/prova-oficial.pdf`, extração direta por página; `gabarito.pdf`/`gabarito.txt`, versão 1.
- ENEM: `/tmp/expansao-bancas/enem/2022-prova-oficial.pdf`, nova extração em ordem de leitura; `2022-gabarito.txt` do amarelo/segundo dia/caderno 5, pareado com os PDFs `2022-gabarito-api.pdf` e `2022-gabarito-riep.pdf` disponibilizados no diretório.

**Armadilha de versão identificada:** FAMERP `prova.pdf`/`prova.txt` não têm a mesma ordem de alternativas de `prova-oficial.pdf`/`prova-oficial.txt`. Por exemplo, amebíase aparece como A no arquivo alternativo e E no oficial V1; fentanil como C/D e ligação de hidrogênio como B/D. A revisão usa o oficial V1: Q46 E, Q47 D e Q55 D. Não inferir divergência de gabarito a partir do PDF não pareado.

Páginas nesta revisão são físicas do PDF. Foram extraídos os enunciados, alternativas e textos de apoio nas páginas selecionadas, incluindo continuações. Imagens decisivas vistas diretamente: FUVEST física 11 (greening/gelo), 29 (espectro isotópico), 35 (seta do estômato), 36 (sobreposição de nichos); UNIFESP física 9 (infográfico completo de incêndios). Estruturas químicas, gráficos restantes e tabelas foram também confrontados na extração do PDF; não se afirma inspeção visual integral de todas as páginas das cinco provas.

Limites: não foram relidas obras literárias integrais nem consultadas as publicações externas originais que as provas adaptaram. Não se afirma revisão empírica da aprendizagem nem auditoria jurídica/médica especializada. Gabaritos foram conferidos nas fontes locais fornecidas, sem nova consulta remota. O parecer é conceitual e quantitativo, não mero checklist de campos. Refere-se ao estado dos arquivos lido nesta sessão; alterações posteriores exigem revalidação.

## Achado: UNESP Q61, transferência subdetermina competição efetiva

Fonte oficial: física 22, Q61; ficha `unesp-2025-v1-expansao.json`.

No oficial há sobreposição de 69% das espécies predadas por orcas e humanos e a informação de que a superexploração humana afeta as cadeias ecológicas. A classificação A, competição, tem suporte nesse contexto de impacto sobre recurso compartilhado.

A transferência diz somente: “garças e martins-pescadores capturam os mesmos pequenos peixes de uma lagoa”. O critério exige “competição interespecífica por alimento”. Compartilhamento de dieta pode permitir competição, mas não demonstra que os peixes sejam limitantes nem que o consumo de uma espécie reduza a disponibilidade para a outra. Duas populações com alimento abundante podem compartilhar a dieta sem competição efetiva mensurável.

Correção concreta recomendada: acrescentar ao enunciado **“os peixes são escassos e a captura por uma espécie reduz o alimento disponível para a outra”**. Isso preserva o critério existente. Outra solução é trocar o critério por **“competição potencial, caso o alimento seja limitante”**. Entre ave e peixe capturado, predação continua determinada pelos dados. A ressalva está alinhada à FUVEST Q85, que corretamente usa “pode” e cuja transferência já explicita sementes escassas.

## Resultados quantitativos refeitos

| Banca/questão | Página | Oficial | Transferência |
|---|---|---|---|
| FUVEST 18 | 9 | 200·1,1ᵗ > 300; t > log(1,5)/log(1,1) ≈ 4,254; E; primeira semana inteira 5 | t > log2/log1,2 ≈ 3,802; semana 4; 172,8 e 207,36 mil |
| FUVEST 23 | 10 | Tendência decrescente admite altas locais; D | 800 → 200: redução 75%; alta local 600 → 650 |
| FUVEST 24 | 11 | 0,86 → 11,95 km²; C oficial, com limite causal abaixo | 2 → 10 km²: +400%, cinco vezes; correlação não isola causa |
| FUVEST 55 | 25 | Primeiro perfeito 6; 6·3ᵏ⁻¹ é sempre par, B; divisores próprios de 120 somam 240, refutando D | n=5: 31 primo, perfeito 16·31 = 496; PG 6,18,54 |
| FUVEST 60 | 27 | RSc=2GM/c²=4444,44 m; razão (10⁹/RSc)³ = 1,1390625·10¹⁶, D | Mesma massa: (1000/10)³ = 10⁶ |
| FUVEST 61 | 27 | Kmax=hf−φ; aumentar f aumenta Kmax, C | 3−2=1 eV; 5−2=3 eV; intensidade não altera Kmax a f fixa |
| FUVEST 67 | 29 | 843,444/2=421,722; próximo pico 422,223; Δmassa=2·0,501=1,002; A | 600/2=300 e 602/2=301; não implica impureza |
| UNESP 51 | 19 | 4,7% versus 25%: relação tradicional/conservação, D | 18−3=15 pontos percentuais; inferência causal limitada |
| UNESP 75 | 26 | Romper: 4·391+163+497=2224; formar:949+4·463=2801; ΔH=−577 kJ/mol, C | 436+243−2·431=−183 kJ/mol, exotérmica |
| UNESP 78 | 27 | amax=g(μcosθ−senθ)=10(0,64−0,6)=0,4 m/s², A | μ=1: amax=2 m/s²; atrito estático suficiente |
| UNESP 90 | 31 | 6 m/min=10 cm/s; 30 lados; tempos1,1/2,...,1/2²⁹; 2(1−2⁻³⁰)s≈2s, A | 5 trechos:31/16s=1,9375s |
| FAMERP 32 | 9 | Commodities contribuem para exportações/balança, D | Exportações100, importações85: superávit15 bilhões; commodities70% |
| FAMERP 54 | 16 | x=2,y=6,z=10; soma18, D; O:28 em cada lado | Para3mol P4:6mol fosfato,18mol SiO2,30mol C |
| FAMERP 63 | 18 | GMm/R²=mv²/R ⇒ v=√(GM/R), C | Raio4R dá metade da velocidade:4km/s |
| FAMERP 72 | 21 | m=1,5,n=−7,p=0,5,q=4; soma−1, C | tC=0,5(2tA−3)+4=tA+2,5; para6:8,5 |
| FAMERP 77 | 22 | 2πr²+2πrh=πr²h ⇒ r=2h/(h−2), h>2, D | h=6 ⇒ r=3; área e volume numericamente54π |
| ENEM 92 | 2 | Retorno−u: impulso m(v+u)>mv; dissipação nos blocos maior, A | Forças20.000/24.000N; perdas50.000/48.000J |
| ENEM 97 | 4 | Decantação retira grande parte dos sólidos, B | 200·0,20=40;40·0,25=10mg/L; remoção95% |
| ENEM 99 | 4 | 510/4=127,5;608/4=152;575/3≈191,667; ordem1,2,3, A | 6,9,5Ω; ordem3,1,2 |
| ENEM 105 | 6 | t²=2h/g=0,2;v²=9/0,2=45;H=v²/(2g)=2,25m, B | H=x²/(4h)=16/8=2m acima da saída |
| ENEM 116 | 10 | Ozônio recebe elétrons: oxidante, B | O3+2H⁺+2e⁻→O2+H2O balanceada;0,25mol recebe0,50mol e⁻ |
| ENEM 130 | 15 | Meia-vida8dias;40dias=5;12/32=0,375µg≈0,4, D | 32/8=4µg após24dias;2µg após4meias-vidas=32dias |
| ENEM 136 | 17 | 600.000+480.000(1+r)≤1.224.000 ⇒ r≤30%, D | 132.000+120.000(1+r)≤276.000 ⇒ r≤20%; salário7.200 |
| ENEM 140 | 17 | 1000·1,10·0,98=1078 versus1080;2reais menor, A | 500·1,20·0,90=540 versus550;10reais menor, aumento8% |
| ENEM 157 | 23 | 7·2·2³·c=112c>1000 ⇒ c mínimo9;896/1008, B | 4·3·2²·c=48c>500 ⇒ c mínimo11;480/528 |

Os enunciados autorais têm dados suficientes para esses resultados, sem inferir quantidades não fornecidas. Em FAMERP Q77, igualdade é dos **valores numéricos** na unidade fixada; não igualdade dimensional física entre área e volume. Em ENEM Q92, forças médias são comparadas em módulo e a velocidade de retorno tem sinal negativo no impulso; a transferência explicita desprezar outras energias finais. Em ENEM Q105, H é medido da saída e não do chão. Não se somaram taxas percentuais sucessivas.

## Confronto interpretativo/conceitual e gabaritos

| Banca | Questões/letras conferidas | Fontes/páginas e base da conclusão |
|---|---|---|
| FUVEST | 20 A;21 B;23 D;24 C;25 C;34 E;48 B;59 C;84 B;85 A;89 C | 9: República mantém exploração indígena; ensino jesuítico pode compor alianças, mantendo “talvez”, “alguns grupos” e limite documental.10: tendência do desmatamento.11: greening e contenção de geleiras.15: Solimões e sedimentos inorgânicos vindos de montante.22: serpente/maçã, despertar e conflito de Mwando.26: apoio completo Riess/Freedman, dados observacionais confrontam teoria.35: seta aberto→fechado, perda de soluto/água/turgor.36: sobreposição de nichos permite competição.37: sobrenome Paranhos como memória desigual e reivindicação simbólica, sem herança legal já obtida. |
| UNESP | 5 B;18 D;21 A;33 E;51 D;59 A;61 A;65 E;73 E | 3–4: “Fui sonhado por ti”→“Tu me sonhaste”.8: “não sei de que ano” é ignorância, não omissão.9: cacau, clima e doenças explicam alta.12: mineração e centralidade político-econômica do Rio.19: conservação quilombola.22: silogismo e dedução; orcas/humanos.23: inspiração por contração, retenção deCO2 reduzpH e comando bulbar.26:NaOH eleva pH e deslocaCN⁻+H2O⇌HCN+OH⁻ à esquerda. |
| FAMERP | 3 A;5 E;12 C;21 D;32 D;46 E;47 D;55 D | 2–3:Vênus/Cupido/Antero e mitologia clássica; “O tesouro se procura” é passiva.4–5:Although equivale aDespite the fact that.6:culto imperial e ameaça política percebida.9:commodities.13:cistos deEntamoeba e receptores opioides; versãoV1 conferida.16:OH da boldina e NH da dietilamina permitem ligação de hidrogênio. |
| UNIFESP | 1 C;3 E;6 C;7 E;8 D;9 B;10 C;12 C;16 B;19 E;23 C;25 C | 3:folhetim cotidiano/leve, lhe retoma inventor.4–5:hoje dêitico;formassem plural/subjuntivo;assimetria/imperfeita negativos;Os sertões estruturaA Terra/O Homem/A Luta.6:Lola primeira pessoa e relato do microfone;luva personificada no soneto completo.7–8:robô de fungos, eletrodos/comandos,starfish-shaped fotografado.9:must obrigação;infográfico mostra sol→ressecamento→queima. |
| ENEM | 94 D;98 E;104 A | 3:vetorT.cruzi não patogênico expõe antígeno tumoral específico.4:termogenina desacopla cadeia/fosforilação, reduzATP por combustível e aumenta dissipação térmica.6:jaqueira exótica pode substituir flora nativa;transferência12nativas→7nativas+1invasora=8espécies, perda de5nativas. |

As questões quantitativas não repetidas nesta tabela tiveram suas letras conferidas na tabela de recálculos. Todas as 64 questões selecionadas estão cobertas por uma ou ambas as tabelas.

Transferências interpretativas: os critérios preservam tempo/pessoa em voz ativa, referência pronominal, dêixis, concessão e modos verbais; distinguem intertexto de bucolismo, quantidade de indivíduos de riqueza, relato de pedido/possibilidade de resultado comprovado e causalidade de correlação. Não foi identificado outro enunciado impossível como o da transferência antiga da Unicamp Q56.

## Ressalvas que devem permanecer nas fichas

- **FUVEST Q24, física11:** a alternativaC oficial associa greening a temperatura/gelo e menciona2016. O gráfico mede área vegetada porNDVI/TCG, sem série direta de temperatura ou gelo. A ficha corretamente não transforma associação plausível em medição dessas variáveis. A transferência explicita limite de causalidade.
- **FUVEST Q59, física26:** medições conflitantes não provam nova lei;Freedman obtém dois tipos de estrelas próximos da previsão e terceiro próximo deRiess. Critérios autorais pedem investigar incertezas e modelo, adequadamente.
- **FUVEST Q85, física36:** sobreposição é região de nichos, não habitat nem o próprio recurso;“pode” ocorrer competição. Transferência informa sementes escassas, diferentemente da UNESP Q61.
- **UNESP Q65, física23:** CO2 de40→48mmHg permite prever tendência de queda de pH, mas não seu valor numérico sem bicarbonato/condições adicionais. A ficha exige apenas direção, corretamente. Controle respiratório não é atribuído ao cerebelo.
- **FAMERP Q47, física13:** excerto sustenta ligação a receptores opioides; alternativaD descreve proteínas dendríticas. Não demonstra localização exclusivamente dendrítica de todos os receptores opioides; ficha reconhece essa limitação. Opioides também podem atuar em locais pré-sinápticos, portanto o distratorA não deve ser rejeitado como mecanismo universalmente impossível, mas como menos fiel ao alvo/efeito destacado nesse excerto. A ficha o rejeita por bloqueio de liberação não apresentado, evitando a universalização.
- **FAMERP Q55, física16:** moléculas neutras representadas têm grupos capazes de ligação de hidrogênio. A transferência explica adequadamente que éter aceita ligações, mas não as doa entre suas próprias moléculas no modelo usual; não conclui incapacidade de aceitar ligação de hidrogênio com água.
- **ENEM Q98, física4:** desacoplamento reduz rendimentoATP por unidade de combustível. Não determina consumo total, que pode aumentar; comparação autoral fixa combustível oxidado e distingue rendimento de taxa. A explicação de prótons não chegar àATP sintase é simplificação do enunciado; a ficha descreve rota de dissipação paralela sem bloquear universalmente toda sínteseATP.
- **ENEM Q94, física3:** ausência do antígenoX significa ausência daquele alvo específico, não ausência de toda resposta imunológica; critério faz essa distinção.

## Conteúdo compartilhado e fechamento

Confrontadas as continuações UNESP Q5 físicas3–4 e apoio completo da crônicaQ18 na8; FAMERP Q5 físicas2–3 eQ12 físicas4–5; UNIFESP Q7/Q8 físicas4–5 eQ19 físicas7–8; FUVEST Q59 com apoio completo da física26, não apenas a pergunta. ENEM foi conferido no caderno2022pareado, sem usar arquivos2023/2024 do diretório como fonte de letras.

Não foi identificada citação inventada nas 64 fichas. A coincidência de letras não substitui as demonstrações e limites registrados. **Pendência didática: resolver a insuficiência da transferência UNESP Q61 e conferir a redação final.** Os demais cálculos e critérios examinados são coerentes com os dados disponíveis e as condições explicitadas.


## Revalidação da correção UNESP Q61 — 14/10/2026

A ficha foi relida após a alteração pelo agente responsável. A transferência agora informa peixes escassos e que a captura por uma espécie reduz alimento disponível à outra. Isso fornece a limitação do recurso e o efeito negativo compartilhado necessários à competição interespecífica. Os passos oficiais também distinguem sobreposição isolada de prejuízo e relacionam a conclusão à superexploração. O achado acima fica preservado como histórico, mas a pendência está **resolvida**.

**Estado final revalidado: nenhum bloqueante confirmado nas64 fichas das demais bancas.** As limitações metodológicas e ressalvas científicas deste relatório continuam aplicáveis. Não houve alteração deJSON pelo revisor.
