import React from 'react';
import {Row, Col} from 'reactstrap';

import PageHeader from '../PageHeader';

export default function ModelInfoHeader({name, symbol, features}) {
  const linkToCellModelPassport = (
    <span>More information in the{' '}
      <a target='_blank' rel='noopener noreferrer' href={`https://cellmodelpassports.sanger.ac.uk/passports/${symbol}`}>
        Cell Model Passport
      </a> site
    </span>
  );
  return (
    <Row>
      <Col xs={{size: 12}} md={{size: 6}} lg={{size: 10}}>
        <PageHeader
          header={name}
          entity='model'
          subheaders={[linkToCellModelPassport]}
          features={features}
        />
      </Col>
    </Row>
  );
}
