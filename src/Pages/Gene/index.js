import React, {useState} from 'react';
import {ButtonGroup} from 'reactstrap';
import Table from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import EssentialitiesPlot from '../../Components/EssentialitiesPlot';
import GeneInfoSummary from '../../Components/GeneInfoSummary';
import TissueHighlight from '../../Components/TissueHighlight';
import {Row, Col} from 'reactstrap';
import {Card, CardHeader, CardBody, CardTitle} from '../../Components/Card';
import {Button} from '../../Components/Buttom';
import GeneSummaryPlots from '../../Components/GeneSummaryPlots';

function Gene() {

  return (
    <div>
      <GeneInfoSummary/>
      <Row>
        <Col lg={{size: 8}} xs={{size: 12}}>
          <GeneSummaryPlots/>
        </Col>
        <Col lg={{size: 4}} xs={{size: 12}}>
          <Filters/>
        </Col>
      </Row>

      <Row>
        <Col xl={{size: 6}} xs={{size: 12}}>
          <EssentialitiesSection/>
        </Col>
        <Col xl={{size: 6}} xs={{size: 12}}>
          <EssentialitiesTable/>
        </Col>
      </Row>
    </div>
  );
}

export default Gene;

function Filters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Filters
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col>
            <TissueFilter/>
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

  const [colorBy, setColorBy] = useState("score");
  const [attributeToPlot, setAttributeToPlot] = useState("fc_clean");

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Essentiality plot
        </CardTitle>
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
          colorBy={colorBy}
          attributeToPlot={attributeToPlot}
          xAxisLabel="Cell lines"
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
                  active={colorBy === "score"}
                  outline={colorBy !== "score"}
                  onClick={() => setColorBy("score")}
                >
                  Color by score
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
              />
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

function EssentialitiesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Essentiality Table
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={{size: 12}}>
            <Table/>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}