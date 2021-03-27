import React from 'react';

const homeSection = props => {
  const classNames = [
    'py-5 container-fluid',
    props.customClass || []
  ].join(' ');

  return (
    <div className={classNames} style={props.customStyle}>
      <div className="container">
        <div className="mt-3 mb-2 row">
          <div className="col">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default homeSection;
