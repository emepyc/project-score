import React, {useState, useEffect, useCallback} from 'react';
import Select from 'react-select';
import {withRouter} from 'react-router';
import useUrlParams from '../useUrlParams';
import {fetchTissues, name2id} from '../../api';
import Error from '../Error';
import Spinner from '../Spinner';
import useFetchData from "../useFetchData";

function TissueFilter(props) {
  const [urlParams, setUrlParams] = useUrlParams(props);

  const [tissuesResponse, loading, error] = useFetchData(
    () => fetchTissues(),
    [],
  );

  const [tissue, setTissue] = useState({});
  const [tissues, setTissues] = useState([]);

  const tissueFromUrlObject = urlParams.tissue ? {
    tissue: urlParams.tissue,
    id: name2id(urlParams.tissue),
  } : null;

  useEffect(() => {
    if (tissuesResponse) {
      setTissues(tissuesResponse);
    }
  }, [tissuesResponse]);

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

  if (error !== null) {
    return (
      <Error
        message="Error loading data"
      />
    )
  }

  return (
    <Spinner>
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
    </Spinner>
  );
}

export default withRouter(TissueFilter);
