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
          Fitness scores are a quantitative measure of the reduction of cell viability elicited by a
          gene inactivation, via CRISPR-Cas9
          targeting. This is based on Bayes Factor value computed using BAGEL starting from CRISPRcleanR corrected
          gene
          depletion fold changes, and scaled to a 5% false discovery rate threshold (from classifying reference
          essential/non-essential genes based on BF rankings)
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
          Target priority scores are a quantitative assessment of the potential of each gene as a candidate cancer therapeutic target. It
              is computed by an analytical framework that combines CRISPR knockout gene fitness effects with
              biomarker and patient data to output a target priority score from 0 – 100 (highest to lowest)
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
