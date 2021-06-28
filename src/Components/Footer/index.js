import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import OtLogo from './CTI_OT_Primary_Logo_Wht.png';
import HtLogo from './05_HT logo_white.png';
import './footer.scss';

function Footer() {
  const linkStyle = {
    color: 'white'
  };

  return (
    <React.Fragment>
      <Row
        style={{
          paddingLeft: '10%',
          paddingRight: '10%',
          marginTop: '40px',
          backgroundColor: '#469d32',
          color: 'white'
        }}
        className='footer'
      >
        <Col xs={12} lg={3}>
          <div className='footer-header'>
            <b>Project SCORE</b>
          </div>
          <NavLink to='/downloads' style={linkStyle} activeStyle={linkStyle}>
            <div className='footer-item'>Downloads</div>
          </NavLink>
          <NavLink to='/documentation' style={linkStyle} activeStyle={linkStyle}>
            <div className='footer-item'>Documentation</div>
          </NavLink>
          <div className='footer-item'>Version 2.1</div>
          {/*<NavLink to='/changelog' style={linkStyle} activeStyle={linkStyle}>*/}
          {/*  <div className='footer-item'>Change log</div>*/}
          {/*</NavLink>*/}
        </Col>
        <Col xs={12} lg={3}>
          <div className='footer-header'>
            <b>DepMap | Programmes</b>
          </div>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://depmap.sanger.ac.uk/programmes#drugs'
            style={linkStyle}
          >
            <div className='footer-item'>DepMap | Drugs</div>
          </a>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://depmap.sanger.ac.uk/programmes#cmp'
            style={linkStyle}
          >
            <div className='footer-item'>DepMap | Models</div>
          </a>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://depmap.sanger.ac.uk/programmes#analytics'
            style={linkStyle}
          >
            <div className='footer-item'>DepMap | Analytics</div>
          </a>
        </Col>
        <Col xs={12} lg={3}>
          <div className='footer-header'>
            <b>Collaborators</b>
          </div>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.opentargets.org'
            style={linkStyle}
          >
            <div
              className='footer-item'
            >
              {/*Open Targets*/}
              <img src={OtLogo} width={150} alt='OpenTargets'/>
            </div>
          </a>

          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://humantechnopole.it/en/research-groups/iorio-group/'
            style={linkStyle}
          >
            <div className='footer-item'>
              {/* Human Technopole*/}
              <img src={HtLogo} width={150} alt='Human Technopole'/>
            </div>
          </a>

          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.broadinstitute.org/cancer/cancer-dependency-map'
            style={linkStyle}
          >
            <div className='footer-item'>
              Broad Institute Cancer Dependency Map
            </div>
          </a>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://ocg.cancer.gov/programs/HCMI'
            style={linkStyle}
          >
            <div className='footer-item'>Human Cancer Models Initiative</div>
          </a>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.nki.nl/'
            style={linkStyle}
          >
            <div className='footer-item'>Netherlands Cancer Institute</div>
          </a>
        </Col>
        <Col xs={12} lg={3}>
          <div className='footer-header'>
            <b>Contact</b>
          </div>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='mailto:depmap@sanger.ac.uk'
            style={linkStyle}
          >
            <div className='footer-item'>depmap@sanger.ac.uk</div>
          </a>
          <div className='footer-item' style={{ lineHeight: '1em' }}>
            Wellcome Sanger Institute<br />
            Wellcome Genome Campus<br />
            Hinxton, Cambridgeshire<br />
            CB10 1SA, UK<br />
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default Footer;
