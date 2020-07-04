import React, {Fragment, useState} from 'react';
import {Table, Tooltip} from 'reactstrap';
import {Link, withRouter} from 'react-router-dom';
import qs from 'query-string';
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';
import useUrlParams, {sanitiseParams} from '../useUrlParams';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {foldChangeHelp, lossOfFitnessScoreHelp} from "../../definitions";
import {colorSignificantBg, colorInsignificantBg, colorPanCancerGeneBg} from "../../colors";

function TableDisplay(props) {
  const data = props.data;

  const [showLFSTooltip, toggleShowLFSTooltip] = useState(false);
  const [showFCTooltip, toggleShowFCTooltip] = useState(false);
  const [lofCellTooltip, setLofCellTooltip] = useState(null);
  const [geneCellTooltip, setGeneCellTooltip] = useState(null);

  const toggleLFSTooltip = () => toggleShowLFSTooltip(!showLFSTooltip);
  const toggleFCTooltip = () => toggleShowFCTooltip(!showFCTooltip);

  const getKeyForRow = (row) => row ? `${row.geneId}-${row.modelName}` : null;

  const [urlParams] = useUrlParams(props);

  const {score, analysis} = urlParams;
  const paramsForGeneLink = qs.stringify(sanitiseParams(pickBy({analysis, score}, identity)));
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
          <th style={{whiteSpace: 'nowrap'}}>
            Corrected log fold change<sup id='foldChangeHelp' style={{cursor: 'default'}}>?</sup>{' '}
            <SortArrows {...props} field="fc_clean"/>
          </th>
          <th style={{whiteSpace: 'nowrap'}}>
            Loss of fitness score<sup id='lossOfFitnessScoreHelp' style={{cursor: 'default'}}>?</sup>{' '}
            <SortArrows {...props} field="bf_scaled"/>
          </th>
        </tr>
        </thead>

        <tbody>
        {data.map(row => {
          const key = getKeyForRow(row);
          const scoreBackgroundColor = row.bf_scaled < 0 ? colorSignificantBg : colorInsignificantBg;
          const backgroundColor = keyForHighlightedNode === key ? scoreBackgroundColor : '#FFFFFF';
          return (
            <tr
              style={{backgroundColor}}
              key={key}
              onMouseOver={() => mouseOver(row)}
              onMouseOut={mouseOut}
            >
              <td
                style={{backgroundColor: row.isPanCancer ? colorPanCancerGeneBg : "white"}}
                id={`gene-${key}`}
                onMouseEnter={() => setGeneCellTooltip(`gene-${key}`)}
              >
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
              <td
                style={{backgroundColor: scoreBackgroundColor}}
                id={`lof-${key}`}
                onMouseEnter={() => setLofCellTooltip(`lof-${key}`)}
              >
                {row.bf_scaled}
              </td>
            </tr>
          )
        })}
        </tbody>
      </Table>
      {data.map(row => {
        const key = getKeyForRow(row);
        const lofKey = `lof-${key}`
        const geneKey = `gene-${key}`;

        return (
          <React.Fragment
            key={key}
          >
            {row.isPanCancer && (
              <Tooltip
                target={geneKey}
                placement='top'
                isOpen={geneCellTooltip === geneKey}
                toggle={() => setGeneCellTooltip(null)}
              >
                <div
                  style={{color: colorPanCancerGeneBg}}
                >
                  {row.geneSymbol} is pan cancer gene
                </div>
              </Tooltip>
            )}

            <Tooltip
              target={lofKey}
              placement='top'
              isOpen={lofCellTooltip === lofKey}
              toggle={() => setLofCellTooltip(null)}
            >
              <React.Fragment>
                {row.bf_scaled < 0 ? (
                  <div
                    style={{color: colorSignificantBg}}
                  >
                    Loss of fitness score &lt; 0
                  </div>
                ) : (
                  <div
                    style={{color: colorInsignificantBg}}
                  >
                    Loss of fitness score &gt; 0
                  </div>
                )}
              </React.Fragment>
            </Tooltip>
          </React.Fragment>
        )
      })}
      <Tooltip
        target='lossOfFitnessScoreHelp'
        placement='right'
        isOpen={showLFSTooltip}
        toggle={toggleLFSTooltip}
      >
        {lossOfFitnessScoreHelp}
      </Tooltip>
      <Tooltip
        target='foldChangeHelp'
        placement='right'
        isOpen={showFCTooltip}
        toggle={toggleFCTooltip}
      >
        {foldChangeHelp}
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
