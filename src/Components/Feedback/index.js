import React from 'react';

import './feedback.scss';

export default function Feedback() {
  return (
    <div
      className='feedback'
    >
      <a target='_blank' rel='noreferrer noopener' href='mailto:depmap@sanger.ac.uk?Subject=Project Score feedback'>
        <div>
          Feedback
        </div>
      </a>
    </div>
  );
}
