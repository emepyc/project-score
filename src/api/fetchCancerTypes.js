import Deserialiser from 'deserialise-jsonapi';
import uniqBy from 'lodash.uniqby';
import orderBy from 'lodash.orderby';

import {get} from './index';

const params = {
  include: 'sample.cancer_type',
  'fields[cancer_type]': 'name',
}

const deserialiser = new Deserialiser();

function uniqueCancerTypes(allModels) {
  const cancerTypes = allModels.map(model => ({
    id: model.sample.cancer_type.id,
    name: model.sample.cancer_type.name,
  }));
  return orderBy(
    uniqBy(cancerTypes, cancerType => cancerType.id),
    cancerType => cancerType.name,
  );
}

export default function cancerTypes(_, ...args) {
  return get('models', params, ...args)
    .then(resp => deserialiser.deserialise(resp))
    .then(resp => uniqueCancerTypes(resp));
}
