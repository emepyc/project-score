import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faBullseye, faClock} from '@fortawesome/free-solid-svg-icons'
import {faClock} from '@fortawesome/free-solid-svg-icons'
import React, {useState, useEffect} from 'react';

import {fetchTissues} from '../../api';
import Spinner from "../Spinner";
import Error from '../Error';
import useFetchData from "../useFetchData";
import PetriDiagram from './petri-diagram.png';
import Organ9 from './organ-9.png';
import Gene from './dna.png';

import './tissuesSummaryDescription.scss';


function TissuesSummaryDescription() {
  const [tissues, loading, error] = useFetchData(
    () => fetchTissues(),
    [],
  );

  const [numberOfCellLines, setNumberOfCellLines] = useState(0);
  const [numberOfTissues, setNumberOfTissues] = useState(0);

  useEffect(() => {
    if (tissues) {
      setNumberOfTissues(tissues.length);
      setNumberOfCellLines(tissues.reduce((acc, curr) => acc + ~~curr.counts, 0))
    }
  }, [tissues]);

  if (error !== null) {
    return (
      <Error
        message="Error loading data"
      />
    )
  }

  return (
    <Spinner loading={loading}>
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
          7,470 fitness genes
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
    </Spinner>
  );
}

export default TissuesSummaryDescription;
