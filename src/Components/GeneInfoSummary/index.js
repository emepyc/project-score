import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchGeneInfo} from '../../api';
import useUrlParams from '../useUrlParams';
import GeneInfoHeader from '../GeneInfoHeader';
import Spinner from '../Spinner';


function GeneInfoSummary(props) {
  const [geneNames, setGeneNames] = useState([]);
  const [geneIdentifiers, setGeneIdentifiers] = useState([]);
  // const [isTumourSuppressor, setIsTumourSuppressor] = useState(false);
  const [isRibosomal, setIsRibosomal] = useState(false);
  const [isHistone, setIsHistone] = useState(false);
  const [isDnaReplication, setIsDnaReplication] = useState(false);
  const [isProteasome, setIsProteasome] = useState(false);
  const [isRnaPolymerase, setIsRnaPolymerase] = useState(false);
  const [isSpliceosome, setIsSpliceosome] = useState(false);
  const [geneSymbol, setGeneSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlParams] = useUrlParams(props);

  useEffect(() => {
    setLoading(true);
    fetchGeneInfo(urlParams.geneId)
      .then(geneInfo => {
        setLoading(false);
        setGeneIdentifiers(geneInfo.identifiers);
        setGeneNames(geneInfo.names);
        setGeneSymbol(geneInfo.symbol);
        // setIsTumourSuppressor(geneInfo.isTumourSuppressor);
        setIsProteasome(geneInfo.isProteasome);
        setIsHistone(geneInfo.isHistone);
        setIsDnaReplication(geneInfo.isDnaReplication);
        setIsRnaPolymerase(geneInfo.isRnaPolymerase);
        setIsRibosomal(geneInfo.isRibosomal);
        setIsSpliceosome(geneInfo.isSpliceosome);
      });
  }, [urlParams.geneId]);

  return (
    <Spinner loading={loading}>
      <GeneInfoHeader
        identifiers={geneIdentifiers}
        names={geneNames}
        symbol={geneSymbol}
        features={
          [
            // {
            //   label: 'Tumour suppressor',
            //   value: isTumourSuppressor,
            //   id: 'isTumourSuppressor',
            //   text: `${geneSymbol} is ${isTumourSuppressor ? '' : 'not'} a tumour suppressor gene`,
            // },
            {
              label: 'Rna polymerase',
              value: isRnaPolymerase,
              id: 'isRnaPolymerase',
              text: `${geneSymbol} does ${isRnaPolymerase ? '' : 'not'} encode for a RNA polymerase protein`,
            },
            {
              label: 'Ribosomal',
              value: isRibosomal,
              id: 'isRibosomal',
              text: `${geneSymbol} does ${isRibosomal ? '' : 'not'} encode for a ribosomal protein`
            },
            {
              label: 'Histone',
              value: isHistone,
              id: 'isHistone',
              text: `${geneSymbol} does ${isHistone ? '' : 'not'} encode for a histone protein`
            },
            {
              label: 'Dna replication',
              value: isDnaReplication,
              id: 'isDnaReplication',
              text: `${geneSymbol} does ${isDnaReplication ? '' : 'not'} encode for a DNA replication protein`
            },
            {
              label: 'Proteasome',
              value: isProteasome,
              id: 'isProteasome',
              text: `${geneSymbol} does ${isProteasome ? '' : 'not'} encode for a proteasomal protein`
            },
            {
              label: 'Spliceosome',
              value: isSpliceosome,
              id: 'isSpliceosome',
              text: `${geneSymbol} does ${isSpliceosome ? '' : 'not'} encode for a spliceosomal protein`
            },
          ]
        }
      />
    </Spinner>
  )
}

export default withRouter(GeneInfoSummary);
