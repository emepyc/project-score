import {get} from './api';

function analysisResponseToAnalysis(analysisResponse) {
  return {
    name: analysisResponse.attributes.name,
    id: analysisResponse.id,
    count: analysisResponse.relationships.models.data.length,
  }
}

export default function analyses(params, ...args) {
  return get('analyses', params, ...args)
    .then(resp => resp.data.map(analysisResponseToAnalysis));
}
