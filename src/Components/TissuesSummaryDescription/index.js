import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faClock} from '@fortawesome/free-solid-svg-icons'
import React from 'react';

import {fetchTissues} from '../../api';
import FetchData from "../FetchData";
import PetriDiagram from './petri-diagram.png';
import Organ9 from './organ-9.png';
import Gene from './dna.png';

import './tissuesSummaryDescription.scss';


function TissuesSummaryDescription() {
  return (
    <FetchData
      endpoint={fetchTissues}
    >
      {tissues => {
        const numberOfCellLines = tissues.reduce((acc, curr) => acc + ~~curr.counts, 0);
        return (
          <React.Fragment>
            <div className="sectionDescription align-self-center" style={{marginLeft: '5px'}}>
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
                {tissues.length} tissues
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
                Last update: July 2021
              </span>
            </div>
          </React.Fragment>
        );
      }}
    </FetchData>
  );
}

export default TissuesSummaryDescription;
