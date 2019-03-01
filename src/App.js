import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Gene from './Pages/Gene';
import Home from './Pages/Home';
import Downloads from './Pages/Downloads';
import Masthead from './Components/Masthead';
import Footer from './Components/Footer';
import Table from './Pages/Table';

const App = (props) => (
  <div style={{backgroundColor: '#FAFAFA', color: '#5A5F5F', fontSize: '0.85em'}}>
    <Router {...props}>
      <div>
        <Masthead/>

        <div
          style={{marginLeft: '50px', marginRight: '50px'}}
        >
          <main>
            <Route exact path='/' component={Home}/>
            <Route exact path='/downloads' component={Downloads}/>
            <Route path='/table' component={Table}/>
            <Route path='/gene/:geneId' component={Gene}/>
            <Route path='/model/:modelId' component={Gene}/>
          </main>
        </div>
        <Footer/>
      </div>
    </Router>
  </div>
);

export default App;
