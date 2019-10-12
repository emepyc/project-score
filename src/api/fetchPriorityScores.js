import {get} from './index';

export default async function fetchPriorityScores(params, ...args) {
  const searchParams = {
    cutoff: params.threshold,
    weights: JSON.stringify(params.weights),
  };

  const endpoint = `/priority_scores/${params.analysis}`;

  return await get(endpoint, searchParams, ...args);
}
