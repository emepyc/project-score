import {get} from './index';
import Deserialiser from 'deserialise-jsonapi';
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

  const sort = params.sort || 'fc_clean';
  const sortDirection = params.sortDirection || 1;

  return {
    'page[number]': params.pageNumber,
    'page[size]': params.pageSize,
    include: "gene,gene.essentiality_profiles,model,model.sample.tissue",
    filter: combinedFilters,
    sort: `${sortDirection === -1 ? '-' : ''}${sort}`,
    'fields[crispr_ko]': 'bf_scaled,fc_clean,gene,model',
    'fields[gene]': 'symbol,essentiality_profiles',
    'fields[essentiality_profile]': 'core_fitness_pancan',
    'fields[model]': 'sample,names',
    'fields[sample]': 'tissue',
    'fields[tissue]': 'name',
  };
}

export default function fetchCrisprData(params) {
  const paramsNormalised = normaliseParams(params);

  const endpoint = datasetEntpoint(params.analysis);

  return get(endpoint, paramsNormalised)
    .then(resp => deserialiser.deserialise(resp.data)
        .then(deserialisedData => ({
            count: resp.data.meta.count,
            data: deserialisedData,
        }))
    );
}
