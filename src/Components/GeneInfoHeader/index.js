import React from 'react';
import keyBy from 'lodash.keyby';
import PageHeader from '../PageHeader';
import OtLogo from './OtLogo.png';
import useFetchData from "../useFetchData";
import cancerrxgene from '../../api/cancerrxgene';

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

  return (
    <PageHeader
      {...props}
      header={symbol}
      entity='gene'
      subheader={geneName ? geneName.name : null}
      externalLinks={externalLinks}
    />
  );
}

function LogoExternalLink(props) {
  const {link, resource, ...otherProps} = props;
  return (
    <span {...otherProps} className='mr-2'>
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
    const hgncSymbol = maybeIdentifier(identifiersDict, 'hgnc_symbol');

    return (
      <div className='mt-2 ml-2'>
        {ensemblId && (
          <LogoExternalLink
            resource={<img alt='OpenTargets' src={OtLogo} width={125}/>}
            link={`https://platform.opentargets.org/target/${ensemblId}`}
          />
        )}
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
        {cosmicGeneSymbol && (
          <LogoExternalLink
            resource='Cosmic'
            link={`https://cancer.sanger.ac.uk/cosmic/gene/analysis?ln=${cosmicGeneSymbol}`}
          />
        )}
        {hgncSymbol && (
          <React.Fragment>
            <LogoExternalLink
              resource='Broad DepMap'
              link={`https://depmap.org/portal/gene/${hgncSymbol}?tab=overview`}
            />
            <GDCSLink
              geneId={hgncSymbol}
            />
          </React.Fragment>
        )}
      </div>
    );
  }

  return <div/>;
}

const maybeIdentifier = (identifiers, resource) =>
  identifiers[resource] ?
    identifiers[resource].identifier :
    null;

function GDCSLink({geneId}) {
  const [cancerRxGeneLink] = useFetchData(
    cancerrxgene,
    {
      geneId,
    },
    [geneId],
  );

  return (
    <React.Fragment>
      {cancerRxGeneLink ? (
        <LogoExternalLink
          resource='GDSC'
          link={`${cancerRxGeneLink}/volcano`}
        />
      ) : (
        <span>
            GDSC
        </span>
      )}
    </React.Fragment>
  );
}
