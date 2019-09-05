import pickBy from 'lodash.pickby';
import {get} from './index';
import {id2name} from './utils';

export default function tissues(_, ...args) {
  const params = {
    'page[size]': 1,
    agg: {
      'sample.tissue.name': 'count'
    },
    filter: [
      {
        name: 'crispr_ko_available',
        op: 'eq',
        val: 'true'
      }
    ],
  };

  return get('models', params, ...args)
    .then(resp => resp.meta.agg['sample.tissue.name'].count)
    .then(data => {
      const tissuesWithData = pickBy(data, (count) => {
        return count > 0;
      });
      return tissuesToArray(tissuesWithData);
    });
}

function tissuesToArray(tissues) {
  return Object.keys(tissues).map(tissue => {
    return {
      tissue: tissue,
      id: id2name(tissue),
      counts: tissues[tissue],
    };
  });
}
