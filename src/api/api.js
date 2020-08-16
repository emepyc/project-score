import qs from 'query-string';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

function paramsSerializer(params) {
  const serialisedParams = {
    ...params,
    agg: params.agg ? JSON.stringify(params.agg) : undefined,
    filter: params.filter ? JSON.stringify(params.filter) : undefined,
  };
  return qs.stringify(serialisedParams, {depth: 0});
}

export async function get(endpoint, params = {}, signal) {
  const serialisedParams = paramsSerializer(params);
  const result = await fetch(`${API_BASEURL}/${endpoint}?${serialisedParams}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  }).catch(err => {
    console.error(err);
  });

  return await result.json();
}
