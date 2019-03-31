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

export function expandExcludePanCancerGenesFilter() {
  return {
    name: 'gene',
    op: 'has',
    val: {
      name: 'essentiality_profiles',
      op: 'has',
      val: {
        name: 'core_fitness_pancar',
        op: 'eq',
        val: true,
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

export function expandScoreRangeFilter({scoreMin, scoreMax}) {
  const scoreMinFilter = {
    name: 'fc_clean',
    op: 'ge',
    val: scoreMin,
  };

  const scoreMaxFilter = {
    name: 'fc_clean',
    op: 'le',
    val: scoreMax,
  };

  if (scoreMin && scoreMax) {
    return {
      and: [
        scoreMinFilter,
        scoreMaxFilter,
      ]
    }
  }

  if (scoreMin) {
    return scoreMinFilter;
  }

  if (scoreMax) {
    return scoreMaxFilter;
  }
}

export function combineFilters(filters) {
  return filters.filter(identity);
}
