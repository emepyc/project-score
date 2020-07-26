import filter from 'lodash.filter';
import keyBy from 'lodash.keyby';
import identity from 'lodash.identity';
import last from 'lodash.last';
import findIndex from 'lodash.findindex';

import fetchOtEvidence from "./fetchOtEvidence";

export default async function fetchOtGeneInfo({ensemblId}) {
  const otGeneResponse = await fetch(`https://platform-api.opentargets.io/v3/platform/private/target/${ensemblId}`);
  const otGene = await otGeneResponse.json();
  const hallmarks = otGene.hallmarks;

  const tractability = otGene.tractability
  const tractabilityLabels = tractability && tractability.smallmolecule ? filter(
    Object.keys(
      tractability.smallmolecule.categories
    ), key => tractability.smallmolecule.categories[key] === 1) : [];

  const otGeneDrugs = await fetchOtEvidence({
    ensemblId,
  });

  return {
    cancerHallmarks: hallmarks ? hallmarks.cancer_hallmarks : null,
    tractability: normaliseTractabilityInfo(tractabilityLabels.map(label => label.replace(/_/g, " "))),
    drugs: otGeneDrugs,
  };
}

const tractabilityLabels = ['clinical precedence', 'predicted tractable', 'discovery precedence'];
const tractabilityCategories = ['clinical', 'predicted', 'discovery']

function normaliseTractabilityInfo(activeTractabilityLabels) {
  const activeTractabilityDict = keyBy(activeTractabilityLabels, identity);

  const maxCategory = last(tractabilityLabels.filter(label => activeTractabilityDict[label]));
  const maxCategoryIndex = findIndex(tractabilityLabels, label => label === maxCategory);

  return {
    maxCategory: tractabilityCategories[maxCategoryIndex] || null,
    labels: tractabilityLabels,
    categories: tractabilityCategories,
  }
}
