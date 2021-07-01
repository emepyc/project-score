import {get} from './api';
import orderBy from "lodash.orderby";

export default function fetchNumberOfModels(geneId, ...args) {
  const fetchParams = {
    'fields[essentiality_profile]': 'model_count',
  };
  return get(`/genes/${geneId}/essentiality_profiles`, fetchParams, ...args)
    .then(resp => {
      const essentiality_profile_sorted = orderBy(
        resp.data,
        profile => profile.id,
        'desc',
      );
      return essentiality_profile_sorted[0].attributes.model_count;
    });
}
