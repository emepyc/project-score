import filter from 'lodash.filter';

export default async function fetchOtGeneInfo({ensemblId}) {
  const otGeneResponse = await fetch(`https://platform-api.opentargets.io/v3/platform/private/target/${ensemblId}`);
  const otGene = await otGeneResponse.json();
  const hallmarks = otGene.hallmarks;

  const tractability = otGene.tractability
  const tractabilityLabels = tractability && tractability.smallmolecule ? filter(
    Object.keys(
      tractability.smallmolecule.categories
    ), key => tractability.smallmolecule.categories[key] === 1) : [];

  return {
    cancerHallmarks: hallmarks ? hallmarks.cancer_hallmarks : null,
    tractability: tractabilityLabels.map(label => label.replace(/_/g, " ")),
  };
}
