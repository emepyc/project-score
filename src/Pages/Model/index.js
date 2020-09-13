import React, {useState} from 'react';
import {Row, Col, ButtonGroup, Tooltip} from 'reactstrap';
import Table from '../../Components/FitnessTable';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import ModelInfoSummary from '../../Components/ModelInfoSummary';
import ModelInfoDetails from '../../Components/ModelInfoDetails';
import {Card, CardBody, CardHeader} from 'reactstrap';
import Button from "../../Components/Button";
import FitnessPlot from "../../Components/FitnessPlot";
import PanCangerGeneFilter from "../../Components/PanCancerGeneFilter";
import {foldChangeHelp, lossOfFitnessScoreHelp} from "../../definitions";

function Model() {
  return (
    <div>
      <ModelInfoSummary/>

      <Row className='my-3'>
        <Col className="my-3" lg={{size: 8}} md={{size: 6}} xs={{size: 12}}>
          <ModelInfoDetails/>
        </Col>
        <Col className="my-3" lg={{size: 4}} md={{size: 6}} xs={{size: 12}}>
          <Filters/>
        </Col>
      </Row>
      <FitnessSection/>
    </div>
  );
}

export default Model;

function Filters() {
  return (
    <Card>
      <CardHeader>
        Filters
      </CardHeader>
      <CardBody>
        <Row>
          <Col>
            <PanCangerGeneFilter/>
          </Col>
          <Col>
            <ScoreRangeFilter/>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

function FitnessSection() {
  const [highlightFitness, setHighlightFitness] = useState(null);
  return (
    <Row>
      <Col className="my-3" xl={{size: 6}} xs={{size: 12}}>
        <FitnessPlotSection
          highlight={highlightFitness}
          onHighlight={setHighlightFitness}
        />
      </Col>
      <Col className="my-3" xl={{size: 6}} xs={{size: 12}}>
        <EssentialitiesTable
          highlight={highlightFitness}
          onHighlight={setHighlightFitness}
        />
      </Col>
    </Row>
  );
}

function FitnessPlotSection(props) {
  const [attributeToPlot, setAttributeToPlot] = useState("bf_scaled");
  const [showLFSTooltip, toggleLFSShowTooltip] = useState(null);
  const [showFCTooltip, toggleFCShowTooltip] = useState(null);

  const toggleLFSTooltip = () => toggleLFSShowTooltip(!showLFSTooltip);
  const toggleFCTooltip = () => toggleFCShowTooltip(!showFCTooltip);

  return (
    <Card>
      <CardHeader>
        Fitness Plot
      </CardHeader>
      <CardBody>
        <Row>
          <Col>
            <div
              style={{marginBottom: '15px'}}
              className='d-flex'
            >
              <ButtonGroup
                className="ml-auto"
              >
                <Button
                  id='foldChangeScoreButton'
                  active={attributeToPlot === "fc_clean"}
                  outline={attributeToPlot !== "fc_clean"}
                  onClick={() => setAttributeToPlot("fc_clean")}
                >
                  Corrected fold change
                </Button>
                <Button
                  id='lossOfFitnessScoreButton'
                  active={attributeToPlot === "bf_scaled"}
                  outline={attributeToPlot !== "bf_scaled"}
                  onClick={() => setAttributeToPlot("bf_scaled")}
                >
                  Loss of fitness score
                </Button>
              </ButtonGroup>
            </div>
            <Tooltip
              target='lossOfFitnessScoreButton'
              placement='bottom'
              isOpen={showLFSTooltip}
              toggle={toggleLFSTooltip}
              innerClassName='project-score-tooltip'
            >
              {lossOfFitnessScoreHelp}
            </Tooltip>
            <Tooltip
              target='foldChangeScoreButton'
              placement='top'
              isOpen={showFCTooltip}
              toggle={toggleFCTooltip}
              innerClassName='project-score-tooltip'
            >
              {foldChangeHelp}
            </Tooltip>

          </Col>
        </Row>
        <FitnessPlot
          colorBy='score'
          attributeToPlot={attributeToPlot}
          xAxisLabel="Genes"
          {...props}
        />
      </CardBody>
    </Card>
  );
}

function EssentialitiesTable({highlight, onHighlight}) {
  return (
    <Card>
      <CardHeader>
        Fitness Table
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={{size: 12}}>
            <Table
              geneSearchable
              highlight={highlight}
              onHighlight={onHighlight}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
