import React, {useState} from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import classNames from 'classnames';

import FitnessTable from '../../Components/FitnessTable';
import CancerTypeFilter from '../../Components/AnalysisFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import {Row, Col} from 'reactstrap';
import {Card, CardHeader, CardBody} from 'reactstrap';
import PageHeader from '../../Components/PageHeader';
import PanCancerGeneFilter from "../../Components/PanCancerGeneFilter";
import PriorityScoresSection from "../../Components/PriorityScoresSection";
import useUrlParams from '../../Components/useUrlParams';

import './table.scss';

function Table(props) {
  const [urlParams, setUrlParams] = useUrlParams(props);
  const [activeTab, setActiveTab] = useState(urlParams.dataTab);

  const onTabChange = newTab => {
    setUrlParams({
      ...urlParams,
      dataTab: newTab,
    })
    setActiveTab(newTab);
  }

  const tabToggle = tabName => {
    if (activeTab !== tabName) {
      onTabChange(tabName);
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
            tabIndex={0}
            className={classNames('tabLabel', {active: activeTab === 'fitness'})}
            onClick={() => tabToggle('fitness')}
          >
            Fitness scores
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tabIndex={1}
            className={classNames('tabLabel', {active: activeTab === 'priorityScores'})}
            onClick={() => tabToggle('priorityScores')}
          >
            Target priority scores
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId='fitness'>
          <Row className='my-3'>
            <Col xs={{size: 12}} lg={{size: 10, offset: 2}} xl={{size: 8, offset: 4}}>
              <FitnessFilters/>
            </Col>
          </Row>
          <Row className='my-3'>
            <Col>
              <_FitnessTable/>
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
            <Col>
              <PriorityScoresSection/>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>
  )
}

export default withRouter(Table);

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
        <div className='h-100'>
          <Row className='justify-content-between'>
            <Col className='align-self-center text-center'>
              <PanCancerGeneFilter/>
            </Col>
            <Col className='align-self-center'>
              <CancerTypeFilter/>
            </Col>
            <Col className='align-self-center'>
              <ScoreRangeFilter/>
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  );
}

function _FitnessTable() {
  const [highlight, onHighlight] = useState(null);
  return (
    <Card>
      <CardHeader>
        Fitness score table
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={{size: 12}}>
            <FitnessTable
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
