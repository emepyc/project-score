import React from 'react';
import { NavLink } from 'react-router-dom';
import cancer_dep_map from './DependencyMapLogo.png';
import Searchbox from '../Searchbox';
import './masthead.scss';
import sangerLogo from './SangerLogo.png';

const Masthead = () => {
  return (
    <nav className="navbar-expand-lg navbar-dark bg-dark navbar">
      <div className="container">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.sanger.ac.uk/"
          className="navbar-brand"
        >
          <img
            src={sangerLogo}
            width="166"
            height="57"
            className="d-inline-block align-top"
            alt=""
          />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://depmap.sanger.ac.uk/"
          className="ml-3 navbar-brand"
        >
          <img
            src={cancer_dep_map}
            alt="Cancer Dependency Map"
            width="201"
            height="57"
            className="d-inline-block align-top"
          />
        </a>
        <div className="ml-md-1 my-auto">
          <header className="navbar-nav">
            <NavLink
              to="/"
              activeClassName="active"
              exact
              className="ml-md-3 nav-item nav-link"
            >
              Home
            </NavLink>
            <NavLink
              to="/downloads"
              activeClassName="active"
              className="ml-md-1 nav-item nav-link"
            >
              Downloads
            </NavLink>
          </header>
        </div>
        <div className="d-none d-lg-inline-block my-auto" style={{width: '250px'}}>
          {window.location.pathname !== '/' && <Searchbox placeholder='Search...'/>}
        </div>
      </div>
    </nav>
  );
};

export default Masthead;
