import {useState, useEffect, useCallback, useRef} from 'react';

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

export function useAsyncCallback (endpoint) {
    const [error, setError] = useState();
    const [processing, setProcessing] = useState(false);
    const [data, setData] = useState();

    const asyncCallback = useCallback(input => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        setProcessing(true);
        setError(null);

        endpoint(input, signal)
            .then(data => {
                setProcessing(false);
                console.log('data loaded');
                setData(data);
            })
            .catch(error => {
                if (error.name !== "AbortError") {
                    console.error(error);
                    setProcessing(false);
                    setError(error);
                }
            });

        return () => {
            abortController.abort();
        };
    }, [endpoint]);

    return [asyncCallback, data, processing, error];
}
