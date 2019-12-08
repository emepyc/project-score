import {get} from './api';

export default function fetchAnalysisPriorityScores({analysisId, cutoff}, ...args) {
  const params = cutoff ? {cutoff} : {};
  return get(`analyses/${analysisId}/priority_scores`, params, ...args);
}
