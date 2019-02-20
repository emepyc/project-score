import {get} from './index';
import Deserialiser from 'deserialise-jsonapi';

const deserialiser = new Deserialiser();

const params = {
  include: 'gene,model,model.sample.tissue',
};

export default function fetchCrisprData(fetchParams) {
  const fullParams = {
    ...params,
    ...fetchParams,
  };
  return get('/datasets/crispr_ko', fullParams)
    .then(resp => {
      return deserialiser.deserialise(resp.data)
        .then(deserialisedData => ({
          count: resp.data.meta.count,
          data: deserialisedData,
        }));
    });
}
