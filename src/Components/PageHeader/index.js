import React from 'react';
import classnames from 'classnames';
import KnownFeatures from "../KnownFeatures";
import style from './pageHeader.module.scss';

function PageHeader({header, entity, subheader, externalLinks, features = []}) {
  const headerClasses = classnames(style.header, {
    'mt-4': true,
    'mx-3': true,
    'd-flex': true,
    'flex-wrap': true,
  });

  return (
    <div className={headerClasses}>

      <div className='flex-grow-1'>
        <div className={style.description}>
          <h2><span className={style.entity}>{entity}</span> {header}</h2>
        </div>
        <div className={style.features}>
          <KnownFeatures
            features={features}
          />
        </div>
        {subheader && (
          <div
            key={subheader || "1"}
            className={style.subheader}
          >
            {subheader}
          </div>
        )}
      </div>
      <div>
        {externalLinks && (
          <React.Fragment>
            {externalLinks}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
