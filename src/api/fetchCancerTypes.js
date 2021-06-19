import orderBy from 'lodash.orderby';

import {get} from './index';

function cancerTypesResponseToCancerTypes(cancerTypesResponse) {
  return {
    name: cancerTypesResponse.attributes.name,
    id: cancerTypesResponse.id,
    count: cancerTypesResponse.relationships.models.data.length,
  }
}

export default function cancerTypes(params, ...args) {
  return get('cancer_types', params, ...args)
    .then(resp => orderBy(
      resp.data
        .map(cancerTypesResponseToCancerTypes)
        .filter(cancerType => cancerType.id !== 15),
      cancerType => cancerType.name,
    ));
}
