import React, {Fragment} from 'react';
import keyBy from 'lodash.keyby';
import UniprotLogo from './UniprotLogo.gif';
import EnsemblLogo from './EnsemblLogo.jpg';
import OpenTargetsLogo from './OpenTargetsLogo.png';
import CosmicLogo from './cosmicLogo.png';

export default function GeneInfoHeader({symbol, names, identifiers}) {
  const geneName = names.filter(name => name.current)[0];
  return (
    <Fragment>
      <ExternalLinks
        identifiers={identifiers}
      />
      <h2>{symbol}</h2>
      <div>{geneName && geneName.name}</div>
    </Fragment>
  );
}

function LogoExternalLink(props) {
  const { src, link, width } = props;
  return (
    <span style={{ marginRight: '15px' }}>
      <a target="_blank" href={link}>
        <img src={src} width={width} />
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
      <div style={{ float: 'right' }}>
        <span style={{ marginRight: '10px', verticalAlign: 'middle' }}>
          Link to:{' '}
        </span>
        <LogoExternalLink
          src={UniprotLogo}
          link={`http://www.uniprot.org/uniprot/${uniprotId}`}
          width="80"
        />
        <LogoExternalLink
          src={EnsemblLogo}
          link={`http://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${ensemblId}`}
          width="40"
        />
        <LogoExternalLink
          src={OpenTargetsLogo}
          link={`https://www.targetvalidation.org/target/${ensemblId}/associations`}
          width="50"
        />
        <LogoExternalLink
          src={CosmicLogo}
          link={`https://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=${cosmicGeneSymbol}`}
          width="40"
        />
      </div>
    );
  }
  return <div />;
}

