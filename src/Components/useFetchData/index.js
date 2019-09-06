import {useState, useEffect, useRef} from 'react';

export default function useFetchData(fetchData, params={}, deps=[]) {
  const isCancelled = useRef(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      isCancelled.current = true;
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading(true);
    isCancelled.current = false;

    fetchData(params, signal)
      .then(data => {
        if (isCancelled.current === false) {
          setLoading(false);
          setData(data);
        }
      })
      .catch(error => {
        if (error.name !== "AbortError") {
          setLoading(false);
          setError(error);
        }
      });

    return () => {
      abortController.abort();
    }
  }, deps);

  return [data, loading, error];
}
