import React, {useState} from 'react';
import {Row, Col, ButtonGroup} from 'reactstrap';
import Table from '../../Components/Table';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import ModelInfoSummary from '../../Components/ModelInfoSummary';
import {Card, CardBody, CardHeader} from 'reactstrap';
import {Button} from "../../Components/Buttom";
import EssentialitiesPlot from "../../Components/EssentialitiesPlot";

function Gene() {
  return (
    <div>
      <ModelInfoSummary/>

      <Row className='my-3'>
        <Col xs={{size: 6, offset: 3}} lg={{size: 3, offset: 9}}>
          <Filters />
        </Col>
      </Row>
      <Row className='my-3'>
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
        Filters
      </CardHeader>
      <CardBody>
        <Row>
          <Col>
            <ScoreRangeFilter/>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

function EssentialitiesSection() {

  const [attributeToPlot, setAttributeToPlot] = useState("fc_clean");

  return (
    <Card>
      <CardHeader>
        Essentiality plot
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
          xAxisLabel="Cell lines"
        />
      </CardBody>
    </Card>
  );
}

function EssentialitiesTable() {
  return (
    <Card>
      <CardHeader>
        Essentiality Table
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
