import React, {Fragment} from 'react';
import keyBy from 'lodash.keyby';
import UniprotLogo from './UniprotLogo.gif';
import EnsemblLogo from './EnsemblLogo.jpg';
import OpenTargetsLogo from './OpenTargetsLogo.png';
import CosmicLogo from './cosmicLogo.png';
import Card from '../Card';
import {Row, Col, Badge} from 'reactstrap';

import style from './geneInfoHeader.module.scss';

export default function GeneInfoHeader({symbol, names, identifiers}) {
  const geneName = names.filter(name => name.current)[0];
  return (
    <Fragment>
      <Row>
        <Col>
            <div className={style.geneHeader}>
              <h2>{symbol}</h2>
              <div>{geneName && geneName.name}</div>
            </div>
        </Col>
        <Col xs={{size: 4}} lg={{size: 2}}>
          <Card>
            <ExternalLinks
              style={{paddingRight: '20px'}}
              identifiers={identifiers}
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

function LogoExternalLink(props) {
  const {link, resource} = props;
  return (
    <Badge color='light'>
      <a target="_blank" rel="noopener noreferrer" href={link}>
        {resource}
      </a>
    </Badge>
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
        <span>
          <div>External links:</div>
        </span>
        <LogoExternalLink
          resource='Uniprot'
          src={UniprotLogo}
          link={`http://www.uniprot.org/uniprot/${uniprotId}`}
          width="80"
        />
        <LogoExternalLink
          resource='Ensembl'
          src={EnsemblLogo}
          link={`http://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${ensemblId}`}
          width="40"
        />
        <LogoExternalLink
          resource='OpenTargets'
          src={OpenTargetsLogo}
          link={`https://www.targetvalidation.org/target/${ensemblId}/associations`}
          width="50"
        />
        <LogoExternalLink
          resource='Cosmic'
          src={CosmicLogo}
          link={`https://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=${cosmicGeneSymbol}`}
          width="40"
        />
      </div>
    );
  }

  return <div/>;
}

