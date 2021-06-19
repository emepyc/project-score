import Deserialiser from 'deserialise-jsonapi';
import orderBy from 'lodash.orderby';

import {get} from './index';
import {
  expandScoreRangeFilter,
  expandGeneFilter,
  expandModelFilter,
  expandSearchFilter,
  expandExcludePanCancerGenesFilter,
  combineFilters,
  datasetEntpoint
} from "./filters";

const deserialiser = new Deserialiser();

function normaliseParams(params) {
  const geneFilter = params.geneId ?
    expandGeneFilter(params.geneId) :
    null;

  const excludePanCancerGenes = +params.excludePanCancerGenes ?
    expandExcludePanCancerGenesFilter() :
    null;

  const modelFilter = params.modelId ?
    expandModelFilter(params.modelId) :
    null;

  const searchFilter = params.search && params.search.length > 2 ?
    expandSearchFilter(params.search) :
    null;

  const scoreRangeFilter = params.scoreMin || params.scoreMax ?
    expandScoreRangeFilter({
      scoreMin: params.scoreMin,
      scoreMax: params.scoreMax
    }) :
    null;

  const combinedFilters = combineFilters([
    geneFilter,
    modelFilter,
    searchFilter,
    scoreRangeFilter,
    excludePanCancerGenes,
  ]);

  const sort_raw = params.sort || 'fc_clean';
  const sort = sort_raw === 'fc_clean' ? 'fc_clean_qn' : sort_raw;

  const sortDirection = params.sortDirection || 1;

  return {
    'page[number]': params.pageNumber,
    'page[size]': params.pageSize,
    include: "gene,gene.essentiality_profiles,model,model.sample.tissue,model.sample.cancer_type",
    filter: combinedFilters,
    sort: `${sortDirection === -1 ? '-' : ''}${sort}`,
    'fields[crispr_ko]': 'bf_scaled,fc_clean_qn,source,qc_pass,gene,model',
    'fields[gene]': 'symbol,essentiality_profiles',
    'fields[essentiality_profile]': 'core_fitness_pancan',
    'fields[model]': 'sample,names',
    'fields[sample]': 'tissue,cancer_type',
    'fields[tissue]': 'name',
    'fields[cancer_type]': 'name',
  };
}

export default function fetchCrisprData(params, ...args) {
  const paramsNormalised = {
    'merged': true,
    ...normaliseParams(params),
  };

  const endpoint = datasetEntpoint(params.cancerType);
  return get(endpoint, paramsNormalised, ...args)
    .then(resp => deserialiser.deserialise(resp)
      .then(deserialisedData => ({
        count: resp.meta.count,
        data: deserialisedData.map(dataPoint => ({
          // TODO: Possibly use "fc_clean_qn" downstream instead of mapping it to "fc_clean"
          // Would be more performant
          fc_clean: dataPoint.fc_clean_qn,
          ...dataPoint,
          gene: {
            ...dataPoint.gene,
            // There may be more than 1 fitness dataset
            // we make sure the last one (the one with the highest id) is
            // first
            essentiality_profiles: orderBy(
              dataPoint.gene.essentiality_profiles,
              profile => profile.id,
              'desc',
            ),
          }
        })),
      }))
    );
}
