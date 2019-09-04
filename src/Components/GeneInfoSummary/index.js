import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchGeneInfo} from '../../api';
import useUrlParams from '../useUrlParams';
import GeneInfoHeader from '../GeneInfoHeader';
import FetchData from "../FetchData";


function GeneInfoSummary(props) {
  const [urlParams] = useUrlParams(props);
  return (
    <FetchData
      endpoint={fetchGeneInfo}
      params={{geneId: urlParams.geneId}}
      deps={[urlParams.geneId]}
    >
      {geneInfo => {
        return (
          <GeneInfoHeader
            identifiers={geneInfo.identifiers}
            names={geneInfo.names}
            symbol={geneInfo.symbol}
            features={
              [
                {
                  label: 'Rna polymerase',
                  value: geneInfo.isRnaPolymerase,
                  id: 'isRnaPolymerase',
                  text: `${geneInfo.symbol} does ${geneInfo.isRnaPolymerase ? '' : 'not'} encode for a RNA polymerase protein`,
                },
                {
                  label: 'Ribosomal',
                  value: geneInfo.isRibosomal,
                  id: 'isRibosomal',
                  text: `${geneInfo.symbol} does ${geneInfo.isRibosomal ? '' : 'not'} encode for a ribosomal protein`
                },
                {
                  label: 'Histone',
                  value: geneInfo.isHistone,
                  id: 'isHistone',
                  text: `${geneInfo.symbol} does ${geneInfo.isHistone ? '' : 'not'} encode for a histone protein`
                },
                {
                  label: 'Dna replication',
                  value: geneInfo.isDnaReplication,
                  id: 'isDnaReplication',
                  text: `${geneInfo.symbol} does ${geneInfo.isDnaReplication ? '' : 'not'} encode for a DNA replication protein`
                },
                {
                  label: 'Proteasome',
                  value: geneInfo.isProteasome,
                  id: 'isProteasome',
                  text: `${geneInfo.symbol} does ${geneInfo.isProteasome ? '' : 'not'} encode for a proteasomal protein`
                },
                {
                  label: 'Spliceosome',
                  value: geneInfo.isSpliceosome,
                  id: 'isSpliceosome',
                  text: `${geneInfo.symbol} does ${geneInfo.isSpliceosome ? '' : 'not'} encode for a spliceosomal protein`
                },
              ]
            }
          />
        );
      }}
    </FetchData>
  )
}

export default withRouter(GeneInfoSummary);
