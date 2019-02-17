import React from 'react';
import {Container} from 'reactstrap';

import HomeSection from '../../Components/HomeSection';
import HomeHeader from '../../Components/HomeHeader';

const Home = () => (
  <Container>
    <HomeSection>
      <HomeHeader className="text-center" />
    </HomeSection>
  </Container>
);

export default Home;
