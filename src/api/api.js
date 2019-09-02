import qs from 'query-string';

const API_BASEURL = process.env.REACT_APP_API_BASEURL;

function paramsSerializer(params) {
  params.agg = params.agg ? JSON.stringify(params.agg) : undefined;
  params.filter = params.filter ? JSON.stringify(params.filter) : undefined;
  return qs.stringify(params, {depth: 0});
}

export async function get(endpoint, params = {}) {
  const abortController = new AbortController();
  const signal = abortController.signal;

  const serialisedParams = paramsSerializer(params);
  const result = await fetch(`${API_BASEURL}/${endpoint}?${serialisedParams}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  return await result.json();
}

export async function getCancel(endpoint, params = {}, signal) {
  console.log("signal... ", signal);
  const serialisedParams = paramsSerializer(params);
  const result = await fetch(`${API_BASEURL}/${endpoint}?${serialisedParams}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  });

  return await result.json();
}
