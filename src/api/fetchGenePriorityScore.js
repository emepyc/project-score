import findIndex from 'lodash.findindex';
import pick from 'lodash.pick';

import {get} from './index';
import Deserialiser from 'deserialise-jsonapi';
import fetchAnalysisPriorityScores from "./fetchAnalysisPriorityScores";

const deserialiser = new Deserialiser();


export default async function fetchGenePriorityScore({geneId}, ...args) {
  const params = {
    include: 'l0,l1.analysis,l2.analysis',
  };

  return get(`genes/${geneId}`, params, ...args)
    .then(resp => deserialiser.deserialise(resp))
    .then(priorityScores => {
      const l1ScoresByAnalysis = getL1ScoresByAnalysis(priorityScores);

      const l2ScoresByAnalysis = getL2ScoresByAnalysis(priorityScores);

      const analysesIds = priorityScores.l1.map(l1PriorityScore => l1PriorityScore.analysis.id);

      const analysesPromises = analysesIds.map(analysisId => fetchAnalysisPriorityScores({
        analysisId,
        cutoff: 1,
      }, ...args));

      return Promise.all(analysesPromises)
        .then(results => {
          return results.map(result => {
            const analysis = result.analysis.name;
            const analysisId = result.analysis.id;
            const rank = getGeneRank(result.data, geneId);
            return {
              analysis,
              analysisId,
              rank,
              l1Scores: l1ScoresByAnalysis[analysis],
              l2Scores: l2ScoresByAnalysis[analysis],
            };
          });
        });
    });
}

function getL1ScoresByAnalysis(priorityScores) {
  const l1 = priorityScores.l1;
  return l1.reduce((l1Scores, currentPriorityScore) => ({
    ...l1Scores,
    ...getL1Score(currentPriorityScore),
  }), {});
}

function getL1Score(priorityScore) {
  return {
    [priorityScore.analysis.name]: {
      classA: priorityScore.class_a,
      classB: priorityScore.class_b,
      classC: priorityScore.class_c,
      weakerMarker: priorityScore.weaker_marker,
      mutatedPrimaryTumour: priorityScore.mutprimtum,
    },
  };
}

function getL2ScoresByAnalysis(priorityScores) {
  const l2 = priorityScores.l2;
  return l2.reduce((l2Scores, currentPriorityScore) => {
    const analysisName = currentPriorityScore.analysis.name;
    const {
      fold1_sbf: fold1Sbf,
      fold2_sbf: fold2Sbf,
      fold3_sbf: fold3Sbf,
      mgk_5perc_fdr: mgk5percFdr,
      mgk_10perc_fdr: mgk10percFdr,
      mut,
      dep_pathway: depPathway,
    } = pick(
      currentPriorityScore,
      ['fold1_sbf', 'fold2_sbf', 'fold3_sbf', 'mgk_5perc_fdr', 'mgk_10perc_fdr', 'mut', 'dep_pathway'],
    );

    return {
      ...l2Scores,
      [analysisName]: {
        fold1Sbf: addScore(l2Scores[analysisName], "fold1Sbf", fold1Sbf),
        fold2Sbf: addScore(l2Scores[analysisName], "fold2Sbf", fold2Sbf),
        fold3Sbf: addScore(l2Scores[analysisName], "fold3Sbf", fold3Sbf),
        mgk5percFdr: addScore(l2Scores[analysisName], "mgk5percFdr", mgk5percFdr),
        mgk10percFdr: addScore(l2Scores[analysisName], "mgk10percFdr", mgk10percFdr),
        mut: addScore(l2Scores[analysisName], "mut", mut),
        depPathway: addScore(l2Scores[analysisName], "depPathway", depPathway),
      },
    };
  }, {});
}

function addScore(scoresForAnalysis, category, score) {
  if (scoresForAnalysis) {
    const currentNumberOfTrues = scoresForAnalysis[category].true || 0;
    return {
      total: scoresForAnalysis[category].total += 1,
      true: score === true ? currentNumberOfTrues + 1 : currentNumberOfTrues,
    }
  }
  return {
    total: 1,
    true: score === true ? 1 : 0,
  };
}

function getGeneRank(priorityScores, geneId) {
  return findIndex(priorityScores, priorityScore => priorityScore.gene_id === geneId) + 1;
}
