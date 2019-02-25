import React, {Fragment} from 'react';

export default function IsPanCancerEssential({isPanCancer}) {
  const fontSize = isPanCancer ? '1.2rem' : '1rem';
  const color = isPanCancer ? 'white' : 'grey';
  const backgroundColor = isPanCancer ? '#5ba633' : 'white';
  const panCancerLabel = isPanCancer ? 'Yes' : 'No';
  const panCancerElement = isPanCancer ? (
    <b>{panCancerLabel}</b>
  ) : (
    panCancerLabel
  );

  return (
    <Fragment>
      <div className='text-center'>
        Pan-cancer core fitness
      </div>
      <div
        className='container d-flex'
        style={{
          width: '70px',
          height: '70px',
          border: '2px solid #5ba633',
          marginTop: '10px',
          borderRadius: '10px',
          color,
          backgroundColor
        }}
      >
        <div
          className='row align-self-center mx-auto'
          style={{
            fontSize
          }}
        >
          {panCancerElement}
        </div>
      </div>
    </Fragment>
  );
}
