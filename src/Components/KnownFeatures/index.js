import React, {useState, Fragment} from 'react';
import style from './knownFeatures.module.scss';
import {Tooltip} from 'reactstrap';

function KnownFeatures({features}) {
  const defaultTooltipsState = features.reduce((defaultTooltipsState, feature) => ({
    ...defaultTooltipsState,
    [feature.id]: false,
  }), {});

  const [tooltipsOpenState, setTooltipsOpenState] = useState(defaultTooltipsState);

  const toggleTooltipForFeature = id =>
    setTooltipsOpenState({
      ...tooltipsOpenState,
      [id]: !tooltipsOpenState[id],
    });

  return (
    <Fragment>
      <div>
        {features.map(({label, value, id}) => {
          const className = value ? style.featureActive : style.feature;
          return (
            <span key={id} id={id} className={className}>
              {label}
            </span>
          );
        })}
      </div>
      {features.map(({label, id, text}) => {
        return (
          <Tooltip
            key={id}
            placement='top'
            isOpen={tooltipsOpenState[id]}
            target={id}
            toggle={() => toggleTooltipForFeature(id)}
          >
            {text}
          </Tooltip>
        )
      })}
    </Fragment>
  );
}

export default KnownFeatures;
