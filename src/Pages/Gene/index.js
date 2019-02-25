import React from 'react';
import Table from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import EssentialitiesPlot from '../../Components/EssentialitiesPlot';
import GeneInfoSummary from "../../Components/GeneInfoSummary";


function Gene() {
  return (
    <div>
      <GeneInfoSummary/>
      <TissueFilter />
      <ScoreRangeFilter />
      <EssentialitiesPlot />
      <Table />
    </div>
  );
}

export default Gene;
