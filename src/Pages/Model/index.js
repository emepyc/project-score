import React from 'react';
import Table from '../../Components/Table';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';


function Gene() {
  return (
    <div>
      <ScoreRangeFilter />
      <Table />
    </div>
  );
}

export default Gene;
