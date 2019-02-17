import React from 'react';
import {Jumbotron} from 'reactstrap';

import Logo from './CRISPR_project_final_logo.png';
import './homeHeader.scss';
import 'animate.css';

const header = () => {
  return (
    <Jumbotron style={{backgroundColor: "white"}} className="text-center mb-1">
      <div
        className="animated fadeInUp text-center"
        style={{ marginTop: '60px', marginBottom: '80px' }}
      >
        <img alt="Project Score logo" src={Logo} />
      </div>
      <p className="lead">Genetic screens to identify cancer dependencies</p>
      <p className="my-2" style={{ textAlign: 'center' }}>
        Project Score uses CRISPR-Cas9 whole genome drop out screening
        technology to identify novel oncology drug targets.
      </p>
    </Jumbotron>
  );
};

export default header;
