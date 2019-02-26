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
  const [attributeToPlot, setAttributeToPlot] = useState("fc_clean");
  const onTissuesLoaded = (tissues) => setTissues(tissues);

  return (
    <div>
      <GeneInfoSummary/>
      <TissueFilter />
      <ScoreRangeFilter />
      <ButtonGroup>
        <Button
          active={attributeToPlot === "fc_clean"}
          outline={attributeToPlot !== "fc_clean"}
          onClick={() => setAttributeToPlot("fc_clean")}
        >
          Corrected log fold change
        </Button>
        <Button
          active={attributeToPlot === "bf_scaled"}
          outline={attributeToPlot !== "bf_scaled"}
          onClick={() => setAttributeToPlot("bf_scaled")}
        >
          Loss of fitness score
        </Button>
      </ButtonGroup>
      <EssentialitiesPlot
        onTissuesLoaded={onTissuesLoaded}
        colorBy={colorBy}
        attributeToPlot={attributeToPlot}
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
