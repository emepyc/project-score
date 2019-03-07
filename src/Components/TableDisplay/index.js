import React, {Fragment} from 'react';
import {Table} from 'reactstrap';
import {Link, withRouter} from 'react-router-dom';
import qs from 'query-string';
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';
import useUrlParams, {sanitiseParams} from '../useUrlParams';

function TableDisplay(props) {
  const data = props.data;

  const getKeyForRow = (row) => row ? `${row.geneId}-${row.modelName}` : null;

  const [urlParams] = useUrlParams(props);

  const {score, tissue} = urlParams;
  const paramsForGeneLink = qs.stringify(sanitiseParams(pickBy({tissue, score}, identity)));
  const paramsForModelLink = qs.stringify(sanitiseParams(pickBy({score}, identity)));

  const mouseOver = (row) => {
    props.onHighlight(row);
  };

  const mouseOut = () => props.onHighlight(null);

  return (
    <Fragment>
      <Table>
        <thead>
        <tr>
          <th>
            Gene
          </th>
          <th>
            Model
          </th>
          <th>
            Tissue
          </th>
          <th>
            <nobr>
              Corrected log fold change{' '}
            </nobr>
          </th>
          <th>
            <nobr>
              Loss of fitness score{' '}
            </nobr>
          </th>
        </tr>
        </thead>

        <tbody>
          {data.map(row => {
            const key = getKeyForRow(row);
            return (
              <tr
                style={{backgroundColor: (getKeyForRow(props.highlight) === key ? '#eeeeee' : '#ffffff')}}
                key={key}
                onMouseOver={() => mouseOver(row)}
                onMouseOut={mouseOut}
              >
                <td>
                  <Link to={`/gene/${row.geneId}?${paramsForGeneLink}`}>{row.geneSymbol}</Link>
                </td>
                <td style={{whiteSpace: 'nowrap'}}>
                  <Link to={`/model/${row.modelId}?${paramsForModelLink}`}>{row.modelName}</Link>
                </td>
                <td>
                  {row.tissue}
                </td>
                <td>
                  {row.fc_clean}
                </td>
                <td>
                  {row.bf_scaled}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Fragment>
  );
}

export default withRouter(TableDisplay);
