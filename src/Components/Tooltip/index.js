import React from 'react';

export default function Tooltip({x, y, width, height, hideGuide, ...props}) {
  return (
    <React.Fragment>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '3px',
          boxShadow: 'gray 0px 1px 2px',
          padding: '0.3rem 0.5rem',
          pointerEvents: 'none',
          position: 'absolute',
          whiteSpace: 'nowrap',
          zIndex: 100,
          left: `${x}px`,
          top: `${y}px`,
          display: 'block',
        }}
      >
        {props.children}
      </div>
      <div
        style={{
          border: '1px solid #EEEEEE',
          width: '0.5px',
          height: height,
          position: 'absolute',
          pointerEvents: 'none',
          top: 0,
          left: x,
          display: hideGuide ? 'none': 'block',
        }}
      />
      <div
        style={{
          border: '1px solid #EEEEEE',
          width: width,
          height: '0.5px',
          position: 'absolute',
          pointerEvents: 'none',
          top: y,
          left: 0,
          display: hideGuide ? 'none': 'block',
        }}
      />
    </React.Fragment>
  );
}
