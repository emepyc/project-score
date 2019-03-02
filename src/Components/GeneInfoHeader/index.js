import React, {Fragment} from 'react';
import keyBy from 'lodash.keyby';
import {Card, CardHeader, CardBody, CardTitle} from '../Card';
import {Row, Col, Badge} from 'reactstrap';
import PageHeader from '../../Components/PageHeader';

export default function GeneInfoHeader({symbol, names, identifiers}) {
  const geneName = names.filter(name => name.current)[0];
  return (
    <Fragment>
      <Row>
        <Col>
          <PageHeader
            header={symbol}
            subheader={geneName && geneName.name}
          />
        </Col>
        <Col xs={{size: 4}} lg={{size: 2}}>
          <Card>
            <CardHeader>
              <CardTitle>
                External links
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ExternalLinks
                style={{paddingRight: '20px'}}
                identifiers={identifiers}
              />
            </CardBody>
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

