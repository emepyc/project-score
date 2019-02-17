import React from 'react';
import './homeSectionDescription.scss';

const HomeSectionDescription = props => (
  <div className={'container'}>
    <div
      className={
        'home-section-description row justify-content-center align-self-center'
      }
    >
      {props.children}
    </div>
  </div>
);

export default HomeSectionDescription;
