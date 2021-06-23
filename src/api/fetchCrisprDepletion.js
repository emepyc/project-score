import Deserialiser from 'deserialise-jsonapi';

import {get} from './api';

const deserialiser = new Deserialiser();

const params = {
  'page[size]': 0,
}

export default function fetchCrisprDepletion(geneId, ...args) {
  return get(`genes/${geneId}/crispr_depletion`, params, ...args)
    .then(resp => deserialiser.deserialise(resp))
    .then(crisprDepletion => {
      const cancerTypesCount = crisprDepletion.length;
      const cancerTypeDepletion = crisprDepletion.filter(cancerType => cancerType.depleted === 1);
      return {
        total: cancerTypesCount,
        significant: cancerTypeDepletion.length,
      };
    });
}
