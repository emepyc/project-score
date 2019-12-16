import React, {useState} from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classNames from 'classnames';

import TableComponent from '../../Components/Table';
import CancerTypeFilter from '../../Components/AnalysisFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import {Row, Col} from 'reactstrap';
import {Card, CardHeader, CardBody} from 'reactstrap';
import PageHeader from '../../Components/PageHeader';
import PanCangerGeneFilter from "../../Components/PanCancerGeneFilter";
import PriorityScoresSection from "../../Components/PriorityScoresSection";

import './table.scss';

function Table() {
  const [activeTab, setActiveTab] = useState('fitness');

  const tabToggle = tabName => {
    if (activeTab !== tabName) {
      setActiveTab(tabName);
    }
  };

  return (
    <div>
      <Row className='my-3'>
        <Col xs={{size: 12}} md={{size: 4}} lg={{size: 4}}>
          <PageHeader
            header='Explore all data'
          />
        </Col>
      </Row>
      <Nav tabs>
        <NavItem>
          <NavLink
            tabindex={0}
            className={classNames('tabLabel', {active: activeTab === 'fitness'})}
            onClick={() => tabToggle('fitness')}
          >
            Fitness scores
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tabindex={1}
            className={classNames('tabLabel', {active: activeTab === 'priorityScores'})}
            onClick={() => tabToggle('priorityScores')}
          >
            Priority scores
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId='fitness'>
          <Row className='my-3'>
            <Col xs={{size: 12}} lg={{size: 12, offset: 0}} xl={{size: 6, offset: 6}}>
              <FitnessFilters/>
            </Col>
          </Row>
          <Row className='my-3'>
            <Col>
              <FitnessTable/>
            </Col>
          </Row>
        </TabPane>

        <TabPane tabId='priorityScores'>
          <Row className='my-3'>
            <Col xs={{size: 12}} xl={{size: 4, offset: 8}}>
              <PriorityScoresFilters/>
            </Col>
          </Row>
          <Row className='my-3'>
            <PriorityScoresSection/>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  )
}

export default Table;

function PriorityScoresFilters() {
  return (
    <Card>
      <CardHeader>
        Filters
      </CardHeader>
      <CardBody>
        <Row>
          <Col>
            <CancerTypeFilter/>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}

function FitnessFilters() {
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
