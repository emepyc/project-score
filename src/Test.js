import React from 'react';
import fetchAnalyses from "./api/fetchAnalyses";
import useFetchData from "./Components/useFetchData";

export default function() {
  const [analyses, loading, error] = useFetchData(
    fetchAnalyses,
  );

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    if (analyses !== null) {
      setData(analyses);
    }
  }, [analyses]);

  console.log(data);

  return (
    <div>
      {data.map(analysis => (
        <div key={analysis.id}>{analysis.name}</div>
      ))}
    </div>
  );
}
