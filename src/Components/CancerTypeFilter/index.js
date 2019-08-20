import React, {useState, useEffect, useCallback} from 'react';
import Select from 'react-select';
import {withRouter} from 'react-router';

import useUrlParams from '../useUrlParams';
import {fetchCancerTypes} from '../../api';

function CancerTypeFilter(props) {
  const [cancerType, setCancerType] = useState(null);
  const [cancerTypes, setCancerTypes] = useState([]);
  const [urlParams, setUrlParams] = useUrlParams(props);

  const cancerTypeFromUrl = urlParams.cancerType;

  useEffect(() => {
    fetchCancerTypes()
      .then(cancerTypes => {
        setCancerTypes(cancerTypes);
        if(cancerTypeFromUrl) {
          const cancerType = cancerTypes.filter(
            cancerType => cancerTypeFromUrl === `${cancerType.id}`
          )[0];
          setCancerType(cancerType);
        }
      })
  }, []);

  const onInputChange = cancerType => {
    setCancerType(cancerType.id);
  };

  const onChange = value => setUrlParams({cancerType: value ? value.id : ""});

  const getOptionLabel = option => option.name;
  const getOptionValue = option => option.id;

  return (
    <React.Fragment>
      <Select
        value={cancerType}
        options={cancerTypes}
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

export default withRouter(CancerTypeFilter);
