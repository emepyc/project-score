import React from 'react';
import {withRouter} from 'react-router-dom';
import {Card, CardHeader, CardBody} from 'reactstrap';

import {fetchGenePriorityScore} from '../../api';
import useUrlParams from '../useUrlParams';
import FetchData from '../FetchData';

function GenePriorityScore(props) {
  const [{geneId}] = useUrlParams(props);

  return (
    <FetchData
      endpoint={fetchGenePriorityScore}
      params={{geneId}}
      deps={[geneId]}
    >
      {priorityScore => {
        console.log("priority scores here...");
        console.log(priorityScore);
        return (
          <div>
            <Card>
              <CardHeader>
                Priority Scores
              </CardHeader>
              <CardBody>
                Plot goes here
              </CardBody>
            </Card>
          </div>
        )
      }}
    </FetchData>
  );
}

export default withRouter(GenePriorityScore);
