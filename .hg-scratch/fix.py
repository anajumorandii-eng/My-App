import re
def edit(p, pairs):
    s=open(p).read()
    for a,b in pairs:
        assert a in s, (p, a[:70])
        s=s.replace(a,b,1)
    open(p,'w').write(s)

edit('src/views/visual-instruments/GeographyContextInstrument.tsx', [
 ("import { casesDeclaration } from '../visual-stage/caseDeclaration';\nimport type { InteractiveSummary } from '../../types/summary';", "import { contextCaseItems } from '../visual-stage/caseDeclaration';"),
 ("  const items = config.cases.map((item) => ({ label: item.label, claim: `${item.observation} ${item.conclusion}` }));\n  function GeographyContextBoard", "  const items = contextCaseItems(config);\n  return function GeographyContextBoard"),
 ("  }\n  GeographyContextBoard.stage = (summary: InteractiveSummary) => casesDeclaration(summary, items);\n  return GeographyContextBoard;\n}", "  };\n}"),
])
edit('src/views/visual-instruments/HistoryInstrument.tsx', [
 ("import { casesDeclaration } from '../visual-stage/caseDeclaration';\nimport type { InteractiveSummary } from '../../types/summary';", "import { historyStateItems } from '../visual-stage/caseDeclaration';"),
 ("  const items = config.states.map((item) => ({ label: item.label, claim: `${item.focus} ${item.relation} ${item.evidence}` }));\n  function HistoryBoard", "  const items = historyStateItems(config);\n  return function HistoryBoard"),
 ("  }\n  HistoryBoard.stage = (summary: InteractiveSummary) => casesDeclaration(summary, items);\n  return HistoryBoard;\n}", "  };\n}"),
])
edit('src/views/visual-instruments/HistoryPhaseInstrument.tsx', [
 ("import { casesDeclaration } from '../visual-stage/caseDeclaration';\nimport type { InteractiveSummary } from '../../types/summary';", "import { contextCaseItems } from '../visual-stage/caseDeclaration';"),
 ("  const items = config.cases.map((item) => ({ label: item.label, claim: `${item.observation} ${item.conclusion}` }));\n  function HistoryPhaseBoard", "  const items = contextCaseItems(config);\n  return function HistoryPhaseBoard"),
 ("  }\n  HistoryPhaseBoard.stage = (summary: InteractiveSummary) => casesDeclaration(summary, items);\n  return HistoryPhaseBoard;\n}", "  };\n}"),
])
p='src/views/visual-instruments/CurrentAffairsDossier.tsx'
s=open(p).read()
a=s.index("/**\n * Peças do dossiê que saem da seção de um nó.")
b=s.index("export function currentAffairsDossier(")
s=s[:a]+s[b:]
s=s.replace("import { buildVisualMap, STAGE_LABEL } from '../../lib/visualStudy';\nimport type { InteractiveSummary } from '../../types/summary';\nimport type { StageSceneDeclaration } from '../visual-stage/contract';\nimport { StageStepBar } from '../visual-stage/stageCases';",
 "import { STAGE_LABEL } from '../../lib/visualStudy';\nimport { StageStepBar } from '../visual-stage/stageCases';\nimport { piecesOfSection } from '../visual-stage/caseDeclaration';")
s=s.replace("  function CurrentAffairsBoard(props: BoardProps) {","  return function CurrentAffairsBoard(props: BoardProps) {",1)
a=s.index("  // Um ponto por etapa, com o nome da primeira peça")
b=s.index("  return CurrentAffairsBoard;\n}")
s=s[:a]+s[b:].replace("  return CurrentAffairsBoard;\n}","",1)
s=s.replace("      closing={config.closing} />;\n  }\n","      closing={config.closing} />;\n  };\n}\n",1)
s=s.replace("""    const stepStatement = node""","""    // O dossiê registra de que seção cada peça e cada afirmação saíram
    // (`sectionId`), então a etapa não adivinha o que discute: é a seção dela.
    const stepStatement = node""")
open(p,'w').write(s)

edit('src/views/visual-stage/declarations.ts', [
 ("import { sceneStageDeclaration } from './sceneDeclarations';", "import { sceneStageDeclaration } from './sceneDeclarations';\nimport { instrumentStageDeclaration } from './caseDeclaration';"),
 ("  const component = (representation", "  // Laboratórios de recortes chegam embrulhados em lazyBoard: declaram pelo id.\n  if (representation === 'instrument') { const declared = instrumentStageDeclaration(summary); if (declared) return declared; }\n  const component = (representation"),
])
