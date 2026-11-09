import { buildCoverVisualBrief } from './coverVisualBrief';
import type { PrintCoverContext } from './printCoverSpec';

/** Escolhe as duas cenas pelo recorte; referências de outro tema não entram no prompt. */
export function buildCoverPairVisualBrief(context: PrintCoverContext) {
  const brief = buildCoverVisualBrief(context);
  const scope = brief.scope.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const scenes = brief.theme === 'geography' ? [
    {
      match: /popul|demograf|envelhecimento|estrutura etaria|natalidade|mortalidade|forca de trabalho/,
      front: 'Population geography: territorial settlement patterns and age-cohort relationships appropriate to the exact demographic scope, with a Brazilian territory only when Brazil is selected.',
      back: 'A distinct inhabited setting showing the selected population relationship through different generations, households or access to services; depict demographic change through its relevant lived context, not a scenic natural landscape.',
      connection: 'Continue a restrained settlement or population-flow trace between the two demographic scenes.',
    },
    {
      match: /urban|metropol|segreg|rede urbana|mobilidade|habitacao|moradia|saneamento/,
      front: 'Urban geography: an interconnected urban fabric and settlement network grounded in the selected territory and spatial process.',
      back: 'Distinct connected urban neighborhoods showing housing, public transport, commuting and access to infrastructure where relevant to the selected urban problem. The urban relationships are dominant; vegetation or relief must not replace the topic.',
      connection: 'Continue a street, transit route or urban-network line across the fold at matching scale.',
    },
    {
      match: /migra|exodo|refugiad|deslocamento populacional/,
      front: 'Migration geography: origin-destination relationships and population movements within the selected territory, without invented statistical routes or quantities.',
      back: 'A different inhabited origin or destination setting showing the social and spatial relationships of the selected migration process, not a generic pastoral scene.',
      connection: 'Use the same restrained movement trace between origin and destination, without invented data labels.',
    },
    {
      match: /climat|aquecimento global|efeito estufa/,
      front: 'Climatology: an impressive complete globe IN ITS ANTIQUE BRASS SUPPORT WITH VISIBLE BASE AND STAND, relevant atmospheric processes, storm and sun; never a floating spherical Earth.',
      back: 'Brazilian watershed landscape with mountains, forest, a river, agriculture and a small city only for a Brazilian environmental scope; otherwise use a watershed appropriate to the selected territory, without another globe or weather instruments.',
      connection: 'A delicate cloud band connects the higher contextual landscape to the lower atmospheric motif across the fold.',
    },
  ].filter(scene => scene.match.test(scope)) : brief.theme === 'biology' ? [
    {
      match: /^(genetica|hereditariedade|genetica e hereditariedade)$/,
      front: 'Molecular heredity: paired DNA strands winding toward chromatin and a softly translucent nucleus, with fine structural studies and microscopy instruments subordinate to the molecular protagonist.',
      back: 'Mendelian inheritance: pea plants with flowers, pods and seed variations intertwined with an open botanical study notebook and restrained crossing relationships, without readable notes or invented ratios.',
      connection: 'A delicate DNA filament becomes a botanical stem trace between the molecular and Mendelian studies, as a decorative connection rather than a literal biological transformation.',
    },
    {
      match: /(?:replicacao|duplicacao).*dna|dna.*(?:replicacao|duplicacao)/,
      front: 'DNA replication: a dominant opening double helix with separated template strands and emerging complementary strands, fine molecular engraving and translucent structural detail.',
      back: 'A different close study of the replication fork and complementary strand assembly, without unrelated laboratory or botanical inventory.',
      connection: 'Continue one delicate DNA backbone trace between the two replication studies.',
    },
    {
      match: /^(?!.*(?:nao[\s-]*mendel|non[\s-]*mendel)).*(?:mendel|monoibrid|diibrid)/,
      front: 'Mendelian inheritance: flowering pea stems, open pods and contrasting seed traits composed as one detailed botanical study of the selected crossing scope.',
      back: 'A distinct botanical notebook study of pea flowers, pods and inherited trait correspondences, without readable notes, invented ratios or unrelated molecular structures.',
      connection: 'A fine pea tendril links the two botanical studies.',
    },
  ].filter(scene => scene.match.test(scope)) : brief.theme === 'mathematics' ? [
    {
      match: /^geometria plana$/,
      front: 'Plane geometry: a brass compass and straightedge among fine circles, triangles and tangent planar constructions, layered translucent washes and precise engraved construction marks; no solids.',
      back: 'A distinct open construction notebook with planar geometric studies and draughting tools, interwoven arcs and proportion relationships, no readable formulas or spatial solids.',
      connection: 'A delicate construction arc continues between the two planar studies.',
    },
    {
      match: /semelhanca.*triangul/,
      front: 'Triangle similarity: corresponding triangles at different scales, aligned corresponding sides and fine proportional construction lines; the triangles remain the dominant motif.',
      back: 'A different planar construction study showing corresponding angles and scaled triangle relationships without invented numerical labels.',
      connection: 'A fine corresponding-side construction line links the two triangle studies.',
    },
  ].filter(scene => scene.match.test(scope)) : brief.theme === 'physics' ? [
    {
      match: /^(?!.*(?:eletric|circuit|pilha|bateria|termic|termo|quimic|calor|luz|fotoss|nuclear)).*(?:dinamica energetica|energia mecanica|trabalho e energia)/,
      front: 'Mechanical energy unfolding: a rolling sphere on a graceful gravity track develops gravitational potential into kinetic energy, with restrained motion echoes and an elastic spring or swinging pendulum only where relevant. Integrate study pages, material detail and directional depth into one expansive living scene, not a catalog of standing machines.',
      back: 'A different scientific study scene develops mechanical work against gravity through a raised mass, a coherent pulley or inclined plane, and finely engraved study leaves in motion. Choose only mechanisms justified by the selected scope, no generic steam engine or industrial inventory.',
      connection: 'A continuous engraved trajectory emerges from the left study and develops into the right moving path, visibly joining both scenes across the fold at matching height and scale; this is an illustrated study-to-phenomenon connection, not a literal perpetual-motion transmission.',
    },
  ].filter(scene => scene.match.test(scope)) : brief.theme === 'chemistry' ? [
    {
      match: /modelo.*dalton|dalton.*modelo/,
      front: 'Dalton atomic model: solid spherical atoms as the historical indivisible-particle representation, with precise material texture and related particle combinations; no nucleus, embedded charges or modern density envelope.',
      back: 'A different engraved Dalton study folio develops the selected particle proportions and combinations, with curling paper and coherent relationships rather than later atomic structures.',
      connection: 'A continuous particle-study construction trace develops from the left folio into the right Dalton spheres across the fold.',
    },
    {
      match: /modelo.*thomson|thomson.*modelo/,
      front: 'Thomson atomic model: a continuous positively charged sphere with embedded electrons, shown as a historical representation; no concentrated nucleus or later planetary structure.',
      back: 'A different Thomson study scene develops charge distribution within the selected historical model, using fine engraved studies and layered paper.',
      connection: 'A continuous charge-distribution study trace develops from the left folio into the right Thomson representation across the fold.',
    },
    {
      match: /modelo.*rutherford|rutherford.*modelo/,
      front: 'Rutherford atomic model: a compact nucleus and surrounding electrons in a largely empty atomic volume, clearly a historical nuclear representation rather than a modern density envelope.',
      back: 'A distinct Rutherford scattering study shows incident and deflected paths around a thin foil where relevant to the selected historical scope, without invented numerical results.',
      connection: 'A fine continuous scattering-study trajectory develops from the left experiment into the right nuclear representation across the fold.',
    },
    {
      match: /modelo.*bohr|bohr.*modelo/,
      front: 'Bohr atomic model: quantized electron energy shells and a restrained transition study, explicitly a historical model with discrete energy levels rather than a modern density envelope.',
      back: 'A different Bohr study folio develops discrete levels and absorption or emission relationships only where selected, with fine engraved construction and curling paper.',
      connection: 'A continuous energy-level construction trace develops from the left folio into the right Bohr shell study across the fold.',
    },
    {
      match: /^(?!.*(?:dalton|thomson|rutherford|bohr)).*(?:modelos? atomic|estrutura (?:do )?atomo|estrutura atomica)/,
      front: 'Atomic structure: a finely resolved nucleus within a translucent electron-density cloud, with layered engraved texture and directional depth; represent modern density rather than literal hard planetary electron paths.',
      back: 'An open atomic study folio with curling leaves develops historical atomic models as distinct engraved studies, including scattering relationships only when pertinent. Distinguish historical representations from the modern cloud, without invented labels or equations.',
      connection: 'A continuous electron-density trace grows from the left atomic studies and develops into the right atomic structure, visibly crossing the fold without a gap.',
    },
    {
      match: /polaridade|ligacoes? polares?|ligacao covalente polar/,
      front: 'Bond polarity: choose the exact selected molecule and show its geometry and unequal electron-density distribution where applicable; respect any cancellation of bond dipoles in the selected molecule. For a general polar-bond scope, a bent water molecule may carry the composition with one oxygen and exactly two hydrogens, a denser envelope toward oxygen and restrained surrounding molecular orientations. Never substitute water for a different specifically selected molecule.',
      back: 'A different molecular study scene develops bond geometry and electron sharing through delicate structural studies and curling paper, with relevant microscopic organization rather than unrelated reaction glassware or prism rainbows.',
      connection: 'A continuous electron-density envelope develops from the left bonding studies into the right molecular scene, visibly touching both sides across the fold. When atomic structure is also selected, grow this same envelope from atomic density into bonding instead of adding a second disconnected bridge.',
    },
  ].filter(scene => scene.match.test(scope)) : [];
  return {
    ...brief,
    frontScenes: scenes.length ? scenes.map(scene => scene.front) : ['Choose one dominant object, structure or relationship required by the exact scope. Use only its relevant supporting motifs from this brief.'],
    backScenes: scenes.length ? scenes.map(scene => scene.back) : ['Choose a DIFFERENT scene grounded in the same exact scope: its context, interacting structure, application or consequence. Every dominant and supporting motif on this side must identify that scope independently. Do not use a generic scenic landscape or a discipline-wide decorative inventory.'],
    connection: scenes.length ? scenes.map(scene => scene.connection) : ['Choose one continuous visual connection inherent to the selected relationship, such as its structural line, material trace or a study developing into the selected phenomenon. It must visibly touch both scenes at matching height and scale across the fold. For textual or conceptual content, use a meaningful editorial line or shared manuscript structure, without readable invented text. Do not force a natural setting, physical apparatus or atmospheric connector into unrelated content.'],
    pairRule: 'Plan both sides before painting. For combined scopes integrate only the matching relationships into one composition per side; these are alternatives and guidance, not a mandatory object inventory. Check each side independently against the exact scope. Select one meaningful continuous connector and develop it across the fold; a matching palette alone is insufficient. A coherent palette or an attractive connection never excuses an unrelated rear scene. Use no content examples from another topic. The quoted subtopic always takes precedence.',
  };
}
