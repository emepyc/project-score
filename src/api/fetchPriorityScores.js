import {get} from './index';
import analyses from "./fetchAnalyses";

export default async function fetchPriorityScores(params, ...args) {
  if (params.analysis !== undefined) {
    return await fetchPriorityScoresForAnalysis(params, ...args);
  } else {
    const analysesResult = await analyses({}, ...args);
    const priorityScoresPromises = analysesResult.map(async analysis => {
      const analysisParams = {
        ...params,
        analysis: analysis.id,
      };
      return await fetchPriorityScoresForAnalysis(analysisParams, ...args);
    })
    return await Promise.all(priorityScoresPromises);
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
