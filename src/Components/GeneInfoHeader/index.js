import React from 'react';
import keyBy from 'lodash.keyby';
import {Row, Col} from 'reactstrap';
import PageHeader from '../PageHeader';

export default function GeneInfoHeader({symbol, names, identifiers, features}) {
  const geneName = names.filter(name => name.current)[0];

  const externalLinks = (
    <span>External links: <ExternalLinks
      identifiers={identifiers}
    /></span>
  );

  const subheaders = geneName && geneName.name ? [geneName.name, externalLinks]: [externalLinks];

  return (
    <Row>
      <Col>
        <PageHeader
          header={symbol}
          entity='gene'
          subheaders={subheaders}
          features={features}
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
    const cosmicGeneSymbol = identifiersDict.cosmic_gene_symbol.identifier;
    const ensemblId = identifiersDict.ensembl_gene_id.identifier;
    const uniprotId = identifiersDict.uniprot_id.identifier;

    return (
      <div>
        <LogoExternalLink
          resource='Uniprot'
          link={`http://www.uniprot.org/uniprot/${uniprotId}`}
        />
        <LogoExternalLink
          resource='Ensembl'
          link={`http://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${ensemblId}`}
        />
        <LogoExternalLink
          resource='OpenTargets'
          link={`https://www.targetvalidation.org/target/${ensemblId}/associations`}
        />
        <LogoExternalLink
          resource='Cosmic'
          link={`https://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=${cosmicGeneSymbol}`}
        />
      </div>
    );
  }

  return <div/>;
}

