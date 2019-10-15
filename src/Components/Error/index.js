import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export default function ({message="Error"}) {
  return (
    <div className="m-4">
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        fixedWidth
        style={{
          fontSize: '1.2em',
          color: 'red',
          marginRight: '7px',
        }}
      />
      <span>{message}</span>
    </div>
  )
}
