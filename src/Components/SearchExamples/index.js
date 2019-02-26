import React from "react";
import {Link} from "react-router-dom";
import "./searchExamples.scss";

function SearchExamples() {
  return (
    <div>
      <p className="intro-search-examples">
        Try:
        <Link to={'/gene/SIDG02491'}>BRAF</Link>
        <Link to={'/gene/SIDG26200'}>PTEN</Link>
        <Link to={'/model/SIDM01197'}>SNU-C1</Link>
        <Link to={'/table?tissue=Breast'}>Breast</Link>
        <span style={{marginLeft: '20px'}}>
                Or:<Link to={'/table'}>explore all the data</Link>
              </span>
      </p>
    </div>
  )
}

export default SearchExamples;
