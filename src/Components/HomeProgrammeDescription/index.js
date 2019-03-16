import React from 'react';

import ModelsProgrammeLogo from './CellLinePassports.255d9066.jpg';
import DrugsProgrammeLogo from './GDSC-right.e86d774c.jpg';
import AnalyticsProgrammeLogo from './Tools1.c01e97ae.jpg';
import FadeIn from '../FadeInAfterVisible';
import './cards.scss';

const TrackedComponent = ({ visibilityClasses, visibilityStyles }) => (
  <div className="container">
    <div className="mt-5 mb-2 row">
      <div className="text-center col">
        <h2 className="display-4">DepMap Programmes at Sanger</h2>
        <p className="lead">
          The Project Score is an integral part of the{' '}
          <a href="http://depmap.sanger.ac.uk">
            Cancer Dependency Map at Sanger
          </a>
        </p>
      </div>
    </div>
    <div className={visibilityClasses} style={visibilityStyles}>
      <div className="mt-5 mb-5 row">
        <div className="animated fadeInUp">
          <div className="p-2 p-md-0 card-deck">
            <div className="mb-2 mb-md-0 models z1 card">
              <img
                width="100%"
                src={ModelsProgrammeLogo}
                alt="Models"
                className="card-img-top"
              />
              <div className="card-body card-body">
                <h5 className="card-title">
                  DepMap <span className="col-mb-2 mb-md-0 models"> | </span>{' '}
                  Models
                </h5>
                <p className="secondary card-text">
                  Cell models and linked datasets
                </p>
              </div>
              <div className="text-right card-footer">
                <a
                  href="http://depmap.sanger.ac.uk/programmes#cmp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="z0 hover btn btn-secondary"
                >
                  View programme
                </a>
              </div>
            </div>
            <div className="mb-2 mb-md-0 drugs z1 card">
              <img
                width="100%"
                src={DrugsProgrammeLogo}
                alt="Drugs"
                className="card-img-top"
              />
              <div className="card-body card-body">
                <h5 className="card-title">
                  DepMap <span className="col-mb-2 mb-md-0 drugs"> | </span>{' '}
                  Drugs
                </h5>
                <p className="secondary card-text">
                  Association of drug response with genetic features in hundreds
                  of cancer cell models
                </p>
              </div>
              <div className="text-right card-footer">
                <a
                  href="http://depmap.sanger.ac.uk/programmes#drugs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="z0 hover btn btn-secondary"
                >
                  View programme
                </a>
              </div>
            </div>
            <div className="mb-2 mb-md-0 analytics z1 card">
              <img
                width="100%"
                src={AnalyticsProgrammeLogo}
                alt="Analytics"
                className="card-img-top"
              />
              <div className="card-body card-body">
                <h5 className="card-title">
                  DepMap <span className="col-mb-2 mb-md-0 analytics"> | </span>{' '}
                  Analytics
                </h5>
                <p className="secondary card-text">
                  Software and tools for analysing DepMap data
                </p>
              </div>
              <div className="text-right card-footer">
                <a
                  href="http://depmap.sanger.ac.uk/programmes#analytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="z0 hover btn btn-secondary"
                >
                  View programme
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const HomeProgrammeDescription = () => (
  <FadeIn action="fadeInUp">
    <TrackedComponent />
  </FadeIn>
);

export default HomeProgrammeDescription;
