import {Label, Input} from 'reactstrap';
import React from 'react';
import {withRouter} from 'react-router-dom';
import useUrlParams from '../useUrlParams';

function PanCangerGeneFilter(props) {
  const [urlParams, setUrlParams] = useUrlParams(props);

  const onChange = (ev) => {
    setUrlParams({
      urlParams,
      excludePanCancerGenes: ev.target.checked ? 1 : 0,
    });
  };


  return(
    <div style={{marginLeft: '10px'}}>
      <Label check>
        <Input
          type='checkbox'
          onChange={onChange}
          checked={urlParams.excludePanCancerGenes === '1'}
        />{' '}
        Exclude pan cancer genes
      </Label>
    </div>
  );
}

export default withRouter(PanCangerGeneFilter);
