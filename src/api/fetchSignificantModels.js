import Deserialiser from 'deserialise-jsonapi';
import orderBy from 'lodash.orderby';

import {get} from './api';
import {totalModels} from './utils';
import fetchCrisprDepletion from "./fetchCrisprDepletion";

const deserialiser = new Deserialiser();

const params = {
  include: 'essentiality_profiles',
  'fields[gene]': 'tumour_suppressor,essentiality_profiles',
};

export default function fetchSignificantModels({geneId}, ...args) {
  const crisprDepletionPromise = fetchCrisprDepletion(geneId);
  const significantModelsPromise = get(`genes/${geneId}`, params, ...args)
    .then(resp => deserialiser.deserialise(resp))
    .then(gene => {
      const essentiality_profile_sorted = orderBy(
        gene.essentiality_profiles,
          profile => profile.id,
        'desc',
      );
      const essentialityProfile = essentiality_profile_sorted[0];
      return {
        numberOfSignificantModels: ~~(totalModels * essentialityProfile.vulnerable_pancan / 100),
        isPanCancer: essentialityProfile.core_fitness_pancan,
        isTumourSuppressor: gene.tumour_suppressor,
        isCommonEssential: essentialityProfile.common_essential === "CE",
      }
    });
  return Promise.all([crisprDepletionPromise, significantModelsPromise])
    .then(([crisprDepletion, significantModels]) => {
      return {
        ...significantModels,
        numberOfSignificantTissues: crisprDepletion.significant,
        numberOfTotalTissues: crisprDepletion.total,
      }
    });
}
