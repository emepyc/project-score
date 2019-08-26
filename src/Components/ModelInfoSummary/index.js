import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchModelInfo} from '../../api';
import useUrlParams from '../useUrlParams';
import Spinner from '../Spinner';
import ModelInfoHeader from '../ModelInfoHeader';
import useFetchData from '../useFetchData';
import Error from '../Error';

function ModelInfoSummary(props) {
  const [urlParams] = useUrlParams(props);
  const [modelName, setModelName] = useState(null);
  const [modelInfo, loading, error] = useFetchData(
    () => fetchModelInfo(urlParams.modelId),
    [urlParams.modelId]
  );

  useEffect(() => {
    if (modelInfo !== null) {
      setModelName(modelInfo.names[0]);
    }
  }, [modelInfo]);

  if (error !== null) {
    return (
      <Error
        message="Error loading data"
      />
    )
  }

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
