import React from 'react';

export default function HasAttribute({attribute}) {
  const fontSize = attribute ? '1.2rem' : '1rem';
  const color = attribute ? 'white' : 'grey';
  const backgroundColor = attribute ? '#5ba633' : 'white';
  const borderColor = '#5ba633';
  const attributeLabel = attribute ? 'Yes' : 'No';
  const attributeElement = attribute ? (
    <b>{attributeLabel}</b>
  ) : (
    attributeLabel
  );

  return (
    <div
      className='container d-flex'
      style={{
        width: '80px',
        height: '80px',
        border: `2px solid ${borderColor}`,
        marginTop: '10px',
        borderRadius: '50px',
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
  );
}
