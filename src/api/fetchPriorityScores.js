import {get} from './index';

export default async function fetchPriorityScores(params, ...args) {
  const searchParams = {
    cutoff: params.threshold,
  };

  const endpoint = `/priority_scores/${params.analysis}`;

  return await get(endpoint, searchParams, ...args);
}
