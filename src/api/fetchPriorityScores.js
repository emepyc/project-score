import {get} from './index';

export default async function fetchPriorityScores(params, ...args) {
  const endpoint = `/priority_scores/${params.analysis}`;

  return await get(endpoint, {}, ...args);
}
