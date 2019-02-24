import {get} from './index';
import {
  expandTissueFilter,
  expandGeneFilter,
  expandModelFilter,
  combineFilters,
} from './filters';

function normaliseParams(params) {
  const tissueFilter = params.tissue ?
    expandTissueFilter(params.tissue) :
    null;

  const geneFilter = params.geneId ?
    expandGeneFilter(params.geneId) :
    null;

  const modelFilter = params.modelId ?
    expandModelFilter(params.modelId) :
    null;

  const filters = combineFilters([
    tissueFilter,
    geneFilter,
    modelFilter,
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
  return get('/datasets/crispr_ko', paramsNormalised)
    .then(resp => resp.data.meta.agg.fc_clean);
}
