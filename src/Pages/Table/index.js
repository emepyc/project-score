import React from 'react';
import TableComponent from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import {Row, Col} from 'reactstrap';
import {Card, CardHeader, CardTitle, CardBody} from '../../Components/Card';
import PageHeader from '../../Components/PageHeader';

function Table() {
  return (
    <div>
      <Row>
        <Col xs={{size: 12}} lg={{size: 2}}>
          <PageHeader
            header='Explore all essentialities'
          />
        </Col>
        <Col xs={{size: 12}} lg={{size: 4, offset: 6}}>
          <Filters />
        </Col>
      </Row>
      <Row>
        <Col>
          <EssentialitiesTable />
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
            <TableComponent/>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}