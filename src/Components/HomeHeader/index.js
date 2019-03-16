import React from 'react';

import Logo from './CRISPR_project_final_logo.png';
import './homeHeader.scss';
import 'animate.css';

const header = () => {
  return (
    <div className="bg-faded text-center mb-1">
      <div
        className="animated fadeInUp text-center"
        style={{marginTop: '60px', marginBottom: '80px'}}
      >
        <img alt="Project Score logo" src={Logo}/>
      </div>
      <p className="lead">Genetic screens to identify cancer dependencies</p>
      <p className="my-2" style={{textAlign: 'center'}}>
        Project Score uses CRISPR-Cas9 whole-genome drop out screens to identify dependencies in cancer cells to help
        guide development of precision cancer medicines.
      </p>
    </div>
  );
};

export default header;
