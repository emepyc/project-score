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
        <Link to={'/table?tissue=Breast'}>Breast</Link>
        <span className='d-none d-md-inline-block' style={{marginLeft: '20px'}}>
          Or:<Link to={'/table'}>explore all the data</Link>
        </span>
        <div className='d-md-none'>
          Or:<Link to={'/table'}>explore all the data</Link>
        </div>
      </div>
    </div>
  )
}

export default SearchExamples;
