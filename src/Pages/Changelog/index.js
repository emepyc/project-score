import React from 'react';
import {Container} from 'reactstrap';

import './changelog.scss';

export default function Changelog() {
  return (
    <Container>
      <h2 className='mb-4 mt-4'>
        Change log
      </h2>
      <div className='version'>
        <h3>
          Version 2.1
        </h3>

        <div className='version-section'>
          <h5>Data</h5>
          <ul>
            <li>
              Broad and Sanger Institute data merges
            </li>
          </ul>
        </div>

        <div className='version-section'>
          <h5>Website</h5>
          <ul>
            <li>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              New <a href=''>Changelog page</a>
            </li>
            <li>
              Plot in home page shows number of cancer types instead of analyses.
            </li>
            <li>
              New cancer type column in Fitness table.
            </li>
            <li>
              Fitness scores filters are now based on cancer types instead of analysis (priority lists).
            </li>
            <li>
              Updated documentation to reflect merged Broad and Sanger data.
            </li>
          </ul>
        </div>

      </div>
    </Container>
  );
}
