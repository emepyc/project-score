import React from 'react';
import keyBy from 'lodash.keyby';
import {Row, Col} from 'reactstrap';
import PageHeader from '../PageHeader';

const maybeIdentifier = (identifiers, resource) =>
  identifiers[resource] ?
    identifiers[resource].identifier :
    null;

export default function GeneInfoHeader(props) {
  const {symbol, names, identifiers} = props;
  const geneName = names.filter(name => name.current)[0];

  const externalLinks = (
    <span>External links:
      <ExternalLinks
        identifiers={identifiers}
      />
    </span>
  );

  const subheaders = geneName && geneName.name ? [geneName.name, externalLinks]: [externalLinks];

  return (
    <Row>
      <Col>
        <PageHeader
          {...props}
          header={symbol}
          entity='gene'
          subheaders={subheaders}
        />
      </Col>
    </Row>
  );
}

function LogoExternalLink(props) {
  const {link, resource} = props;
  return (
    <span className='mr-2'>
      <a target="_blank" rel="noopener noreferrer" href={link}>
        {resource}
      </a>
    </span>
  );
}

function ExternalLinks({identifiers}) {
  if (identifiers.length) {
    const identifiersDict = keyBy(identifiers, identifier => identifier.source.name);
    const cosmicGeneSymbol = maybeIdentifier(identifiersDict, 'cosmic_gene_symbol');
    const ensemblId = maybeIdentifier(identifiersDict, 'ensembl_gene_id');
    const uniprotId = maybeIdentifier(identifiersDict, 'uniprot_id');

    return (
      <div>
        {uniprotId && (
          <LogoExternalLink
            resource='Uniprot'
            link={`http://www.uniprot.org/uniprot/${uniprotId}`}
          />
        )}
        {ensemblId && (
          <LogoExternalLink
            resource='Ensembl'
            link={`http://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${ensemblId}`}
          />
        )}
        {ensemblId && (
          <LogoExternalLink
            resource='OpenTargets'
            link={`https://www.targetvalidation.org/target/${ensemblId}`}
          />
        )}
        {cosmicGeneSymbol && (
          <LogoExternalLink
            resource='Cosmic'
            link={`https://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=${cosmicGeneSymbol}`}
          />
        )}
      </div>
    );
  }

  return <div/>;
}

