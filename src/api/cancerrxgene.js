export default async function cancerrxgene(params, ...args) {
  const cancerRxGeneResponse = await fetch(
    `https://www.cancerrxgene.org/api/feature_link?feature=${params.geneId}`,
  );
  const cancerRxGeneLink = await cancerRxGeneResponse.json();
  return cancerRxGeneLink.link === "None" ? null : cancerRxGeneLink.link;
}
