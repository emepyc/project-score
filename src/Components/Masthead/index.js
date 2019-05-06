import React, {useState} from 'react';
import {NavLink, Route} from 'react-router-dom';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import cancerDepMap from './DependencyMapLogo.png';
import Searchbox from '../Searchbox';
import sangerLogo from './SangerLogo.png';

import './masthead.scss';

const NavigationExpanded = () => (
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
    <NavLink
      to="/documentation"
      activeClassName="active"
      exact
      className="ml-md-3 nav-item nav-link"
    >
      Documentation
    </NavLink>
  </header>
);

const NavigationContractedLink = ({path, text}) => (
  <Route render={({history}) => (
    <span onClick={() => history.push(path)}>
      {text}
    </span>
  )}/>
);

const NavigationContracted = () => {
  const [dropdownOpen, toggleDropdown] = useState(false);

  const toggle = () => toggleDropdown(!dropdownOpen);

  return (
    <header className="navbar-nav light">
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          tag='span'
          onClick={toggle}
          data-toggle='dropdown'
          aria-expanded={dropdownOpen}
        >
          Menu
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>
            <NavigationContractedLink path='/' text='Home'/>
          </DropdownItem>
          <DropdownItem>
            <NavigationContractedLink path='/downloads' text='Downloads'/>
          </DropdownItem>
          <DropdownItem>
            <NavigationContractedLink path='/documentation' text='Documentation'/>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </header>
  );
};

const Masthead = () => {
  const menuStyle = {
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

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
        <span className='d-none d-md-inline-block'>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://depmap.sanger.ac.uk/"
            className="ml-3 navbar-brand"
          >
            <img
              src={cancerDepMap}
              alt="Cancer Dependency Map"
              width="201"
              height="57"
              className="d-inline-block align-top"
            />
          </a>
        </span>
        <div className='ml-md-1 my-auto d-none d-lg-block'>
          <NavigationExpanded/>
        </div>
        <div style={menuStyle} className='ml-md-1 my-auto d-lg-none d-inline'>
          <NavigationContracted/>
        </div>
        <div className="d-none d-lg-inline-block my-auto" style={{width: '250px'}}>
          {window.location.pathname !== '/' && <Searchbox placeholder='Search...'/>}
        </div>
      </div>
    </nav>
  );
};

export default Masthead;
