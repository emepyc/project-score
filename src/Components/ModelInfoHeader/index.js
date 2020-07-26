import React from 'react';

import PageHeader from '../PageHeader';

export default function ModelInfoHeader({name, symbol, features}) {
  const linkToCellModelPassport = (
    <span>More genomic and functional information in the{' '}
      <a target='_blank' rel='noopener noreferrer' href={`https://cellmodelpassports.sanger.ac.uk/passports/${symbol}`}>
        Cell Model Passport
      </a> website
    </span>
  );
  return (
    <PageHeader
      header={name}
      entity='model'
      subheader={linkToCellModelPassport}
      features={features}
    />
  );
}
