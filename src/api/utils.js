export function name2id(id) {
  return id.split(' ').join('_');
}

export function id2name(name) {
  return name.split('_').join(' ');
}

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

