import React from 'react';

import {Link} from 'react-router-dom';
import targetLogo from './targetLogo.png';

const HomeExploreData = () => (
  <React.Fragment>
    <h2 className='text-center display-4'>Explore data</h2>
    <div className='my-5 d-flex flex-row justify-content-center text-justify flex-wrap'>
      <div className='mx-4 flex-grow-1' style={{'flexBasis': 0}}>
        <img src={targetLogo} width={50} style={{float: 'left', margin: '0 10px'}}/>
        <h5>Fitness scores</h5>
        <div>
          Investigate the effect on cell line viability elicited by CRISPR-Cas9 mediated gene activation.
        </div>
        <div className='my-2 font-weight-bold'>
          <Link to='/table'>
            Explore fitness scores
          </Link>
        </div>
      </div>

      <div className='mx-4 flex-grow-1' style={{'flexBasis': 0}}>
        <img src={targetLogo} width={50} style={{float: 'left', margin: '0 10px'}}/>
        <h5>Target priority scores</h5>
        <div>
          Investigate candidate therapeutic target in different cancer types.
        </div>
        <div className='my-2 font-weight-bold'>
          <Link to='/table?dataTab=priorityScores'>
            Explore target priority scores
          </Link>
        </div>
      </div>
    </div>
  </React.Fragment>
);

export default HomeExploreData;
