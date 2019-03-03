import React from 'react';
import {Row, Col} from 'reactstrap';
import classnames from 'classnames';
import KnownFeatures from "../KnownFeatures";
import style from './pageHeader.module.scss';

function PageHeader({header, entity, subheaders=[], features=[]}) {
  const headerClasses = classnames(style.header, {
    'my-4': true,
    'ml-3': true,
  });

  return (
    <div className={headerClasses}>
      <Row>
        <Col xs={{size: 12}}>
          <div className={style.description}>
            <h2><span className={style.entity}>{entity}</span> {header}</h2>
          </div>
          <div className={style.features}>
            <KnownFeatures
              features={features}
            />
          </div>
        </Col>
      </Row>
      {subheaders.map(subheader => {
        return (
          <div
            key={subheader || "1"}
            className={style.subheader}
          >
            {subheader}
          </div>
        )
      })}
    </div>
  );
}

export default PageHeader;
