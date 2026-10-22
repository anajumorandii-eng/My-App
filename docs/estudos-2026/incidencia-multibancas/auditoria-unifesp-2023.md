# Auditoria editorial — UNIFESP 2023, Sistema Misto

Revisão por leitura das fontes em 21/10/2026, em editor único, sem dupla codificação independente integral. Cobertura completa dos cadernos do Sistema Misto: Língua Portuguesa, Língua Inglesa e Redação em 12/01/2023 e Conhecimentos Específicos em 13/01/2023. O ENEM não foi reclassificado nem duplicado como UNIFESP.

## Fontes e versões

Índice primário consultado diretamente: https://documento.vunesp.com.br/projeto/UFSP2201/documento . O índice lista os dois cadernos e o gabarito objetivo, mas não apresentou espelho público de respostas discursivas na consulta realizada. As URLs de fluxo abaixo vieram desse índice. Os arquivos foram conferidos por cabeçalho PDF, tamanho e recálculo SHA-256 sobre bytes locais reais.

- Caderno de Questões - Prova de Conhecimentos Específicos.   13/01/2023 — https://documento.vunesp.com.br/documento/stream/MzI4MzY2Mg%3d%3d; 28 páginas, 2191846 bytes. SHA-256 `daa87d6a5e36f7abefb9f6785f774ade80d08147d0b7cf7d94543e3759d64677`.
- Gabarito da Prova de LP, LI e Redação - Público (versão 1 para divulgação na imprensa) - Atenção Candidato: para saber qual a sua versão de prova acesse a área do candidato.   12/01/2023 — https://documento.vunesp.com.br/documento/stream/MzI4MDE4OA%3d%3d; 1 páginas, 775186 bytes. SHA-256 `de5a7eeea2374858a1f75d8c4ef5c6f7f9ccd746529950092f6de7a2d9da9913`.
- Caderno de Questões da Prova de LP, LI e Redação - Público (versão 1 para divulgação na imprensa) - Atenção Candidato: para saber qual a sua versão de prova acesse a área do candidato.   12/01/2023 — https://documento.vunesp.com.br/documento/stream/MzI4MDIxMQ%3d%3d; 12 páginas, 693620 bytes. SHA-256 `ca8efd2955564ae222ccf95e481cdb3c68b64731e0ebad173a51513ead583cad`.

O caderno de línguas é o 001 público, identificado no índice como versão 1 para divulgação na imprensa; o gabarito traz explicitamente VERSÃO 1 e data 12.01.2023. A capa confirma 25 questões objetivas e uma proposta de redação. No JSON, a proposta é R, página física 10, e não herda a chave objetiva. O grupo linguas-objetiva mantém 26 unidades por incluir R com denominador próprio de Redação.

O segundo caderno é 002, Conhecimentos Específicos; a capa confirma 20 questões discursivas. Todas apresentam subitens a e b, preservados como subitems, sem transformá-los em questões extras. Não se atribuiu número de versão não impresso ao caderno 002. Os grupos são linguas-objetiva e especificos-discursiva, com phaseGroup 1a e 2a; os rótulos de phase são os nomes humanos dos cadernos.

## Contagens e anulações

- linguas-objetiva: 26/26 unidades — Português: 13; Literatura: 2; Inglês: 10; Redação: 1.
- especificos-discursiva: 20/20 unidades — Biologia: 5; Química: 5; Física: 5; Matemática: 5.

Total: 46 unidades, sendo 25 questões objetivas, uma proposta e 20 questões discursivas. A chave objetiva foi lida: 25 respostas A–E, de 1 a 25, sem anulações indicadas. Nenhuma ficha foi excluída. Para específicos, não há espelho público localizado no índice consultado; por isso answerKeyUrl e answerKeySha256 são nulos e a ausência de anulação não é declarada como verificação por chave. Não se inventou PDF de solução ou gabarito de cursinho como fonte oficial.

## Inspeção visual e páginas

Texto extraído com pdftotext -layout preservando páginas físicas. O caderno de línguas tem 12 páginas; foram vistas as páginas 1–12 em três folhas de contato renderizadas com pdftoppm. Foram inspecionados o cartum de Will Santino com lobo e porquinhos na p. 3 (Q01–02), os trechos sublinhados dos itens gramaticais das p. 3–6 e o cartum de Joel Pett na p. 9 (Q25), além da proposta na p. 10. A identificação das marcas sublinhadas foi conferida nas imagens, evitando depender de informação perdida na extração simples.

