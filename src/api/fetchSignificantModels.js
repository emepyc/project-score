import Deserialiser from 'deserialise-jsonapi';
import orderBy from 'lodash.orderby';

import {get} from './api';
import {totalModels} from './utils';

const deserialiser = new Deserialiser();

const params = {
  include: 'essentiality_profiles',
  'fields[gene]': 'tumour_suppressor,essentiality_profiles',
};

export default function fetchSignificantModels({geneId}, ...args) {
  return get(`genes/${geneId}`, params, ...args)
    .then(resp => deserialiser.deserialise(resp))
    .then(gene => {
      const essentiality_profile_sorted = orderBy(
        gene.essentiality_profiles,
          profile => profile.id,
        'desc',
      );
      const essentiality_profile = essentiality_profile_sorted[0];
      const tissuesCounts = getTissuesCounts(essentiality_profile);
      return {
        numberOfSignificantModels: ~~(totalModels * essentiality_profile.vulnerable_pancan / 100),
        isPanCancer: essentiality_profile.core_fitness_pancan,
        isTumourSuppressor: gene.tumour_suppressor,
        numberOfSignificantTissues: tissuesCounts.significant,
        numberOfTotalTissues: tissuesCounts.total,
        isCommonEssential: essentiality_profile.common_essential === "CE",
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
