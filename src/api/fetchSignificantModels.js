import {get} from "./api";
import Deserialiser from "deserialise-jsonapi";
import {totalModels} from "./utils";

const deserialiser = new Deserialiser();

const params = {
  include: 'essentiality_profiles',
  'fields[gene]': 'tumour_suppressor,essentiality_profiles',
};

export default function fetchSignificantModels(geneId) {
  return get(`genes/${geneId}`, params)
    .then(resp => deserialiser.deserialise(resp.data))
    .then(gene => {
      const tissuesCounts = getTissuesCounts(gene.essentiality_profiles[0]);
      return {
        numberOfSignificantModels: ~~(totalModels * gene.essentiality_profiles[0].vulnerable_pancan / 100),
        isPanCancer: gene.essentiality_profiles[0].core_fitness_pancan,
        isTumourSuppressor: gene.tumour_suppressor,
        numberOfSignificantTissues: tissuesCounts.significant,
        numberOfTotalTissues: tissuesCounts.total,
      }
    });
}


function getTissuesCounts(attributes) {
  const allTissues = Object.keys(attributes).filter(
    attribute => attribute.indexOf('adm_status_') > -1
  );
  const significantTissues = allTissues.filter(tissue => attributes[tissue] !== null);
  return {
    total: allTissues.length,
    significant: significantTissues.length,
  }
}
