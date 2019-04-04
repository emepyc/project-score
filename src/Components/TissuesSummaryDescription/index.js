import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faBullseye, faClock} from '@fortawesome/free-solid-svg-icons'
import {faClock} from '@fortawesome/free-solid-svg-icons'
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
    <div style={{martinTop: '20px'}}>

      <div className="sectionDescription" style={{marginLeft: '5px'}}>
          <img
            height={'48px'}
            width={'48px'}
            src={PetriDiagram}
            alt="Cell line"
          />
        <span style={{marginLeft: '20px'}}>
          {numberOfCellLines} cell lines
        </span>
      </div>

      <div className="sectionDescription" style={{marginLeft: '6px'}}>
        <img
          height={'47px'}
          width={'47px'}
          src={Organ9}
          alt='Organs'
          style={{verticalAlign: 'middle'}}
        />
        <span style={{marginLeft: '20px'}}>
          {numberOfTissues} tissues
        </span>
      </div>

      <div className="sectionDescription" style={{marginLeft: '7px'}}>
        <img
          height={'45px'}
          width={'45px'}
          src={Gene}
          alt='Fitness genes'
          style={{verticalAlign: 'middle'}}
        />
        <span style={{marginLeft: '21px'}}>
          6,830 fitness genes
        </span>
      </div>

      {/*<div className="sectionDescription">*/}
        {/*<FontAwesomeIcon*/}
          {/*icon={faBullseye}*/}
          {/*fixedWidth*/}
          {/*style={{*/}
            {/*fontSize: '2.7em',*/}
            {/*color: '#0061a5',*/}
            {/*marginRight: '15px',*/}
            {/*verticalAlign: 'middle',*/}
          {/*}}*/}
        {/*/>*/}
        {/*<span>*/}
          {/*497 unique priority targets*/}
        {/*</span>*/}
      {/*</div>*/}

      <div className="sectionDescription">
        <FontAwesomeIcon
          icon={faClock}
          fixedWidth
          style={{
            fontSize: '2.7em',
            color: '#0061a5',
            marginRight: '15px',
            verticalAlign: 'middle',
          }}
        />
        <span>
          Last update: April 2019
        </span>
      </div>

    </div>
  );
}

export default TissuesSummaryDescription;
