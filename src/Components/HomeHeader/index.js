import React from 'react';

import logo from './LS1 colour.svg';
import './homeHeader.scss';
import 'animate.css';

const header = () => {
  return (
    <div className="bg-faded text-center mb-1">
      <div
        className="animated fadeInUp text-center my-5"
      >
        <img src={logo} style={{width: '80%'}} alt="Project Score" />
      </div>
      <p className="lead">Genetic screens to identify cancer dependencies</p>
      <p className="my-2" style={{textAlign: 'center'}}>
        We are using CRISPR-Cas9 whole-genome drop out screens to identify dependencies in cancer cells to help guide
        precision cancer medicines.
      </p>
    </div>
  );
};

export default header;
