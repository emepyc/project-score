import filter from 'lodash.filter';
import groupBy from 'lodash.groupby';
import {request, gql} from 'graphql-request';


export default async function fetchOtGeneInfo({ensemblId}) {

  const otTargetQuery = gql`
      query target($ensemblId: String!) {
          target(ensemblId: $ensemblId) {
              hallmarks {
                  cancerHallmarks {
                      description
                      impact
                      label
                      pmid
                  }
                  attributes {
                      name
                      description
                      pmid
                  }
              }
#              tractability {
#                  id
#                  modality
#                  value
#              }
              knownDrugs(size:10000){
                  uniqueDrugs
                  uniqueDiseases
                  uniqueTargets
                  rows{
                      prefName
                      drugType
                      mechanismOfAction
                      label
                      phase
                      status
                      ctIds
                      urls{
                          url
                          name
                      }
                  }
              }
          }
      }
  `
  const variables = {
    ensemblId,
  }

  const otGeneGraphqlResponse = await request(
    'https://api.platform.opentargets.org/api/v4/graphql',
    otTargetQuery,
    variables,
  )

  const otGene = otGeneGraphqlResponse.target
  const hallmarks = otGene.hallmarks;
  const cancerHallmarks = hallmarks && hallmarks.cancerHallmarks ? {
    roleInCancer: filter(
      hallmarks.attributes,
      attr => attr['name'] === 'role in cancer',
    ).map(x => x.description).join(', '),
    hallmarks: hallmarks.cancerHallmarks,
  } : null;

  // TODO: Removed because tractability has been left out for now, but kept the code in case it is reinstated
  // const tractability = otGene.tractability
  // const tractabilityLabels = tractability && tractability.smallmolecule ? filter(
  //   Object.keys(
  //     tractability.smallmolecule.categories
  //   ), key => tractability.smallmolecule.categories[key] === 1) : [];
  //
  // console.log(tractabilityLabels);

  // const otGeneDrugs = await fetchOtEvidence({
  //   ensemblId,
  // });

  const knownDrugs = otGene.knownDrugs;
  const otDrugs = {
    uniqueDrugs: knownDrugs ? +knownDrugs.uniqueDrugs : 0,
    clinicalTrialsPerPhase: knownDrugs ? groupBy(
      knownDrugs.rows,
      clinicalTrial => clinicalTrial.phase,
    ) : {},
  };

  return {
    cancerHallmarks,
    // tractability: normaliseTractabilityInfo(tractabilityLabels.map(label => label.replace(/_/g, " "))),
    drugs: {
      uniqueDrugs: +otDrugs.uniqueDrugs,
      clinicalTrialsPerPhase: Object.keys(otDrugs.clinicalTrialsPerPhase).map(phase => ({
        pos: +phase,
        phase,
        label: `Phase ${phaseFromPhase(phase)}`,
        total: otDrugs.clinicalTrialsPerPhase[phase].length,
      })),
    },
  };
}

// TODO: Removed because tractability has been left out for now, but kept the code in case it is reinstated
// const tractabilityLabels = ['predicted tractable', 'discovery precedence', 'clinical precedence'];
// const tractabilityCategories = ['predicted', 'discovery', 'clinical'];

// TODO: Removed because tractability has been left out for now, but kept the code in case it is reinstated
// function normaliseTractabilityInfo(activeTractabilityLabels) {
//   const activeTractabilityDict = keyBy(activeTractabilityLabels, identity);
//
//   const maxCategory = last(tractabilityLabels.filter(label => activeTractabilityDict[label]));
//   const maxCategoryIndex = findIndex(tractabilityLabels, label => label === maxCategory);
//
//   return {
//     maxCategory: tractabilityCategories[maxCategoryIndex] || null,
//     labels: tractabilityLabels.map(label => `small molecule: ${label}`),
//     categories: tractabilityCategories,
//   }
// }

function phaseFromPhase(phase) {
  if (phase === "0") {
    return "0";
  } else if (phase === "1") {
    return "I";
  } else if (phase === "2") {
    return "II";
  } else if (phase === "3") {
    return "III";
  } else if (phase === "4") {
    return "IV";
  }
}
