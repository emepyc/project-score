import React from 'react';
import style from './knownFeatures.module.scss';

function KnownFeatures(props) {
  return (
    <div>
      {props.features.map(({label, value}) => {
        const className = value ? style.featureActive : style.feature;
        return (
          <span className={className}>
            {label}
          </span>
        );
      })}
    </div>
  );
}

export default KnownFeatures;
