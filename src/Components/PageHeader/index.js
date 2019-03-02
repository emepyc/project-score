import React from 'react';
import {Row, Col} from 'reactstrap';
import KnownFeatures from "../KnownFeatures";
import style from './pageHeader.module.scss';

function PageHeader({header, subheader, features}) {
  return (
    <div className={style.header}>
      <Row>
        <Col xs={{size: 12}}>
          <div className={style.description}>
            <h2>{header}</h2>
          </div>
          <div className={style.features}>
            <KnownFeatures
              features={features}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={{size: 12}}>
            <div className={style.description}>{subheader}</div>
        </Col>
      </Row>
    </div>
  );
}

export default PageHeader;
