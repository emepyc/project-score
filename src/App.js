import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './Pages/Home';
import Downloads from './Pages/Downloads';

const App = (props) => (
  <Router {...props}>
    <div>
      <main>
        <Route exact path="/" component={Home}/>
        <Route exact path="/downloads" component={Downloads}/>
      </main>
    </div>
  </Router>
);

export default App;