O caderno de específicos tem 28 páginas. Todos os enunciados estão nas p. 3–22, lidos integralmente; as páginas 1–24 foram vistas em seis folhas de contato. Foram inspecionados: fusão de membranas (p. 3), pneumatóforos (p. 4), gráficos hormonais (p. 5), CO2 e imagem de Marte (p. 8), reação do etilenoglicol (p. 9), pilha e potenciais (p. 11), estruturas da curcumina (p. 12), lançamento da bola (p. 13), diagrama PV (p. 14), tábua/raio refratado (p. 15), perfis de onda (p. 16), circuito e corrente (p. 17), arame/quadrado (p. 19), senoide e fórmula g (p. 20). As páginas físicas 15 e 19 foram também ampliadas individualmente para conferir medidas, ângulos e segmentos. As páginas 23–24 contêm tabela periódica e formulário; as p. 25–28 são formulário matemático e espaços finais, sem questões adicionais segundo o texto extraído. Não se afirma inspeção visual dessas quatro páginas finais.

A extração omitiu algumas fórmulas e símbolos das questões 13, 17 e 18, além de sublinhados e partes dos gráficos. As imagens permitiram ler o índice relativo raiz de dois na Q13, os segmentos PR/QS e a diagonal PS na Q17, e g(x)=3+sen(pi x/2) na Q18. A classificação não foi inferida pela posição do item no caderno.

## Decisões editoriais concretas

- Literatura: somente Q05 (antecipação romântica na Marquesa de Alorna) e Q07 (identificação de Machado de Assis pelo perfil crítico). Q03 e Q06, apesar de serem poemas, exigem interpretação interna e figura de linguagem; Q12–13 não exigem conhecimento da obra de Drummond e ficaram em Português.
- Q10–11 e Q14 de línguas usam o tópico amplo Domínio da Norma Culta para morfologia/classes/tempos verbais, dado o recorte da taxonomia. Q04 e Q15 são Sintaxe; Q09 trata do sentido contextual de mesmo e ficou em Entendimento de Texto.
- Inglês Q16–25: turismo, trabalho remoto, biodiversidade e antropocentrismo são contextos dos textos; não se contaram Geografia, Biologia ou Filosofia como conhecimentos secundários, pois os argumentos e informações necessários estão fornecidos em inglês.
- Redação: mérito versus bem comum exige tese e desenvolvimento argumentativo. A menção a Piketty, Sandel e Revolução Francesa fornece repertório da coletânea; não foi contada automaticamente como incidência das demais disciplinas.
- Específicos Q01 centra-se na membrana, com fisiologia nervosa secundária pelo receptor colinérgico. Q02 centra-se na fisiologia radicular, com fixação de nitrogênio secundária.
- Q04 de específicos: há nota sobre explicitar a convenção de genoma nuclear haploide ou cariótipo somático diploide. A classificação em Genética é segura; sem espelho oficial, não se promete uma convenção de resposta adotada pela correção.
- Q05 de específicos tem dois eixos comparáveis, Ecologia em a e transgenia/expressão/replicação em b. Adotou-se Biotecnologia como principal, Ecologia e síntese genética como secundários, confiança média.
- Q06 combina geometria molecular e disposição das partículas por estado físico. Q07 é principalmente estequiometria de rendimento, com função álcool secundária. Q08 é equilíbrio de solubilidade, com concentração secundária.
- Q10 de específicos tem funções orgânicas e classificação ácido-base de soluções; adotou-se fundamentos orgânicos como principal, equilíbrio/inorgânica secundários, confiança média.
- Q11 de específicos agrega lançamento oblíquo e energia mecânica. Q13 combina estática em a e óptica em b; adotou-se óptica por seus dois resultados, com estática obrigatória secundária, confiança média. Q14 combina propagação ondulatória e MHS; o tópico secundário de gravitação/circular é usado porque a taxonomia abriga MHS ali, sem supor que o problema cobre gravitação.
- Q16 de específicos é exclusivamente proporcionalidade e porcentagem; o coração do beija-flor fornece contexto, sem demandar fisiologia. Q18 é função seno, com dados e definições de onda já fornecidos, sem matéria Física secundária.

## Validação

JSON relido após gravação. Confirmados dois cadernos, 26 e 20 unidades conforme capas; sequência 01–25 mais R e 01–20; unicidade por caderno; páginas dentro dos limites; 40 subitens discursivos preservados; tópico principal válido e compatível com matéria; IDs secundários existentes; dois passos específicos por ficha; campos summary/rationale/trap/subtopics/skills preenchidos; notas em todos os casos de confiança média; nenhum item excluído sem razão. Hashes das três fontes foram recalculados e comparados ao inventário. O texto do gabarito cobre exatamente 25 números e letras A–E. R tem par de chave nulo; o caderno discursivo inteiro mantém o mesmo par nulo por ausência de espelho localizado.
