import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchModelInfo} from '../../api';
import useUrlParams from '../useUrlParams';
import ModelInfoHeader from '../ModelInfoHeader';
import FetchData from "../FetchData";

function ModelInfoSummary(props) {
  const [urlParams] = useUrlParams(props);

  return (
    <FetchData
      endpoint={fetchModelInfo}
      params={{modelId: urlParams.modelId}}
      deps={[urlParams.modelId]}
    >
      {modelInfo => (
        <ModelInfoHeader
          name={modelInfo.names[0]}
          symbol={urlParams.modelId}
        />
      )}
    </FetchData>
  );
}

export default withRouter(ModelInfoSummary);
