# Entrega G — Literatura do século XIX

Base: `f990e937fe8d90c66f44b838a5e1826cee8f3929`, depois da integração da Entrega F (PR #262).
Esta entrega trata oito capítulos do lote LG3; os outros 21 (do Modernismo em
diante) continuam na fila. Não promove aprovação editorial.

## Mudanças verificáveis

| Capítulo | Operação central (exemplos autorais) |
| --- | --- |
| Romântica: Poesia | Fundar herói (juramento cavaleiresco), fugir para a noite (morte como promessa), interpelar a plateia (apóstrofe condoreira). |
| Romântica: Prosa | Dote antes da noiva, com reordenação manipulável; casal como mito de fundação; interior idealizado; final que restaura a ordem. |
| Estética Realista | Fachada do casamento; ironia do comendador; deliberação contra determinismo. |
| Naturalismo | Tripé “segundo o narrador”; o pátio que age; denúncia e estereótipo no mesmo romance. |
| Eça de Queirós | Interior como índice de caráter; gesto que desmente a fala; brasão guardado e projetos adiados. |
| Parnasianismo | Recuo do eu; lapidação da imagem (ourives); paródia modernista. |
| Simbolismo | Sugerir contra nomear; sinestesia de três sentidos; aliteração. |
| Pré-Modernismo | Três registros de Os Sertões; herança acadêmica contra ruptura irônica. |

São 40 seções com 900 a 1.038 caracteres, cinco etapas, seis armadilhas com
correção e dois problemas resolvidos por capítulo. Títulos e recalls foram
preservados; só esses oito registros receberam `rev: 2`. Os exemplos são
autorais e declarados na interface; nenhum verso ou trecho dos autores foi
reproduzido, e nenhum material de apostila foi usado. Cada âncora da oficina
aparece literalmente na seção citada (teste `LiteratureFoundations.test.tsx`).

A Prosa romântica caía numa cena de tipologia (quatro vertentes em cartões);
agora tem instrumento de tópico exato, `romantic-prose`, e a cena antiga segue
registrada, com a citação ajustada ao texto novo. A matriz passa a 8
experimentos, 43 pranchas, 333 instrumentos e 229 cenas, sem lacunas.

## Revisão de conteúdo

- Indianismo é idealização a serviço da nação, não etnografia; a voz condoreira
  fala sobre os escravizados, o que não anula a denúncia.
- Final conciliador de Senhora não apaga a crítica ao casamento-transação.
- Realismo × Naturalismo decidido pela causa atribuída à conduta, não pelo tema.
- “Raça” no tripé é conceito do século XIX, hoje refutado; tese do narrador não
  é prova sobre pessoas reais.
- Jeca Tatu: crítica inicial, depois reinterpretada pelo próprio Lobato.
- Simbolismo e Parnasianismo foram contemporâneos; imprecisão simbolista é escolha.

## Conferência no navegador

`scripts/audit-literature-foundations.mjs`, sobre a build de produção: 128
configurações (360/390/834/1366, claro/escuro, movimento normal/reduzido), 128
aprovadas, sem violação axe (wcag2a/aa/21aa), texto cortado, colisão ou
overflow horizontal. Kalam, Newsreader e Inter foram carregadas de fato.

Problemas reproduzidos e tratados durante a conferência:

- No servidor de desenvolvimento, cada gravação de evidência disparava recarga
  da página e destruía o contexto do teste; a rodada válida usa a build.
- O Chromium da sessão remota não confiava na CA do proxy e media a tela com
  fonte de fallback. `CRIVO_AUDIT_FONT_RELAY=1` repassa as fontes pelo Node,
  que verifica TLS com a CA da sessão — sem desativar verificação.
- Pré-Modernismo falhou nas 8 configurações de movimento normal: “Herança” e
  “Ruptura” não tinham nenhum elemento animado. Ganharam a seta da leitura.

Safari/iPad físico e estados autenticados reais não foram certificados.
Testes: lint limpo, 922 Node + 1.170 Vitest aprovados.
