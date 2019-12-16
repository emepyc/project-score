import React from 'react';
import {Button as BButton} from 'reactstrap';

export default function Button(props) {
  return (
    <BButton
      {...props}
      style={{
        fontSize: '0.9em',
        padding: '0.5em',
      }}
    >
      {props.children}
    </BButton>
  )
}
