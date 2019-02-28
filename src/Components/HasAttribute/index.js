import React, {Fragment} from 'react';

export default function HasAttribute({attribute, title}) {
  const fontSize = attribute ? '1.2rem' : '1rem';
  const color = attribute ? 'white' : 'grey';
  const backgroundColor = attribute ? '#5ba633' : 'white';
  const attributeLabel = attribute ? 'Yes' : 'No';
  const attributeElement = attribute ? (
    <b>{attributeLabel}</b>
  ) : (
    attributeLabel
  );

  return (
    <Fragment>
      <div className='text-center'>
        {title}
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
          {attributeElement}
        </div>
      </div>
    </Fragment>
  );
}
