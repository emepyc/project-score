import {Label, Input} from 'reactstrap';
import React from 'react';
import {withRouter} from 'react-router-dom';
import useUrlParams from '../useUrlParams';
import {colorPanCancerGeneBg} from '../../colors';

function PanCanerGeneFilter(props) {
  const [urlParams, setUrlParams] = useUrlParams(props);

  const onChange = (ev) => {
    setUrlParams({
      ...urlParams,
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
        Exclude{' '}
        <span style={{padding: "0.4em 0.2em", borderRadius: "5px", backgroundColor: colorPanCancerGeneBg}}>
          pan cancer core fitness genes
        </span>
      </Label>
    </div>
  );
}

export default withRouter(PanCanerGeneFilter);
