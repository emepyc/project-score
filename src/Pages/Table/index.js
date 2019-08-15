import React, {useState} from 'react';
import TableComponent from '../../Components/Table';
import CancerTypeFilter from '../../Components/CancerTypeFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import {Row, Col} from 'reactstrap';
import {Card, CardHeader, CardBody} from 'reactstrap';
import PageHeader from '../../Components/PageHeader';
import PanCangerGeneFilter from "../../Components/PanCancerGeneFilter";

function Table() {
  return (
    <div>
      <Row className='my-3'>
        <Col xs={{size: 12}} md={{size: 4}} lg={{size: 4}}>
          <PageHeader
            header='Explore all data'
          />
        </Col>
        <Col xs={{size: 12}} md={{size: 8}} lg={{size: 6, offset: 2}}>
          <Filters/>
        </Col>
      </Row>
      <Row>
        <Col>
          <FitnessTable/>
        </Col>
      </Row>
    </div>
  )
}

export default Table;

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
            <CancerTypeFilter/>
          </Col>
          <Col>
            <ScoreRangeFilter/>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

function FitnessTable() {
  const [highlight, onHighlight] = useState(null);
  return (
    <Card>
      <CardHeader>
        Fitness Table
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={{size: 12}}>
            <TableComponent
              showSearchbox={true}
              highlight={highlight}
              onHighlight={onHighlight}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
