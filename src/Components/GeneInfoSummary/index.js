import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchGeneInfo} from '../../api';
import useUrlParams from '../useUrlParams';
import GeneInfoHeader from '../GeneInfoHeader';
import Spinner from '../Spinner';


function GeneInfoSummary(props) {
  const [geneNames, setGeneNames] = useState([]);
  const [geneIdentifiers, setGeneIdentifiers] = useState([]);
  const [isTumourSuppressor, setIsTumourSuppressor] = useState(false);
  const [isRibosomal, setIsRibosomal] = useState(false);
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
        setIsTumourSuppressor(geneInfo.isTumourSuppressor);
        setIsProteasome(geneInfo.isProteasome);
        setIsRnaPolymerase(geneInfo.isRnaPolymerase);
        setIsRibosomal(geneInfo.isRibosomal);
        setIsSpliceosome(geneInfo.isSpliceosome);
      });
  }, []);

  return (
    <Spinner loading={loading}>
      <GeneInfoHeader
        identifiers={geneIdentifiers}
        names={geneNames}
        symbol={geneSymbol}
        features={
          [
            {
              label: 'Tumour suppressor',
              value: isTumourSuppressor,
            },
            {
              label: 'Rna polymerase',
              value: isRnaPolymerase,
            },
            {
              label: 'Ribosomal',
              value: isRibosomal,
            },
            {
              label: 'Proteasome',
              value: isProteasome,
            },
            {
              label: 'Spliceosome',
              value: isSpliceosome,
            },
          ]
        }
      />
    </Spinner>
  )
}

export default withRouter(GeneInfoSummary);
