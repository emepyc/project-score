import React from 'react';
import {Container} from 'reactstrap';

import HomeSection from '../../Components/HomeSection';
import HomeHeader from '../../Components/HomeHeader';
import TissuesSummary from '../../Components/TissuesSummary';

const Home = () => (
  <Container>
    <HomeSection>
      <HomeHeader className="text-center" />
    </HomeSection>

    <HomeSection>
      <TissuesSummary />
    </HomeSection>
  </Container>
);

export default Home;
