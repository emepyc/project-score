import identity from "lodash.identity";
import {id2name} from "./utils";

export function expandTissueFilter(tissue) {
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

export function expandGeneFilter(geneId) {
  return {
    name: 'gene',
    op: 'has',
    val: {
      name: 'id',
      op: 'eq',
      val: geneId,
    },
  };
}

export function expandModelFilter(modelId) {
  return {
    name: 'model',
    op: 'has',
    val: {
      name: 'id',
      op: 'eq',
      val: modelId,
    }
  };
}

export function expandSearchFilter(search) {
  return {
        or: [
      {
        name: 'model_name',
        op: 'contains',
        val: search,
      },
      {
        name: 'gene_symbol',
        op: 'contains',
        val: search,
      },
    ]
  }
}

export function expandScoreRangeFilter(scoreRange) {
  return {
    and: [
      {
        name: 'fc_clean',
        op: 'ge',
        val: scoreRange[0],
      },
      {
        name: 'fc_clean',
        op: 'le',
        val: scoreRange[1],
      }
    ],
  };
}

export function combineFilters(filters) {
  return filters.filter(identity);
}
