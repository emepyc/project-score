import {get} from './index';
import {
  expandGeneFilter,
  expandModelFilter,
  combineFilters, expandExcludePanCancerGenesFilter,
  datasetEntpoint,
} from './filters';

function normaliseParams(params) {
  const excludePanCancerGenes = +params.excludePanCancerGenes ?
    expandExcludePanCancerGenesFilter() :
    null;

  const geneFilter = params.geneId ?
    expandGeneFilter(params.geneId) :
    null;

  const modelFilter = params.modelId ?
    expandModelFilter(params.modelId) :
    null;

  const filters = combineFilters([
    geneFilter,
    modelFilter,
    excludePanCancerGenes,
  ]);

  return {
    "page[number]": 1,
    "page[size]": 1,
    agg: {
      fc_clean: ['min', 'max'],
    },
    filter: filters,
  };
}

export default function fetchScoreExtent(params) {
  const paramsNormalised = normaliseParams(params);

  const endpoint = datasetEntpoint(params.analysis);

  return get(endpoint, paramsNormalised)
    .then(resp => resp.meta.agg.fc_clean);
}
