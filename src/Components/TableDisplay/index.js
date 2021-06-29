import React, {Fragment, useState} from 'react';
import {Table, Tooltip} from 'reactstrap';
import {Link, withRouter} from 'react-router-dom';
import qs from 'query-string';
import pickBy from 'lodash.pickby';
import identity from 'lodash.identity';
import useUrlParams, {sanitiseParams} from '../useUrlParams';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {foldChangeHelp, lossOfFitnessScoreHelp, fitnessScoreSourceHelp} from '../../definitions';
import {colorSignificantBg, colorInsignificantBg, colorPanCancerGeneBg} from '../../colors';
import sangerLogo from './SangerInstituteLogo.png';

function TableDisplay(props) {
  const data = props.data;
  const showSource = props.showSource;

  const [showLFSTooltip, toggleShowLFSTooltip] = useState(false);
  const [showFCTooltip, toggleShowFCTooltip] = useState(false);
  const [lofCellTooltip, setLofCellTooltip] = useState(null);
  const [geneCellTooltip, setGeneCellTooltip] = useState(null);
  const [showSourceTooltip, toggleShowSourceTooltip] = useState(false);

  const toggleLFSTooltip = () => toggleShowLFSTooltip(!showLFSTooltip);
  const toggleFCTooltip = () => toggleShowFCTooltip(!showFCTooltip);
  const toggleSourceTooltip = () => toggleShowSourceTooltip(!showSourceTooltip)

  const getKeyForRow = (row) => row ? `${row.geneId}-${row.modelName.replace(/\./g, '-')}` : null;

  const [urlParams] = useUrlParams(props);

  const {score, cancerType} = urlParams;
  const paramsForGeneLink = qs.stringify(sanitiseParams(pickBy({cancerType, score}, identity)));
  const paramsForModelLink = qs.stringify(sanitiseParams(pickBy({score}, identity)));

  const mouseOver = (row) => props.onHighlight(row);

  const mouseOut = () => props.onHighlight(null);

  const keyForHighlightedNode = getKeyForRow(props.highlight);

  return (
    <Fragment>
      <Table>
        <thead>
        <tr>
          {showSource && (
            <th>
              Source<sup id='sourceHelp' style={{cursor: 'default'}}>?</sup>{' '}
            </th>
          )}
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
            Cancer type
          </th>
          <th>
            Corrected log fold change<sup id='foldChangeHelp' style={{cursor: 'default'}}>?</sup>{' '}
            <SortArrows {...props} field="fc_clean"/>
          </th>
          <th>
            Loss of fitness score<sup id='lossOfFitnessScoreHelp' style={{cursor: 'default'}}>?</sup>{' '}
            <SortArrows {...props} field="bf_scaled"/>
          </th>
          <th>Essential gene</th>
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
              {showSource && (
                <td style={{width: '20px'}}>
                  <FitnessScoreSource source={row.source}/>
                </td>
              )}
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
                {row.cancerType}
              </td>
              <td className='text-center'>
                {row.fc_clean || 'NA'}
              </td>
              <td
                className='text-center'
                style={{backgroundColor: scoreBackgroundColor}}
              >
                {row.bf_scaled || 'NA'}
              </td>
              <td
                className='text-center'
                style={{backgroundColor: scoreBackgroundColor}}
                id={`lof-${key}`}
                onMouseEnter={() => setLofCellTooltip(`lof-${key}`)}
              >
                {row.bf_scaled < 0 ? 'Yes' : 'No'}
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
                innerClassName='project-score-tooltip'
              >
                <div
                  style={{color: colorPanCancerGeneBg}}
                >
                  pan cancer core fitness gene
                </div>
              </Tooltip>
            )}

            <Tooltip
              target={lofKey}
              placement='top'
              isOpen={lofCellTooltip === lofKey}
              toggle={() => setLofCellTooltip(null)}
              innerClassName='project-score-tooltip'
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
        placement='top'
        isOpen={showLFSTooltip}
        toggle={toggleLFSTooltip}
        innerClassName='project-score-tooltip'
      >
        {lossOfFitnessScoreHelp}
      </Tooltip>
      <Tooltip
        target='foldChangeHelp'
        placement='top'
        isOpen={showFCTooltip}
        toggle={toggleFCTooltip}
        innerClassName='project-score-tooltip'
      >
        {foldChangeHelp}
      </Tooltip>
      {showSource && (
        <Tooltip
          target='sourceHelp'
          placement='top'
          isOpen={showSourceTooltip}
          toggle={toggleSourceTooltip}
          innerClassName='project-score-tooltip'
        >
          {fitnessScoreSourceHelp}
        </Tooltip>
      )}
    </Fragment>
  );
}

export default withRouter(TableDisplay);
export {
  sangerLogo,
}

export function FitnessScoreSource({source}) {
  const tooltipCellElement = !source || source === 'Sanger' ? (
    <img
      src={sangerLogo}
      height={30}
    />
  ) : (
    <div>
      Broad
    </div>
  );

  return (
    <div>
      {tooltipCellElement}
    </div>
  );
}


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
