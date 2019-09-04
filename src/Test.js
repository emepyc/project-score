import React from 'react';
import fetchAnalyses from "./api/fetchAnalyses";
import FetchData from "./Components/FetchData";

export default function () {
  return (
    <FetchData
      endpoint={fetchAnalyses}
    >
      {data => (
        <div>
          {data.map(analysis => (
            <div key={analysis.id}>{analysis.name}</div>
          ))}
        </div>
      )}
    </FetchData>
  )
}
