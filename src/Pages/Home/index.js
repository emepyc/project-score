import React from 'react';

import HomeSection from '../../Components/HomeSection';
import HomeHeader from '../../Components/HomeHeader';
import TissuesSummary from '../../Components/TissuesSummary';
import HomeProjectDescription from '../../Components/HomeProjectDescription';
import HomeProgrammeDescription from '../../Components/HomeProgrammeDescription';
import Searchbox from '../../Components/Searchbox';
import SearchExamples from '../../Components/SearchExamples';
import HomeExploreData from '../../Components/HomeExploreData';
import './home.scss';

const Home = () => (
  <div>
    <div className='backdrop container-fluid row col no-gutters'>
      <HomeSection>
        <HomeHeader className='text-center'/>
        <div className='mt-5'>
          <Searchbox/>
        </div>
        <SearchExamples/>
      </HomeSection>
    </div>

    <HomeSection>
      <HomeExploreData/>
    </HomeSection>

    <HomeSection>
      <TissuesSummary/>
    </HomeSection>

    <HomeSection>
      <HomeProjectDescription/>
    </HomeSection>

    <HomeSection>
      <HomeProgrammeDescription/>
    </HomeSection>

  </div>
);

export default Home;
