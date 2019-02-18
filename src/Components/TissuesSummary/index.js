import React, {Fragment} from 'react';
import {Row, Col} from 'reactstrap';

import HomeSectionDescription from '../HomeSectionDescription';
import FadeIn from '../FadeInAfterVisible';
import DonutChart from '../DonutChart';

// TODO: Avoid duplication of code for each Col in the Row
function TissuesSummary() {
  return (
    <Fragment>
      <h2 className="display-4 text-center">Explore the data</h2>
      <Row>
        <Col
          md={{size: 12}}
          lg={{size: 6}}
          className={'my-auto'}
        >
          <FadeIn action='fadeInLeft'>
            <DeferredDonutChart/>
          </FadeIn>
        </Col>

        <Col
          md={{size: 12}}
          lg={{size: 6}}
          className={'my-auto'}
        >
          <FadeIn action='fadeInRight'>
            <DeferredTissuesDescription/>
          </FadeIn>
        </Col>
      </Row>
    </Fragment>
  )
}

const DeferredDonutChart = ({visibilityClasses, visibilityStyles}) => (
  <div
    className={visibilityClasses}
    style={visibilityStyles}
  >
    <DonutChart />
  </div>
);

const DeferredTissuesDescription = ({visibilityClasses, visibilityStyles}) => (
  <div
    className={visibilityClasses}
    style={visibilityStyles}
  >
    <HomeSectionDescription>
      Hello on right
    </HomeSectionDescription>
  </div>
);

export default TissuesSummary;
