import {get} from './index';

function cancerTypeResponseToCancerType(cancerTypeResponse) {
  return {
    name: cancerTypeResponse.attributes.name,
    id: cancerTypeResponse.id,
    count: cancerTypeResponse.relationships.models.data.length,
  }
}

export default function cancerTypes() {
  return get('analyses')
    .then(resp => resp.data.data.map(cancerTypeResponseToCancerType));
}
