import React, {useState} from 'react';
import Select from 'react-select';
import {withRouter} from 'react-router';

import useUrlParams from '../useUrlParams';
import {fetchAnalyses} from '../../api';
import FetchData from "../FetchData";

function AnalysisFilter(props) {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [urlParams, setUrlParams] = useUrlParams(props);

  const analysisFromUrl = urlParams.analysis;

  const onInputChange = analysis => {
    setSelectedAnalysis(analysis.id);
  };

  const onChange = value => setUrlParams({analysis: value ? value.id : ""});

  const getOptionLabel = option => option.name;
  const getOptionValue = option => option.id;

  return (
    <FetchData
      endpoint={fetchAnalyses}
      params={{}}
      deps={[]}
    >
      {analyses => {
        const analysis = analysisFromUrl ?
          analyses.filter(
            analysis => analysisFromUrl === `${analysis.id}`
          )[0] :
          null;

        return (
          <Select
            value={analysis || selectedAnalysis}
            options={analyses}
            onChange={onChange}
            placeholder="Select analysis"
            isClearable
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
            onInputChange={onInputChange}
          />
        );
      }}
    </FetchData>
  );
}

export default withRouter(AnalysisFilter);
