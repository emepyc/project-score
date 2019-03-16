import React from 'react';
import {Row, Col} from 'reactstrap';
import HomeSectionDescription from '../HomeSectionDescription';

const HomeProjectDescription = () => (
  <React.Fragment>
    <h2 className="display-4">About us</h2>
    <Row>
      <Col xs={12} sm={6}>
        <HomeSectionDescription>
          We are performing and analysing genome-scale CRISPR-Cas9 screens across a diverse collection of human cancer
          cell models
        </HomeSectionDescription>
      </Col>
      <Col xs={12} sm={6}>
        <HomeSectionDescription>
          We have identified dependencies operative in cancer cells which provides insights into basic cancer biology
          and which can be utilised to develop new and more effective targeted therapies for patients.
        </HomeSectionDescription>
      </Col>
    </Row>
  </React.Fragment>
);

export default HomeProjectDescription;
