import React, {useState} from 'react';
import TableComponent from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import {Row, Col} from 'reactstrap';
import {Card, CardHeader, CardBody} from 'reactstrap';
import PageHeader from '../../Components/PageHeader';

function Table() {
  return (
    <div>
      <Row className='my-3'>
        <Col xs={{size: 12}} md={{size: 6}} lg={{size: 4}}>
          <PageHeader
            header='Explore all essentialities'
          />
        </Col>
        <Col xs={{size: 12}} md={{size: 6}} lg={{size: 4, offset: 4}}>
          <Filters/>
        </Col>
      </Row>
      <Row>
        <Col>
          <EssentialitiesTable/>
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
  const [highlight, onHighlight] = useState(null);
  return (
    <Card>
      <CardHeader>
        Essentiality Table
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={{size: 12}}>
            <TableComponent
              highlight={highlight}
              onHighlight={onHighlight}
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}