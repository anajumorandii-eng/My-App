# Aprendizados de usabilidade já registrados

Este arquivo reúne problemas históricos encontrados durante implementação. Eles não devem ser tratados automaticamente como defeitos atuais; vários já foram corrigidos. Servem como evidência de padrões de risco.

## 1. Métrica visual sem dado real

Um painel de treino chegou a desenhar uma barra de precisão com largura fixa, enquanto o texto mostrava outro estado.

**Aprendizado:** qualquer visual de domínio, precisão ou progresso deve ser rastreável até estado real. Nunca usar decoração que pareça dado.

## 2. Filtros que viram parede de opções

A tela de questões chegou a exibir mais de sessenta tópicos como chips.

**Aprendizado:** listas grandes exigem agrupamento, busca, hierarquia ou seleção progressiva. Mostrar tudo aumenta ruído sem aumentar controle.

## 3. Conteúdo escondido por barra fixa em retrato

A navegação inferior já encobriu o último cartão em iPad retrato.

**Aprendizado:** layouts móveis devem considerar altura real da navegação e `safe-area-inset-bottom`.

## 4. Falha da IA parecendo falha do produto inteiro

O diagnóstico de erro chegou a chamar uma rota inexistente e a interface mostrava apenas que “não conseguiu diagnosticar”.

**Aprendizado:** o recurso principal não pode depender silenciosamente da IA. O estado de falha deve preservar a tarefa e explicar o que aconteceu.

## 5. IA bloqueando registro de erro

Houve um fluxo em que o erro só era salvo se existisse diagnóstico da IA.

**Aprendizado:** automação deve ajudar, não impedir registro da evidência humana.

## 6. Valor padrão virando “verdade”

O tipo de erro já veio pré-selecionado como conceitual e podia ser salvo como confirmado sem escolha consciente.

**Aprendizado:** campo desconhecido deve começar como desconhecido. Defaults em dados diagnósticos criam falsa precisão.

## 7. Estado assíncrono invisível

O sistema possuía estado de “diagnosticando”, mas ele não era exibido.

**Aprendizado:** carregamento, sincronização, erro e fallback precisam ser perceptíveis.

## 8. Nome do produto inconsistente

O assistente já apareceu com nome antigo em prompts e telas.

**Aprendizado:** consistência de linguagem faz parte da confiança no sistema.

## Fontes

- `CLAUDE.md`
- histórico recente de PRs de interface e diagnóstico
- `docs/FUNCTIONALITY_MAP.md`
