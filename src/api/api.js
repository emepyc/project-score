import axios from 'axios';
import qs from 'query-string';


const API_BASEURL = process.env.REACT_APP_API_BASEURL;
const USERNAME = process.env.REACT_APP_API_USERNAME;
const PASSWORD = process.env.REACT_APP_API_PASSWORD;


function getToken() {
  return axios({
    method: 'POST',
    url: '/login',
    data: {
      username: USERNAME,
      password: PASSWORD,
    },
    headers: {
      'Content-Type': 'application/json'
    },
    baseURL: API_BASEURL,
  });
}

function paramsSerializer(params) {
  params.agg = params.agg ? JSON.stringify(params.agg) : undefined;
  params.filter = params.filter ? JSON.stringify(params.filter) : undefined;
  return qs.stringify(params, { depth: 0 });
}

export function post(endpoint, data) {
  return getToken().then(response => {
    return axios.post(
      `${API_BASEURL}/${endpoint}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${response.data.accessToken}`
        }
      }
    );
  });
}

export function get(endpoint, params = {}) {
  return getToken().then(response => {
    return axios.get(
      `${API_BASEURL}/${endpoint}`,
      {
        params,
        paramsSerializer,
        headers: {
          Authorization: `Bearer ${response.data.accessToken}`
        }
      }
    );
  });
}
