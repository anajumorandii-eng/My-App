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
  ].filter(scene => scene.match.test(scope)) : [];
  return {
    ...brief,
    frontScenes: scenes.length ? scenes.map(scene => scene.front) : ['Choose one dominant object, structure or relationship required by the exact scope. Use only its relevant supporting motifs from this brief.'],
    backScenes: scenes.length ? scenes.map(scene => scene.back) : ['Choose a DIFFERENT scene grounded in the same exact scope: its context, interacting structure, application or consequence. Every dominant and supporting motif on this side must identify that scope independently. Do not use a generic scenic landscape or a discipline-wide decorative inventory.'],
    connection: scenes.length ? scenes.map(scene => scene.connection) : ['Choose a small visual connection inherent to the selected relationship, such as its own structural line or material trace. Shared palette and linework also create continuity; do not force a natural setting or atmospheric connector into unrelated content.'],
    pairRule: 'Plan both sides before painting. For combined scopes integrate only the matching relationships into one composition per side; these are alternatives and guidance, not a mandatory object inventory. Check each side independently against the exact scope. A coherent palette or an attractive connection never excuses an unrelated rear scene. Use no content examples from another topic. The quoted subtopic always takes precedence.',
  };
}
