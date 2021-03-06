import qs from 'query-string';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;
const USERNAME = process.env.REACT_APP_API_USERNAME;
const PASSWORD = process.env.REACT_APP_API_PASSWORD;

function paramsSerializer(params) {
  const serialisedParams = {
    ...params,
    agg: params.agg ? JSON.stringify(params.agg) : undefined,
    filter: params.filter ? JSON.stringify(params.filter) : undefined,
  };
  return qs.stringify(serialisedParams, {depth: 0});
}

async function getToken(signal) {
  const response = await fetch(`${API_BASEURL}/login`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    // add signal?
    signal,
    body: JSON.stringify({
      username: USERNAME,
      password: PASSWORD,
    }),
  });
  return await response.json();
}

export async function get(endpoint, params = {}, signal) {
  const serialisedParams = paramsSerializer(params);
  const token = await getToken(signal);
  const result = await fetch(`${API_BASEURL}/${endpoint}?${serialisedParams}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.accessToken}`,
    },
    signal,
  }).catch(err => {
    console.error(err);
  });

  return await result.json();
}
