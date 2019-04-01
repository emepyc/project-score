import React, {useState} from 'react';
import {Row, Col, ButtonGroup} from 'reactstrap';
import Table from '../../Components/Table';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import ModelInfoSummary from '../../Components/ModelInfoSummary';
import ModelInfoDetails from '../../Components/ModelInfoDetails';
import {Card, CardBody, CardHeader} from 'reactstrap';
import {Button} from "../../Components/Buttom";
import EssentialitiesPlot from "../../Components/EssentialitiesPlot";
import PanCangerGeneFilter from "../../Components/PanCancerGeneFilter";

function Model() {
  return (
    <div>
      <ModelInfoSummary/>

      <Row className='my-3'>
        <Col className="my-3" lg={{size: 8}} md={{size: 6}}  xs={{size: 12}}>
          <ModelInfoDetails/>
        </Col>
        <Col className="my-3" lg={{size: 4}} md={{size: 6}} xs={{size: 12}}>
          <Filters />
        </Col>
      </Row>
      <EssentialitiesSection />
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

function EssentialitiesSection() {
  const [highlightEssentiality, setHighlightEssentiality] = useState(null);
  return (
      <Row>
        <Col className="my-3" xl={{size: 6}} xs={{size: 12}}>
          <EssentialitiesPlotSection
            highlight={highlightEssentiality}
            onHighlight={setHighlightEssentiality}
          />
        </Col>
        <Col className="my-3" xl={{size: 6}} xs={{size: 12}}>
          <EssentialitiesTable
            highlight={highlightEssentiality}
            onHighlight={setHighlightEssentiality}
          />
        </Col>
      </Row>
  );
}

function EssentialitiesPlotSection(props) {
  const [attributeToPlot, setAttributeToPlot] = useState("fc_clean");

  return (
    <Card>
      <CardHeader>
        Fitness plot
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
            </div>
          </Col>
        </Row>
        <EssentialitiesPlot
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
              highlight={highlight}
              onHighlight={onHighlight}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
