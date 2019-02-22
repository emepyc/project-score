import React from 'react';
import Table from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';


function Gene() {
  return (
    <div>
      <TissueFilter />
      <ScoreRangeFilter />
      <Table />
    </div>
  );
}

export default Gene;
