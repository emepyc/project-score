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

  useEffect(() => {
    setLoading(true);
    fetchModelInfo(urlParams.modelId)
      .then(modelInfo => {
        setLoading(false);
        setModelName(modelInfo.names[0]);
      });
  }, [urlParams.modelId]);

  return (
    <Spinner loading={loading}>
      <ModelInfoHeader
        name={modelName}
        symbol={urlParams.modelId}
      />
    </Spinner>
  );
}

export default withRouter(ModelInfoSummary);
