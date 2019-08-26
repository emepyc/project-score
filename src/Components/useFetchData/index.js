import {useState, useEffect} from 'react';

export default function useFetchData(fetchData, deps=[]) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetchData()
      .then(data => {
        setLoading(false);
        setData(data);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      })
  }, deps);

  return [data, loading, error];
}
