import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Gene from './Pages/Gene';
import Model from './Pages/Model';
import Home from './Pages/Home';
import Downloads from './Pages/Downloads';
import Masthead from './Components/Masthead';
import Footer from './Components/Footer';
import Table from './Pages/Table';

const App = (props) => (
  <div>
    <Router {...props}>
      <div>
        <Masthead/>

        <div className="container-fluid pt-2 pb-5" style={{backgroundColor: '#fdfffd', color: '#5A5F5F', fontSize: '0.9em', fontWeight: 300}}>
          <main>
            <Route exact path='/' component={Home}/>
            <Route exact path='/downloads' component={Downloads}/>
            <Route path='/table' component={Table}/>
            <Route path='/gene/:geneId' component={Gene}/>
            <Route path='/model/:modelId' component={Model}/>
          </main>
        </div>
        <Footer/>
      </div>

    </Router>
  </div>
);

export default App;
