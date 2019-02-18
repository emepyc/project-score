import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Home from './Pages/Home';
import Downloads from './Pages/Downloads';
import Masthead from './Components/Masthead';
import Footer from './Components/Footer';

const App = (props) => (
  <div>
    <Router {...props}>
      <div>
        <Masthead/>

        <main>
          <Route exact path="/" component={Home}/>
          <Route exact path="/downloads" component={Downloads}/>
        </main>

        <Footer />
      </div>
    </Router>
  </div>
);

export default App;
