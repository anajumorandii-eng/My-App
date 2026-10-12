p='src/views/visual-boards/IndependenceBoard.tsx'
s=open(p).read()
def rep(a,b):
    global s
    assert a in s, a[:60]
    s=s.replace(a,b,1)
rep("import ExceptionalHumanitiesIllustration from '../visual-instruments/ExceptionalHumanitiesIllustration';","import ExceptionalHumanitiesIllustration from '../visual-instruments/ExceptionalHumanitiesIllustration';\nimport { StageStepBar } from '../visual-stage/stageCases';")
rep("""export default function IndependenceBoard({ map, states, selectedId, onSelect }: BoardProps) {
  const reducedMotion = useReducedMotion();
  const [processo, guerras, continuidades] = map.nodes;
  const focus: Focus = selectedId === guerras?.id ? 'guerras'
    : selectedId === continuidades?.id ? 'continuidades'
      : selectedId === processo?.id ? 'processo' : 'nenhum';""","""export default function IndependenceBoard({ map, states, selectedId, onSelect, activeStep, onStepChange, mode }: BoardProps) {
  const reducedMotion = useReducedMotion();
  const [processo, guerras, continuidades] = map.nodes;
  const noPalco = activeStep !== undefined && Boolean(onStepChange);
  // Os três eixos da prancha são os nós 0, 1 e 2 do capítulo (contexto,
  // guerras, continuidades). No palco, sem nó selecionado, a etapa ativa é que
  // escolhe o eixo; nas etapas de pegadinhas e de prática a prancha inteira
  // fica acesa e a faixa aponta para a armadilha ou para o exercício.
  const doPalco: Focus = !noPalco ? 'nenhum'
    : activeStep === 0 ? 'processo' : activeStep === 1 ? 'guerras' : activeStep === 2 ? 'continuidades' : 'nenhum';
  const focus: Focus = selectedId === guerras?.id ? 'guerras'
    : selectedId === continuidades?.id ? 'continuidades'
      : selectedId === processo?.id ? 'processo' : doPalco;
  const armadilha = noPalco && map.nodes[activeStep as number]?.stage === 'estrategia';""")
rep("""    <ExceptionalHumanitiesIllustration kind="independence\"""","""    {noPalco && onStepChange && <StageStepBar map={map} step={activeStep as number} mode={mode} onStepChange={onStepChange}>
      {mode === 'reconstruir'
        ? <p className="stage-lens-mission" role="note"><b>Desafio na cena.</b> Percorra a linha de 1821 a 1823 e as três continuidades; depois escreva, na reconstrução do painel, o vínculo que a prancha mostra.</p>
        : <div className="stage-lens-focus"><span>{focus === 'processo' ? 'Nesta etapa: o conflito que vem antes do grito.'
          : focus === 'guerras' ? 'Nesta etapa: as guerras que seguem 1822.'
            : focus === 'continuidades' ? 'Nesta etapa: o que atravessa a mudança.'
              : armadilha ? 'Nesta etapa: a pegadinha de prova, no rodapé da prancha.' : 'Nesta etapa: a prancha inteira, para resolver o exercício do painel.'}</span></div>}
    </StageStepBar>}
    <ExceptionalHumanitiesIllustration kind="independence\"""")
rep("""    <footer><strong>Pegadinha de prova:</strong>""","""    <footer data-stage-focus={armadilha ? 'true' : undefined}><strong>Pegadinha de prova:</strong>""")
open(p,'w').write(s)
