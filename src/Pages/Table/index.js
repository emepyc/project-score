import React from 'react';
import TableComponent from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import {Row, Col} from 'reactstrap';
import {Card, CardHeader, CardTitle, CardBody} from '../../Components/Card';

function Table() {
  return (
    <div>
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
      <Card>
        <CardHeader>
          <CardTitle>
            Essentialities
          </CardTitle>
        </CardHeader>
        <CardBody>
          <TableComponent/>
        </CardBody>
      </Card>
    </div>
  )
}

export default Table;
