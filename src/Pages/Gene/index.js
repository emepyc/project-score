import React, {useState} from 'react';
import {ButtonGroup, Button} from 'reactstrap';
import Table from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import EssentialitiesPlot from '../../Components/EssentialitiesPlot';
import GeneInfoSummary from '../../Components/GeneInfoSummary';
import TissueHighlight from '../../Components/TissueHighlight';


function Gene() {

  const [tissues, setTissues] = useState([]);
  const [colorBy, setColorBy] = useState("score");
  const onTissuesLoaded = (tissues) => setTissues(tissues);

  return (
    <div>
      <GeneInfoSummary/>
      <TissueFilter />
      <ScoreRangeFilter />
      <EssentialitiesPlot
        onTissuesLoaded={onTissuesLoaded}
        colorBy={colorBy}
        xAxisLabel="Cell lines"
      />
      Color by:
      <ButtonGroup>
        <Button
          active={colorBy === "score"}
          outline={colorBy !== "score"}
          onClick={() => setColorBy("score")}
        >
          Score
        </Button>
        <Button
          active={colorBy === "tissue"}
          outline={colorBy !== "tissue"}
          onClick={() => setColorBy("tissue")}
        >
          Tissue
        </Button>
      </ButtonGroup>
      <TissueHighlight
        tissues={tissues}
        blocks={4}
      />
      <Table />
    </div>
  );
}

export default Gene;
