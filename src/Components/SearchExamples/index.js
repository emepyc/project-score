import React from "react";
import {Link} from "react-router-dom";
import "./searchExamples.scss";

function SearchExamples() {
  return (
    <div>
      <div className="intro-search-examples">
        Try:
        <Link to={'/gene/SIDG02491'}>BRAF</Link>
        <Link className='d-none d-md-inline-block' to={'/gene/SIDG26200'}>PTEN</Link>
        <Link to={'/model/SIDM01197?scoreMax=0'}>SNU&#8209;C1</Link>
        <Link to={'/table?analysis=2'}>Breast carcinoma</Link>
        <span className='d-none d-md-inline-block mx-sm-1'>
          <span className='mx-sm-1'>
            Or:<Link to={'/table'}>explore fitness score data</Link>
          </span>
          <span className='mx-sm-1'>
            Or:<Link to={'/table?dataTab=priorityScores'}>explore priority scores data</Link>
          </span>
        </span>
        <div className='d-md-none'>
          <span>
            Or:<Link to={'/table'}>explore fitness score data</Link>
          </span>
        </div>
        <div className='d-md-none'>
          <span>
            Or:<Link to={'/table?dataTab=priorityScores'}>explore priority scores data</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default SearchExamples;
