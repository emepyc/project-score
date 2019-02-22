import React from 'react';
import {withRouter} from 'react-router-dom';

function Gene(props) {
  const geneId = props.match.params.id;

  return (
    <div>
    </div>
  );
}

export default withRouter(Gene);
