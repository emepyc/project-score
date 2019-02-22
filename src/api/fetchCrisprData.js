import {get} from './index';
import identity from 'lodash.identity';
import pickBy from 'lodash.pickby';
import Deserialiser from 'deserialise-jsonapi';
import {expandTissueFilter, expandScoreRangeFilter} from "./utils";

const deserialiser = new Deserialiser();

const combineFilters = filters => filters.filter(identity);

function normaliseParams(params) {
  const geneFilter = params.geneId ? {
    name: 'gene',
    op: 'has',
    val: {
      name: 'id',
      op: 'eq',
      val: params.geneId,
    },
  } : null;

  const modelFilter = params.modelId ? {
    name: 'model',
    op: 'has',
    val: {
      name: 'id',
      op: 'eq',
      val: params.modelId,
    },
  } : null;

  const searchFilter = params.search.length > 2 ? {
    or: [
      {
        name: 'model_name',
        op: 'contains',
        val: params.search,
      },
      {
        name: 'gene_symbol',
        op: 'contains',
        val: params.search,
      },
    ]
  } : null;

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
  const normalisedParams = {
    "page[number]": params.pageNumber,
    include: "gene,model,model.sample.tissue",
    filter: combinedFilters,
    sort: params.sort,
  };

  return pickBy(normalisedParams, identity);
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
