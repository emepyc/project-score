import Deserialiser from 'deserialise-jsonapi';
import orderBy from 'lodash.orderby';

import {get} from './api';
import fetchNumberOfModels from "./fetchNumberOfModels";
import fetchCrisprDepletion from "./fetchCrisprDepletion";

const deserialiser = new Deserialiser();

const params = {
  include: 'essentiality_profiles',
  'fields[gene]': 'tumour_suppressor,essentiality_profiles',
};

export default function fetchSignificantModels({geneId}, ...args) {
  const crisprDepletionPromise = fetchCrisprDepletion(geneId);
  const numberOfModelsPromise = fetchNumberOfModels(geneId);
  const significantModelsPromise = get(`genes/${geneId}`, params, ...args)
    .then(resp => deserialiser.deserialise(resp));

  return Promise.all([crisprDepletionPromise, significantModelsPromise, numberOfModelsPromise])
    .then(([crisprDepletion, gene, numberOfModels]) => {
      const significantModels = parseGene(gene, numberOfModels);
      return {
        ...significantModels,
        numberOfSignificantTissues: crisprDepletion.significant,
        numberOfTotalTissues: crisprDepletion.total,
        totalModels: numberOfModels,
      }
    });
}

function parseGene(gene, totalModels) {
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
    isCommonEssential: essentialityProfile.common_essential === "true",
  };
}
