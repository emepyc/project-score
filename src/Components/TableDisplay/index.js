import React, {Fragment, useState} from 'react';
import {Table, Tooltip} from 'reactstrap';
import {Link, withRouter} from 'react-router-dom';
import qs from 'query-string';
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';
import useUrlParams, {sanitiseParams} from '../useUrlParams';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons';

function TableDisplay(props) {
  const data = props.data;

  const [showTooltip, toggleShowTooltip] = useState(false);

  const toggleTooltip = () => toggleShowTooltip(!showTooltip);

  const getKeyForRow = (row) => row ? `${row.geneId}-${row.modelName}` : null;

  const [urlParams] = useUrlParams(props);

  const {score, tissue} = urlParams;
  const paramsForGeneLink = qs.stringify(sanitiseParams(pickBy({tissue, score}, identity)));
  const paramsForModelLink = qs.stringify(sanitiseParams(pickBy({score}, identity)));

  const mouseOver = (row) => props.onHighlight(row);

  const mouseOut = () => props.onHighlight(null);

  const keyForHighlightedNode = getKeyForRow(props.highlight);

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
              <SortArrows {...props} field="fc_clean" />
            </nobr>
          </th>
          <th>
            <nobr>
              Loss of fitness score<sup id='lossOfFitnessScoreHelp' style={{cursor: 'default'}}>?</sup>{' '}
              <SortArrows {...props} field="bf_scaled" />
            </nobr>
          </th>
        </tr>
        </thead>

        <tbody>
        {data.map(row => {
          const key = getKeyForRow(row);
          const backgroundColor = keyForHighlightedNode === key ? '#eeeeee' : (
            row.bf_scaled < 0 ? '#EFF6EB' : '#FFFFFF'
          );
          return (
            <tr
              style={{backgroundColor: backgroundColor}}
              key={key}
              onMouseOver={() => mouseOver(row)}
              onMouseOut={mouseOut}
            >
              <td>
                <Link to={`/gene/${row.geneId}?${paramsForGeneLink}`}>{row.geneSymbol}</Link>
              </td>
              <td style={{whiteSpace: 'nowrap'}}>
                <Link to={`/model/${row.modelId}?${paramsForModelLink}&scoreMax=0`}>{row.modelName}</Link>
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
            <Tooltip
              target='lossOfFitnessScoreHelp'
              placement='right'
              isOpen={showTooltip}
              toggle={toggleTooltip}
            >
              Based on Bayes Factor value using BAGEL and scaled to a 5% false discovery rate threshold.
            </Tooltip>
    </Fragment>
  );
}

export default withRouter(TableDisplay);


function SortArrows({onSortChange, field, sortDirection, sort}) {
  const setSort = (onSortChange, field) => onSortChange(field);

  const arrowCommonStyle = {
    fontSize: '0.9em',
    cursor: 'pointer',
  };

  const arrowDownStyle =
    field === sort && sortDirection === 1
      ? {
        opacity: 1
      }
      : {
        opacity: 0.3
      };

  const arrowUpStyle =
    field === sort && sortDirection === -1
      ? {
        opacity: 1
      }
      : {
        opacity: 0.3
      };

  return (
    <span onClick={() => setSort(onSortChange, field)}>
        <FontAwesomeIcon
          style={{...arrowDownStyle, ...arrowCommonStyle}}
          icon={faArrowUp}
        />
        <FontAwesomeIcon
          style={{...arrowUpStyle, ...arrowCommonStyle}}
          icon={faArrowDown}
        />
      </span>
  );
}
