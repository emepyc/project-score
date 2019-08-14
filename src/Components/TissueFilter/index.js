import React, {useState, useEffect, useCallback} from 'react';
import Select from 'react-select';
import {withRouter} from 'react-router';
import useUrlParams from '../useUrlParams';
import {fetchTissues, name2id} from '../../api';

function TissueFilter(props) {
  const [tissue, setTissue] = useState({});
  const [tissues, setTissues] = useState([]);
  const [urlParams, setUrlParams] = useUrlParams(props);

  const tissueFromUrlObject = urlParams.tissue ? {
    tissue: urlParams.tissue,
    id: name2id(urlParams.tissue),
  } : null;

  useEffect(() => {
      fetchTissues()
        .then(resp => {
          setTissues(resp);
        });
    }, []
  );

  const onInputChange = useCallback(newValue => {
    setTissue(newValue)
  }, [tissue]);

  const onChange = value => {
    setUrlParams({
      tissue: value ? value.id : "",
    });
  };

  const getOptionLabel = option => option.tissue;
  const getOptionValue = option => option.tissue;

  return (
    <div>
      <Select
        defaultValue={tissueFromUrlObject}
        options={tissues}
        onChange={onChange}
        placeholder="Select a tissue"
        isClearable
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        onInputChange={onInputChange}
      />
    </div>
  );
}

export default withRouter(TissueFilter);
