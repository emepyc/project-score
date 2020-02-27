import React, {Fragment} from 'react';
import {Row, Col} from 'reactstrap';

import HomeSectionDescription from '../HomeSectionDescription';
import FadeIn from '../FadeInAfterVisible';
import DonutChart from '../DonutChart';
import TissuesSummaryDescription from '../TissuesSummaryDescription';
import {PriorityScores, defaultSettings} from "../PriorityScoresSection";

function TissuesSummary() {
  return (
    <Fragment>
      <h2 className="display-4 text-center">Data Overview</h2>
      <Row style={{marginTop: '50px'}}>
        <Col
          md={{size: 12}}
          lg={{size: 6}}
          className='my-auto justify-content-center d-none d-md-block'
        >
          <FadeIn action='fadeInLeft'>
            <DeferredDonutChart/>
          </FadeIn>
        </Col>

        <Col
          md={{size: 12}}
          lg={{size: 6}}
          className='my-auto'
        >
          <FadeIn action='fadeInRight'>
            <DeferredTissuesDescription/>
          </FadeIn>
        </Col>
      </Row>
      <Row style={{width: "100%"}}>
        <FadeIn action='fadeInBottom'>
          <DeferredPriorityScores/>
        </FadeIn>
      </Row>
    </Fragment>
  )
}

const DeferredPriorityScores = ({visibilityClasses, visibilityStyles}) => (
  <div className={visibilityClasses} style={visibilityStyles}>
    <PriorityScores analysis={15} settings={defaultSettings}/>
  </div>
);

const DeferredDonutChart = ({visibilityClasses, visibilityStyles}) => (
  <div
    className={visibilityClasses}
    style={visibilityStyles}
  >
    <DonutChart/>
  </div>
);

const DeferredTissuesDescription = ({visibilityClasses, visibilityStyles}) => (
  <div
    className={visibilityClasses}
    style={visibilityStyles}
  >
    <HomeSectionDescription>
      <TissuesSummaryDescription/>
    </HomeSectionDescription>
  </div>
);

export default TissuesSummary;
