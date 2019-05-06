import React, {useState} from 'react';
import Table from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import FitnessPlot from '../../Components/FitnessPlot';
import GeneInfoSummary from '../../Components/GeneInfoSummary';
import TissueHighlight from '../../Components/TissueHighlight';
import {ButtonGroup, Row, Col, Card, CardHeader, CardBody, Tooltip} from 'reactstrap';
import {Button} from '../../Components/Buttom';
import GeneSummaryPlots from '../../Components/GeneSummaryPlots';
import {lossOfFitnessScoreHelp, foldChangeHelp} from "../../definitions";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasErrored: false,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasErrored: true,
    });
  }

  render() {
    if (this.state.hasErrored) {
      return (<div>Error happened</div>);
    }
    return this.props.children;
  }
}

function ErrorBoundaryContent() {
  throw Error("Error raised in Error Boundary Content");
  return (
    <div>
       inside error boundary -- All Ok
    </div>
  );
}

function Gene() {

  return (
    <div>
      <ErrorBoundary>
        <ErrorBoundaryContent />
      </ErrorBoundary>
      <GeneInfoSummary/>
      <Row>
        <Col className="my-3" lg={{size: 8}} xs={{size: 12}}>
          <GeneSummaryPlots/>
        </Col>
        <Col className="my-3" lg={{size: 4}} xs={{size: 12}}>
          <Filters/>
        </Col>
      </Row>
      <FitnessSection />
    </div>
  );
}

export default Gene;

function Filters() {
  return (
    <Card>
      <CardHeader>
        Filters
      </CardHeader>
      <CardBody>
        <Row>
          <Col className="my-3">
            <TissueFilter/>
          </Col>
          <Col className="my-3">
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
          <FitnessTable
            highlight={highlightFitness}
            onHighlight={setHighlightFitness}
          />
        </Col>
      </Row>
  );
}

function FitnessPlotSection(props) {
  const [colorBy, setColorBy] = useState("significance");
  const [attributeToPlot, setAttributeToPlot] = useState("bf_scaled");
  const [highlightTissue, setHighlightTissue] = useState(null);
  const [showLFSTooltip, toggleLFSShowTooltip] = useState(null);
  const [showFCTooltip, toggleFCShowTooltip] = useState(null);

  const toggleLFSTooltip = () => toggleLFSShowTooltip(!showLFSTooltip);
  const toggleFCTooltip = () => toggleFCShowTooltip(!showFCTooltip);

  return (
    <Row className="my-3">
      <Col>
        <Card>
          <CardHeader>
            Fitness Plot
          </CardHeader>
          <CardBody>
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
              placement='right'
              isOpen={showLFSTooltip}
              toggle={toggleLFSTooltip}
            >
              {lossOfFitnessScoreHelp}
            </Tooltip>
            <Tooltip
              target='foldChangeScoreButton'
              placement='right'
              isOpen={showFCTooltip}
              toggle={toggleFCTooltip}
            >
              {foldChangeHelp}
            </Tooltip>
            <FitnessPlot
              colorBy={colorBy}
              attributeToPlot={attributeToPlot}
              xAxisLabel="Cell lines"
              highlightTissue={highlightTissue}
              {...props}
            />
            <Row>
              <Col>
                <div
                  style={{marginBottom: '25px'}}
                  className='d-flex'
                >
                  <ButtonGroup
                    className='ml-auto'
                  >
                    <Button
                      active={colorBy === "significance"}
                      outline={colorBy !== "significance"}
                      onClick={() => setColorBy("significance")}
                    >
                      Colour by significance
                    </Button>
                    <Button
                      active={colorBy === "tissue"}
                      outline={colorBy !== "tissue"}
                      onClick={() => setColorBy("tissue")}
                    >
                      Color by tissue
                    </Button>
                  </ButtonGroup>
                </div>
                {colorBy === "tissue" && (
                  <TissueHighlight
                    blocks={4}
                    onSelectTissue={setHighlightTissue}
                  />
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

function FitnessTable({highlight, onHighlight}) {
  return (
    <Row>
      <Col className="my-3" xs={{size: 12}}>
        <Card>
          <CardHeader>
            Fitness Table
          </CardHeader>
          <CardBody>
            <Table
              highlight={highlight}
              onHighlight={onHighlight}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
