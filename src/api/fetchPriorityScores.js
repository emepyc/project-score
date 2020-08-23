import flatMap from 'lodash.flatmap';
import orderBy from 'lodash.orderby';

import {get} from './index';
import analyses from "./fetchAnalyses";

export default async function fetchPriorityScores(params, ...args) {
  if (Boolean(params.analysis)) {
    const priorityScoresForAnalysis = await fetchPriorityScoresForAnalysis(params, ...args);
    return {
      ...priorityScoresForAnalysis,
      data: formatToPriorityScores(priorityScoresForAnalysis),
    }
  } else {
    const analysesResult = await analyses({}, ...args);
    const priorityScoresPromises = analysesResult.map(async analysis => {
      const analysisParams = {
        ...params,
        analysis: analysis.id,
      };
      return await fetchPriorityScoresForAnalysis(analysisParams, ...args);
    })
    const allPriorityScores = await Promise.all(priorityScoresPromises);
    const allPriorityScoresData = flatMap(
      allPriorityScores,
        formatToPriorityScores,
    );
    return {
      analysis: {
        id: null,
        name: 'Combined Analysis'
      },
      data: orderBy(allPriorityScoresData, ['score'], ['desc']),
      weights: allPriorityScores[0].weights,
    };
  }
}

async function fetchPriorityScoresForAnalysis(params, ...args) {
  const searchParams = {
    cutoff: params.threshold,
    weights: JSON.stringify(params.weights),
  };

  const endpoint = `priority_scores/${params.analysis}`;

  return await get(endpoint, searchParams, ...args);
}

function formatToPriorityScores(priorityScores) {
  return priorityScores.data.map(priorityScore => ({
    ...priorityScore,
    analysis: priorityScores.analysis,
  }));
}
