import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import {withRouter} from 'react-router';

import useUrlParams from '../useUrlParams';
import {fetchAnalyses} from '../../api';

function AnalysisFilter(props) {
  const [analysis, setAnalysis] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [urlParams, setUrlParams] = useUrlParams(props);

  const analysisFromUrl = urlParams.analysis;

  useEffect(() => {
    fetchAnalyses()
      .then(analyses => {
        setAnalyses(analyses);
        if(analysisFromUrl) {
          const analysis = analyses.filter(
            analysis => analysisFromUrl === `${analysis.id}`
          )[0];
          setAnalysis(analysis);
        }
      })
  }, []);

  const onInputChange = analysis => {
    setAnalysis(analysis.id);
  };

  const onChange = value => setUrlParams({analysis: value ? value.id : ""});

  const getOptionLabel = option => option.name;
  const getOptionValue = option => option.id;

  return (
    <React.Fragment>
      <Select
        value={analysis}
        options={analyses}
        onChange={onChange}
        placeholder="Select analysis"
        isClearable
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        onInputChange={onInputChange}
      />
    </React.Fragment>
  );
}

export default withRouter(AnalysisFilter);
