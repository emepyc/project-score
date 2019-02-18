import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBullseye, faClock} from '@fortawesome/free-solid-svg-icons'
import React, {useState, useEffect} from 'react';

import {fetchTissues} from '../../api';
import PetriDiagram from './petri-diagram.png';
import Organ9 from './organ-9.png';
import Gene from './dna.png';

import './tissuesSummaryDescription.scss';


function TissuesSummaryDescription() {

  const [numberOfCellLines, setNumberOfCellLines] = useState(0);
  const [numberOfTissues, setNumberOfTissues] = useState(0);

  useEffect(() => {
    fetchTissues()
      .then(tissues => {
        setNumberOfTissues(tissues.length);
        setNumberOfCellLines(tissues.reduce((acc, curr) => acc + ~~curr.counts, 0))
      })
  }, []);

  return (
    <div style={{martinTop: '30px'}}>
      <div style={{marginLeft: '5px'}}>
        <span style={{marginRight: '18px'}}>
          <img
            height={'50px'}
            width={'50px'}
            src={PetriDiagram}
            alt="Cell line"
          />
        </span>
        {numberOfCellLines} cell lines
      </div>

      <div style={{marginTop: '12px', marginLeft: '6px'}}>
        <span style={{marginRight: '18px'}}>
          <img
            height={'48px'}
            width={'48px'}
            src={Organ9}
            alt='Organs'
          />
        </span>
        {numberOfTissues} tissues
      </div>

      <div style={{marginLeft: '7px', marginTop: '16px'}}>
        <img
          height={'46px'}
          width={'46px'}
          src={Gene}
          alt='Fitness genes'
        />
        <span style={{marginLeft: '20px'}}>6,830 fitness genes</span>
      </div>

      <div style={{marginTop: '15px'}}>
        <FontAwesomeIcon
          icon={faBullseye}
          fixedWidth
          style={{
            fontSize: '2.7em',
            color: '#0061a5',
            marginRight: '15px'
          }}
        />
        <span style={{verticalAlign: 'super'}}>
          497 unique priority targets
        </span>
      </div>

      <div style={{marginTop: '15px'}}>
        <FontAwesomeIcon
          icon={faClock}
          fixedWidth
          style={{
            fontSize: '2.7em',
            color: '#0061a5',
            marginRight: '15px'
          }}
        />
        <span style={{verticalAlign: 'super'}}>
          Last update: February 2019
        </span>
      </div>

    </div>
  );
}

export default TissuesSummaryDescription;
