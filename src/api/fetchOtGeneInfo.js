import groupBy from 'lodash.groupby';

export default async function fetchOtGeneInfo({ensemblId}) {
  const otGeneResponse = await fetch(`https://platform-api.opentargets.io/v3/platform/private/target/${ensemblId}`);
  const otGene = await otGeneResponse.json();
  console.log(otGene);
  const hallmarks = otGene.hallmarks;
  console.log(otGene.hallmarks);
  if (!hallmarks) {
    return null;
  }
  // const cancerHallmarks = groupBy(
  //   hallmarks.cancer_hallmarks,
  //   'label',
  // );
  //
  // console.log(cancerHallmarks);

  return {
    cancerHallmarks: hallmarks.cancer_hallmarks,
  };
}
