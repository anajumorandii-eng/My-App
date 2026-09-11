# Hipóteses de diferenciação do CRIVO

Estas são hipóteses derivadas do produto atual. Precisam ser confrontadas com pesquisa competitiva e usuários.

## 1. Decisão acima de produtividade

**Hipótese:** a diferença central é escolher o que vale fazer, adiar ou eliminar, em vez de apenas organizar tarefas.

Evidência interna:
- ranking de ações;
- orçamento de tempo;
- lista de itens adiados;
- explicação “Por que isso?”.

## 2. Intervenção mínima eficaz

**Hipótese:** o produto pode recomendar uma pergunta, questão guiada, microbloco ou revisão curta antes de “rever a matéria inteira”.

Evidência interna:
- catálogo de intervenções em `errorDiagnosis.ts`.

## 3. Domínio com incerteza

**Hipótese:** separar nível de domínio e confiança na estimativa é mais honesto que barras de progresso genéricas.

Evidência interna:
- `level`;
- `uncertainty`;
- `origin`;
- labels de confiança.

## 4. Erro como dado

**Hipótese:** registrar o raciocínio que produziu o erro e acompanhar intervenção gera mais valor do que apenas mostrar gabarito.

Evidência interna:
- Caderno de Erros;
- causa;
- hipótese;
- intervenção;
- outcome.

## 5. Vestibular como contexto, não currículo universal

**Hipótese:** prioridade deve variar com banca, fase, incidência e proximidade.

Evidência interna:
- pesos por banca;
- calendário;
- incidência;
- protocolos por banca.

## 6. IA sob controle

**Hipótese:** IA que recomenda e explica, mas não substitui regras determinísticas nem confirmação humana, aumenta confiança e segurança.

Evidência interna:
- Motor de Eficiência determinístico;
- parsers de saída;
- confiança limitada;
- tarefa funciona mesmo quando IA falha em fluxos críticos.

## Pergunta competitiva

Para cada hipótese, procurar:
1. quem já faz isso;
2. quão profundamente faz;
3. como comunica;
4. se é diferencial ou padrão de mercado;
5. se usuários valorizam;
6. qual parte é difícil de copiar.
