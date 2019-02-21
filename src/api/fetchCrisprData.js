import {get} from './index';
import identity from 'lodash.identity';
import pickBy from 'lodash.pickby';
import Deserialiser from 'deserialise-jsonapi';
import {id2name} from "./index";

const deserialiser = new Deserialiser();

function expandTissueFilter(tissue) {
  return {
    name: "model",
    op: "has",
    val: {
      name: "sample",
      op: "has",
      val: {
        name: "tissue",
        op: "has",
        val: {
          name: "name",
          op: "eq",
          val: id2name(tissue),
        }
      }
    }
  };
}

function combineSearchAndFilter(search, filter) {
  if (filter && search) {
    return {
      and: [filter, search]
    };
  }

  return filter || search;
}

function normaliseParams(params) {
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
  } : "";

  const tissueFilter = params.tissue ? expandTissueFilter(params.tissue) : null;

  const searchAndFilterCombined = combineSearchAndFilter(searchFilter, tissueFilter);
  const normalisedParams = {
    "page[number]": params.pageNumber,
    include: "gene,model,model.sample.tissue",
    filter: searchAndFilterCombined ? [searchAndFilterCombined] : [],
    sort: params.sort,
  };

  return pickBy(normalisedParams, identity);
}

export default function fetchCrisprData(fetchParams) {
  const paramsNormalised = normaliseParams(fetchParams);
  return get('/datasets/crispr_ko', paramsNormalised)
    .then(resp => {
      return deserialiser.deserialise(resp.data)
        .then(deserialisedData => ({
          count: resp.data.meta.count,
          data: deserialisedData,
        }));
    });
}
