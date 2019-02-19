import React from 'react';
import {Container} from 'reactstrap';

import HomeSection from '../../Components/HomeSection';
import HomeHeader from '../../Components/HomeHeader';
import TissuesSummary from '../../Components/TissuesSummary';
import HomeProjectDescription from '../../Components/HomeProjectDescription';
import HomeProgrammeDescription from '../../Components/HomeProgrammeDescription';
import Searchbox from '../../Components/Searchbox';

const Home = () => (
  <Container>
    <HomeSection>
      <HomeHeader className="text-center" />
    </HomeSection>

    <HomeSection>
      <Searchbox />
    </HomeSection>

    <HomeSection>
      <TissuesSummary />
    </HomeSection>

    <HomeSection>
      <HomeProjectDescription />
    </HomeSection>

    <HomeSection>
      <HomeProgrammeDescription />
    </HomeSection>

  </Container>
);

export default Home;
