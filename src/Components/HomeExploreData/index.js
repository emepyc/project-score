import React from 'react';

import "./homeExploreData.scss";
import {Link} from "react-router-dom";

const HomeExploreData = () => (
  <React.Fragment>
    <h2 className='text-center display-4'>Explore data</h2>
    <div className='dataExploreContainer'>
      <div className='dataExploreItem'>
        <Link to={'/table'}>
          <div
            className='dataExploreSection'
          >
            Fitness scores
          </div>
        </Link>
      </div>
      <div className='dataExploreItem'>
        <Link to={'/table?dataTab=priorityScores'}>
          <div
            className='dataExploreSection'
          >
            Target priority scores
          </div>
        </Link>
      </div>
    </div>
  </React.Fragment>
);

export default HomeExploreData;
