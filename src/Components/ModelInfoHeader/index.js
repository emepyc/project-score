import React from 'react';
import {Row, Col} from 'reactstrap';

import PageHeader from '../PageHeader';

export default function ModelInfoHeader({name, symbol, tissue, features}) {
  const linkToCellModelPassport = (
    <span>More information in the{' '}
      <a href={`https://cellmodelpassports.sanger.ac.uk/passports/${symbol}`}>
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
          subheaders={[tissue, linkToCellModelPassport]}
          features={features}
        />
      </Col>
    </Row>
  );
}