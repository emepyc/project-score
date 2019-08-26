import {get} from './index';

function analysisResponseToAnalysis(analysisResponse) {
  return {
    name: analysisResponse.attributes.name,
    id: analysisResponse.id,
    count: analysisResponse.relationships.models.data.length,
  }
}

export default function analyses() {
  return get('analyses')
    .then(resp => resp.data.data.map(analysisResponseToAnalysis));
}
