import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchGeneInfo} from '../../api';
import useUrlParams from '../useUrlParams';
import GeneInfoHeader from '../GeneInfoHeader';
import Spinner from '../Spinner';


function GeneInfoSummary(props) {
  const [geneNames, setGeneNames] = useState([]);
  const [geneIdentifiers, setGeneIdentifiers] = useState([]);
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
      });
    }, []);


  return (
    <Spinner
      loading={loading}
    >
      <div>
        <GeneInfoHeader
          identifiers={geneIdentifiers}
          names={geneNames}
          symbol={geneSymbol}
        />
      </div>
    </Spinner>
  )
}

export default withRouter(GeneInfoSummary);
