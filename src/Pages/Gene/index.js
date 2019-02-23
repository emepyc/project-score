import React from 'react';
import Table from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import EssentialitiesPlot from '../../Components/EssentialitiesPlot';


function Gene() {
  return (
    <div>
      <TissueFilter />
      <ScoreRangeFilter />
      <EssentialitiesPlot />
      <Table />
    </div>
  );
}

export default Gene;
