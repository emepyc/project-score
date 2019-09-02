import {useState, useEffect} from 'react';

export default function useFetchData(fetchData, params={}, deps=[]) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchData(params, signal)
      .then(data => {
        setLoading(false);
        setData(data);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });

    return abortController.abort;
  }, deps);

  return [data, loading, error];
}
