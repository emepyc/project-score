import {get} from './index';
import Deserialiser from 'deserialise-jsonapi';
import {
  expandTissueFilter,
  expandScoreRangeFilter,
  expandGeneFilter,
  expandModelFilter,
  expandSearchFilter,
  combineFilters,
} from "./filters";

const deserialiser = new Deserialiser();

function normaliseParams(params) {
  const geneFilter = params.geneId ?
    expandGeneFilter(params.geneId) :
    null;

  const modelFilter = params.modelId ?
    expandModelFilter(params.modelId) :
    null;

  const searchFilter = params.search && params.search.length > 2 ?
    expandSearchFilter(params.search) :
    null;

  const scoreRangeFilter = params.scoreRange ?
    expandScoreRangeFilter(params.scoreRange) :
    null;

  const tissueFilter = params.tissue ?
    expandTissueFilter(params.tissue) :
    null;

  const combinedFilters = combineFilters([
    geneFilter,
    modelFilter,
    searchFilter,
    tissueFilter,
    scoreRangeFilter,
  ]);
  return {
    'page[number]': params.pageNumber,
    'page[size]': params.pageSize,
    include: "gene,model,model.sample.tissue",
    filter: combinedFilters,
    sort: params.sort,
  };
}

export default function fetchCrisprData(params) {
  const paramsNormalised = normaliseParams(params);
  return get('/datasets/crispr_ko', paramsNormalised)
    .then(resp => {
      return deserialiser.deserialise(resp.data)
        .then(deserialisedData => ({
          count: resp.data.meta.count,
          data: deserialisedData,
        }));
    });
}
