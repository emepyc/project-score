import axios from 'axios';
import qs from 'query-string';


const API_BASEURL = process.env.REACT_APP_API_BASEURL;

function paramsSerializer(params) {
  params.agg = params.agg ? JSON.stringify(params.agg) : undefined;
  params.filter = params.filter ? JSON.stringify(params.filter) : undefined;
  return qs.stringify(params, { depth: 0 });
}

export function post(endpoint, data) {
    return axios.post(
      `${API_BASEURL}/${endpoint}`,
      data,
    );
}

export function get(endpoint, params = {}) {
    return axios.get(
      `${API_BASEURL}/${endpoint}`,
      {
        params,
        paramsSerializer,
      }
    );
}
