import identity from "lodash.identity";

export function expandExcludePanCancerGenesFilter() {
  return {
    name: 'gene',
    op: 'has',
    val: {
      name: 'essentiality_profiles',
      op: 'any',
      val: {
        and: [{
          name: 'core_fitness_pancan',
          op: 'eq',
          val: false,
        }, {
          name: 'source',
          op: 'eq',
          val: 'Merged',
        }]
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
  // There is no way to filter by partial model_name, so until that is implemented in the API
  // we just search for partial matches in the gene symbol
  // return {
  //   or: [
  //     {
  //       name: 'model_name',
  //       op: 'contains',
  //       val: search,
  //     },
  //     {
  //       name: 'gene_symbol',
  //       op: 'contains',
  //       val: search,
  //     },
  //   ]
  // }
  return {
    name: "gene",
    op: "has",
    val: {
      name: "symbol",
      op: "contains",
      val: search,
    }
  };
}

export function expandScoreRangeFilter({scoreMin, scoreMax}) {
  const scoreMinFilter = {
    name: 'fc_clean_qn',
    op: 'ge',
    val: scoreMin,
  };

  const scoreMaxFilter = {
    name: 'fc_clean_qn',
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

export function datasetEntpoint(cancerType) {
  const analysisEndpoint = cancerType ?
    `cancer_types/${cancerType}` :
    '';
  return `${analysisEndpoint}/datasets/crispr_ko`;
}
