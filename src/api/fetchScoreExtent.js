import {get} from './index';
import {expandTissueFilter} from './utils';
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';

function normaliseParams(params) {
  const tissueFilter = params.tissue ? expandTissueFilter(params.tissue) : null;
  const normalisedParameters = {
    "page[number]": 1,
    "page[size]": 1,
    agg: {
      fc_clean: ['min', 'max'],
    },
    filter: tissueFilter ? [tissueFilter]: [],
  };

  return pickBy(normalisedParameters, identity);
}

export default function fetchScoreExtent(params) {
  const paramsNormalised = normaliseParams(params);
  return get('/datasets/crispr_ko', paramsNormalised)
    .then(resp => resp.data.meta.agg.fc_clean);
}
