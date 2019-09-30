import {get} from './index';

export default async function fetchPriorityScores(params, ...args) {
  console.log('parasm in fetchPriorityScores...');
  console.log(params);
  const endpoint = `/priority_scores/${params.analysis}`;

  const priorityScores = await get(endpoint, {}, ...args);
  console.log(priorityScores);
  return priorityScores;
}
