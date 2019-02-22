import React from 'react';
import _Table from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';

function Table() {
  return (
    <div>
      <TissueFilter />
      <ScoreRangeFilter />
      <_Table />
    </div>
  )
}

export default Table;
