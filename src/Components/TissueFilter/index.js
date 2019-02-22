import React, {useState, useEffect, useCallback} from 'react';
import Select from 'react-select';
import qs from 'query-string';
import {withRouter} from 'react-router';
import {fetchTissues} from '../../api';
import {name2id} from '../../api';

function TissueFilter(props) {
  const [tissue, setTissue] = useState({});
  const [tissues, setTissues] = useState([]);
  const {tissue: tissueFromUrl, ...urlParams} = qs.parse(props.location.search);

  const tissueFromUrlObject = tissueFromUrl ? {
    tissue: tissueFromUrl,
    id: name2id(tissueFromUrl),
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
    props.history.push({
      search: `?${qs.stringify({
        ...urlParams,
        tissue: value ? value.id : "",
      })}`,
    })
  };

  const getOptionLabel = option => option.tissue;
  const getOptionValue = option => option.tissue;

  return (
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
  );
}

export default withRouter(TissueFilter);
