import React from 'react';

import useFetchData from "../useFetchData";
import Spinner from '../Spinner';
import Error from '../Error';

export default function FetchData(props) {
  const [data, loading, error] = useFetchData(
    props.endpoint,
    props.params,
    props.deps,
  );

  const [dataResponse, setDataResponse] = React.useState(null);

  React.useEffect(() => {
    if (data !== null) {
      setDataResponse(data);
    }
  }, [data]);

  if (error !== null) {
    return (
      <Error
        message='Error loading data'
      />
    )
  }

  return (
    <Spinner loading={loading}>
      {dataResponse ?
        props.children(dataResponse) :
        null
      }
    </Spinner>
  );
}
