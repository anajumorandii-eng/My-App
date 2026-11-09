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
  ].filter(scene => scene.match.test(scope)) : [];
  return {
    ...brief,
    frontScenes: scenes.length ? scenes.map(scene => scene.front) : ['Choose one dominant object, structure or relationship required by the exact scope. Use only its relevant supporting motifs from this brief.'],
    backScenes: scenes.length ? scenes.map(scene => scene.back) : ['Choose a DIFFERENT scene grounded in the same exact scope: its context, interacting structure, application or consequence. Every dominant and supporting motif on this side must identify that scope independently. Do not use a generic scenic landscape or a discipline-wide decorative inventory.'],
    connection: scenes.length ? scenes.map(scene => scene.connection) : ['Choose a small visual connection inherent to the selected relationship, such as its own structural line or material trace. Shared palette and linework also create continuity; do not force a natural setting or atmospheric connector into unrelated content.'],
    pairRule: 'Plan both sides before painting. For combined scopes integrate only the matching relationships into one composition per side; these are alternatives and guidance, not a mandatory object inventory. Check each side independently against the exact scope. A coherent palette or an attractive connection never excuses an unrelated rear scene. Use no content examples from another topic. The quoted subtopic always takes precedence.',
  };
}
