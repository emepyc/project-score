import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchModelInfo} from '../../api';
import useUrlParams from '../useUrlParams';
import Spinner from '../Spinner';
import ModelInfoHeader from '../ModelInfoHeader';

function ModelInfoSummary(props) {
  const [loading, setLoading] = useState(false);
  const [urlParams] = useUrlParams(props);
  const [modelName, setModelName] = useState('');
  const [growthProperties, setGrowProperties] = useState('Unknown');
  const [tissue, setTissue] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchModelInfo(urlParams.modelId)
      .then(modelInfo => {
        setLoading(false);
        setModelName(modelInfo.names[0]);
        setGrowProperties(modelInfo.growthProperties);
        setTissue(modelInfo.tissue);
      });
  }, []);

  return (
    <Spinner loading={loading}>
      <ModelInfoHeader
        name={modelName}
        tissue={tissue}
        symbol={urlParams.modelId}
        features={
          [
            {
              label: growthProperties,
              value: growthProperties !== 'Unknown',
              id: growthProperties,
              text: 'Cell model growth type'
            }
          ]
        }
      />
    </Spinner>
  );
}

export default withRouter(ModelInfoSummary);
