import React, {useEffect} from 'react';
import ReactGA from "react-ga";
import {BrowserRouter as Router, Route, useLocation, Switch} from 'react-router-dom';

import {backgroundDefaultColor, textDefaultColor} from "./colors";
import Gene from './Pages/Gene';
import Model from './Pages/Model';
import Home from './Pages/Home';
import Downloads from './Pages/Downloads';
import Masthead from './Components/Masthead';
import Footer from './Components/Footer';
import Table from './Pages/Table';
import Documentation from './Pages/Documentation';
import Feedback from './Components/Feedback';

const _App = (props) => {

  // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
  ReactGA.initialize("UA-173268107-1", {
    debug: process.env.NODE_ENV === "development",
    testMode: process.env.NODE_ENV === "test",
    gaOptions: {
      siteSpeedSampleRate: 100,
    },
  });

  if (process.env.REACT_APP_SITE_DOWN === "1") {
    return (
      <div className='m-2'>
        <p>
          The Project Score website is experiencing technical difficulties.
        </p>
        <p>
          We are trying to solve them as soon as possible.
        </p>
        <p>
          Sorry for the inconvenience.
        </p>
      </div>
    )
  }

  return (
    <div>
      <Router {...props}>
        <div>
          <Masthead/>

          <div className="container-fluid pt-2 pb-5"
               style={{
                 backgroundColor: backgroundDefaultColor,
                 color: textDefaultColor,
                 fontSize: '0.9em',
                 fontWeight: 300,
               }}
          >
            <main>
              <App/>
            </main>
          </div>
          <Footer/>
          <Feedback/>
        </div>

      </Router>
    </div>
  );
}

export default _App;

function usePageViews() {
  const location = useLocation();

  useEffect(
    () => {
      ReactGA.pageview(location.pathname + location.search);
    },
    [location]
  );
}

function App() {
  usePageViews();

  return (
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/downloads' component={Downloads}/>
      <Route path='/table' component={Table}/>
      <Route path='/gene/:geneId' component={Gene}/>
      <Route path='/model/:modelId' component={Model}/>
      <Route path='/documentation' component={Documentation}/>
    </Switch>
  );
}
