import React from 'react';
import TableComponent from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import {Row, Col} from 'reactstrap';
import Card from '../../Components/Card';

function Table() {
  return (
    <div>
      <Card>
        <Row>
          <Col>
            <TissueFilter/>
          </Col>
          <Col>
            <ScoreRangeFilter/>
          </Col>
        </Row>
      </Card>
      <Card>
        <TableComponent/>
      </Card>
    </div>
  )
}

export default Table;
