import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React, {useState, useEffect, useRef} from "react";
import {withRouter, Link} from "react-router-dom";
import * as d3 from "d3";
import {
  Card,
  CardBody,
  CardHeader,
  Label,
  Input,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Tooltip as ReactStrapTooltip,
} from 'reactstrap';
import orderBy from "lodash.orderby";

import useUrlParams from '../useUrlParams';
import {fetchPriorityScores} from '../../api';
import FetchData from '../FetchData';
import useWidth from '../useWidth';
import {colorInsignificantBg, colorSignificantBg, significantNodeColor, textDefaultColor} from '../../colors';
import PriorityScoresSettings from '../PriorityScoresSettings';
import SvgIcon from '../SvgIcon';
import Tooltip from '../Tooltip';
import {priorityScoresHelp} from '../../definitions';
import CSVDownload from "../CsvDownload";

import "./priorityScoresSection.scss";
import {CSVLink} from "react-csv";

function PriorityScoresSection(props) {
  const [urlParams] = useUrlParams(props);

  return (
    <PriorityScoresCard analysis={urlParams.analysis}/>
  );
}

export default withRouter(PriorityScoresSection);

export const defaultSettings = {
  // Tractability section
  tractability: true,

  // Threshold section
  threshold: 40,

  // Level 1: Target section
  hcg: false,
  csHcg: false,
  mutatedInPrimaryTumors: true,
  mutatedInPrimaryTumorsCosmic: false,
  weakerMarker: true,
  genomicMarkerStrength: 3,

  // Level 2: Cell type section
  foldSbf: 1,
  mgkPercFdr: 10,
  highlyExpr: true,
  depPathway: true,
  isMutated: true,

  // L1 / L2 weights
  l1Weight: 30,
};

function PriorityScoresCard({analysis}) {
  const [settings, setSettings] = useState(defaultSettings);
  const [targetPriorityScoreTooltip, setTargetPriorityScoreTooltip] = useState(false);

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <div className='d-flex justify-content-between'>
            <div>
              Target Priority Scores
              <sup
                className='helpAnchor'
                onMouseEnter={() => setTargetPriorityScoreTooltip(true)}
                id='target-priority-score-tooltip'
              >
                ?
              </sup>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div>
            <div>
              <PriorityScoresSettings
                defaultSettings={defaultSettings}
                onSubmit={setSettings}
              />
            </div>
            <div>
              <PriorityScores
                analysis={analysis}
                settings={settings}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <ReactStrapTooltip
        trigger='hover'
        toggle={() => setTargetPriorityScoreTooltip(false)}
        placement='top'
        isOpen={targetPriorityScoreTooltip}
        target='target-priority-score-tooltip'
        className='helpAnchor'
        innerClassName='project-score-tooltip'
      >
        {priorityScoresHelp.targetPriorityScores}.
      </ReactStrapTooltip>
    </React.Fragment>
  );
}

function formatPriorityScoresParams(analysis, settings) {
  return {
    analysis,
    threshold: settings.threshold,
    weights: {
      hcg: settings.hcg ? 1 : 0,
      cs_hcg: settings.csHcg ? 1 : 0,
      mutprimtum: settings.mutatedInPrimaryTumors ? 1 : 0,
      mutprimtum_cosmic: settings.mutatedInPrimaryTumorsCosmic ? 1 : 0,
      weaker_marker: settings.weakerMarker ? 1 : 0,
      class_a: settings.genomicMarkerStrength >= 1 ? 1 : 0,
      class_b: settings.genomicMarkerStrength >= 2 ? 1 : 0,
      class_c: settings.genomicMarkerStrength >= 3 ? 1 : 0,
      fold1_sbf: settings.foldSbf >= 1 ? 1 : 0,
      fold2_sbf: settings.foldSbf >= 2 ? 1 : 0,
      fold3_sbf: settings.foldSbf >= 3 ? 1 : 0,
      mgk_10perc_fdr: settings.mgkPercFdr <= 10 ? 1 : 0,
      mgk_5perc_fdr: settings.mgkPercFdr <= 5 ? 1 : 0,
      highly_expr: settings.highlyExpr ? 1 : 0,
      dep_pathway: settings.depPathway ? 1 : 0,
      mut: settings.isMutated ? 1 : 0,
      l1: settings.l1Weight,
      l2: 100 - settings.l1Weight,
    },
  }
}

export function PriorityScores({analysis, settings}) {
  const [showLabels, setShowLabels] = useState(false);
  const container = useRef(null);
  const containerWidth = useWidth(container);

  const fetchDataParams = formatPriorityScoresParams(analysis, settings);

  const fetchDataDependencies = [
    analysis,
    settings.hcg,
    settings.csHcg,
    settings.mutatedInPrimaryTumors,
    settings.mutatedInPrimaryTumorsCosmic,
    settings.weakerMarker,
    settings.threshold,
    settings.genomicMarkerStrength,
    settings.foldSbf,
    settings.mgkPercFdr,
    settings.highlyExpr,
    settings.depPathway,
    settings.isMutated,
    settings.l1Weight,
  ];

  return (
    <div
      ref={container}
    >
      <FetchData
        endpoint={fetchPriorityScores}
        params={fetchDataParams}
        deps={fetchDataDependencies}
      >
        {priorityScores => {
          return (
            <div className='my-3'>
              <div className='d-flex justify-content-between'>
                <h5>Cancer type: {priorityScores.analysis.name}</h5>
                <Label>
                  <Input
                    type='checkbox'
                    checked={showLabels}
                    onChange={() => setShowLabels(!showLabels)}
                  />{' '}
                  <span>Show gene names</span>
                </Label>
              </div>
              <PriorityScoresPlot
                plotWidth={containerWidth}
                priorityScores={priorityScores.data}
                byBucket={settings.tractability}
                showLabels={showLabels}
              />
              <div className='mt-5'>
                <PriorityScoresTable
                  priorityScores={priorityScores.data}
                />
              </div>
            </div>
          );
        }}
      </FetchData>
    </div>
  );
}

function distributeIntoBuckets(priorityScores) {
  return priorityScores.reduce((buckets, priorityScore) => {
    const bucket = priorityScore["bucket"];
    if (!buckets[bucket]) {
      return {
        ...buckets,
        [bucket]: [priorityScore],
      };
    }
    return {
      ...buckets,
      [bucket]: [...buckets[bucket], priorityScore],
    };
  }, {})
}

function PriorityScoresPlot(props) {
  const {
    plotWidth,
    priorityScores: priorityScoresAll,
    byBucket,
    showLabels,
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [priorityScores, setPriorityScores] = useState(priorityScoresAll);

  useEffect(() => {
    setPriorityScores(priorityScoresAll);
  }, [priorityScoresAll]);

  const priorityScoresDomain = d3.extent(priorityScores, priorityScore => priorityScore["score"]);

  const height = 400;
  const xOffset = 50;

  if (!byBucket) {
    return (
      <div className='position-relative'>
        {/*{yAxisLabel}*/}
        <PriorityScoreBucketPlot
          plotWidth={plotWidth - (xOffset * 2)}
          height={height}
          xOffset={xOffset}
          isFirst={true}
          domain={priorityScoresDomain}
          key={1}
          bucket={null}
          priorityScores={orderBy(priorityScores, ['score'], ['desc'])}
          showLabels={showLabels}
        />

        <PriorityScoresYLabel
          position={height / 2 - 35}
        />

        <PriorityScoresXlabel plotWidth={plotWidth} label="Rank"/>
      </div>
    );
  }

  const priorityScoresByBucket = distributeIntoBuckets(priorityScores);
  const bucketNumbers = Object.keys(priorityScoresByBucket);

  const expandBucket = (bucketToExpandStr) => {
    const bucketToExpand = ~~bucketToExpandStr;
    const priorityScoresForBucket = priorityScores.filter(
      priorityScore => priorityScore.bucket === bucketToExpand,
    );
    setPriorityScores(priorityScoresForBucket);
    setIsExpanded(true);
  };

  const resetExpandBucket = () => {
    setPriorityScores(priorityScoresAll);
    setIsExpanded(false);
  };

  return (
    <div className='position-relative'>
      {bucketNumbers.map((bucketNumber, index) => (
        <PriorityScoreBucketPlot
          plotWidth={~~((plotWidth - (xOffset * 2)) / bucketNumbers.length)}
          height={height}
          xOffset={xOffset}
          isFirst={index === 0}
          domain={priorityScoresDomain}
          key={bucketNumber}
          bucket={bucketNumber === "null" ? "Unclassified" : bucketNumber}
          priorityScores={priorityScoresByBucket[bucketNumber]}
          isExpanded={isExpanded}
          onExpand={expandBucket}
          onShrink={resetExpandBucket}
          showLabels={showLabels}
        />
      ))}

      <PriorityScoresYLabel
        position={height / 2 - 35}
      />

      <PriorityScoresXlabel
        plotWidth={plotWidth}
        label='Tractability bucket'
        description='To estimate the likelihood of a target to bind a small molecule or to be accessible to an antibody, we made use of a genome-wide target tractability assessment pipeline'
      />
      <PriorityScoresBucketLegend/>
    </div>
  );
}

function PriorityScoresBucketLegend() {
  const [group1LegendTooltip, setGroup1LegendTooltip] = useState(false);
  const [group2LegendTooltip, setGroup2LegendTooltip] = useState(false);
  const [group3LegendTooltip, setGroup3LegendTooltip] = useState(false);

  return (
    <div className='d-flex justify-content-around mt-3'>
      <div className="bucketBoxLegend">
        <div className={classNames("element", "group1")}/>
        <span className="label">Group 1 bucket: <b>Approved or in clinical development</b></span>
        <sup
          className='helpAnchor'
          onMouseEnter={() => setGroup1LegendTooltip(true)}
          id='group-1-legend-tooltip'
        >
          ?
        </sup>
      </div>
      <div className="bucketBoxLegend">
        <div className={classNames("element", "group2")}/>
        <span className="label">Group 2 bucket: <b>Supporting evidence</b></span>
        <sup
          className='helpAnchor'
          onMouseEnter={() => setGroup2LegendTooltip(true)}
          id='group-2-legend-tooltip'
        >
          ?
        </sup>
      </div>
      <div className="bucketBoxLegend">
        <div className={classNames("element", "group3")}/>
        <span className="label">Group 3 bucket: <b>Weak or no supporting evidence</b></span>
        <sup
          className='helpAnchor'
          onMouseEnter={() => setGroup3LegendTooltip(true)}
          id='group-3-legend-tooltip'
        >
          ?
        </sup>
      </div>
      <ReactStrapTooltip
        trigger='hover'
        toggle={() => setGroup1LegendTooltip(false)}
        placement='top'
        isOpen={group1LegendTooltip}
        target='group-1-legend-tooltip'
        className='helpAnchor'
        innerClassName='project-score-tooltip'
      >
        Contains targets of approved anticancer drugs or compounds in clinical or preclinical development
      </ReactStrapTooltip>
      <ReactStrapTooltip
        trigger='hover'
        toggle={() => setGroup2LegendTooltip(false)}
        placement='top'
        isOpen={group2LegendTooltip}
        target='group-2-legend-tooltip'
        className='helpAnchor'
        innerClassName='project-score-tooltip'
      >
        Contains targets without drugs in clinical development, but have evidence to support target tractability
      </ReactStrapTooltip>
      <ReactStrapTooltip
        trigger='hover'
        toggle={() => setGroup3LegendTooltip(false)}
        placement='top'
        isOpen={group3LegendTooltip}
        target='group-3-legend-tooltip'
        className='helpAnchor'
        innerClassName='project-score-tooltip'
      >
        Contains targets with weak or no supportive information on target tractability
      </ReactStrapTooltip>
    </div>
  );
}

function PriorityScoresYLabel({position}) {
  return (
    <div className='position-absolute' style={{
      top: `${position}px`,
      left: '-60px',
      transform: 'rotate(-90deg)',
    }}>
      Target priority score
    </div>
  )
}

function PriorityScoresXlabel({label, description}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <React.Fragment>
      <div className='xLabel'>
        {label}
        {description && (
          <React.Fragment>
            <sup
              className='helpAnchor'
              onMouseEnter={() => setTooltipOpen(true)}
              id='tractability-bucket-x-label-help-icon'
            >
              ?
            </sup>
            <ReactStrapTooltip
              trigger='hover'
              toggle={() => setTooltipOpen(false)}
              placement='bottom'
              isOpen={tooltipOpen}
              target='tractability-bucket-x-label-help-icon'
              className='helpAnchor'
              innerClassName='project-score-tooltip'
            >
              {description}
            </ReactStrapTooltip>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

function bucketGroupClassName(bucket) {
  if (bucket > 0 && bucket < 4) {
    return "group1";
  }
  if (bucket > 3 && bucket < 8) {
    return "group2"
  }
  if (bucket > 7) {
    return "group3";
  }
}

function PriorityScoreBucketPlot(props) {
  const {
    plotWidth,
    height,
    xOffset,
    isFirst,
    domain,
    bucket,
    priorityScores,
    isExpanded = false,
    onExpand,
    onShrink,
    showLabels,
  } = props;

  const [showExpandLabel, setShowExpandLabel] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  // const height = 400;
  const plotHeight = 350;

  const yAxisRef = useRef(null);
  const xAxisRef = useRef(null);

  const xScale = d3.scaleLinear()
    .range([5, plotWidth - 5])
    .domain([0, priorityScores.length - 1]);

  const yScale = d3.scaleLinear()
    .range([plotHeight - 5, 5])
    .domain(domain);

  useEffect(() => {
    if (isFirst === true) {
      const yAxis = d3.axisLeft(yScale);
      const axisLeft = d3
        .select(yAxisRef.current);
      axisLeft.call(yAxis);
    }
    if (xAxisRef.current) {
      const xAxis = d3.axisBottom(xScale);
      const axisRight = d3
        .select(xAxisRef.current);
      axisRight.call(xAxis);
    }
  }, [domain]);

  const yAxisElement = isFirst ? (
    <React.Fragment>
      <g
        transform={`translate(${xOffset}, 0)`}
        ref={yAxisRef}
      />
    </React.Fragment>
  ) : null;

  const xAxisOrBucketNumber = bucket ? (
    <g transform={`translate(${isFirst ? xOffset : 0}, ${plotHeight})`}>
      <rect y={0} x={0} width={plotWidth} height={height - plotHeight}
            className={classNames("bucketBox", bucketGroupClassName(bucket))}/>
      <text
        x={plotWidth / 2}
        y={(height - plotHeight) / 2}
        alignmentBaseline="middle"
        textAnchor="middle"
        stroke={textDefaultColor}
      >
        {bucket}
      </text>
    </g>
  ) : (
    <React.Fragment>
      <g
        transform={`translate(${xOffset}, ${plotHeight})`}
        ref={xAxisRef}
      />
    </React.Fragment>
  );

  const mouseOverElement = () => {
    setShowExpandLabel(true);
  };
  const mouseLeaveElement = () => {
    setShowExpandLabel(false);
  };

  const highlightPriorityScore = (priorityScore, index) => {
    setTooltip({
      x: isFirst ? xScale(index) + xOffset : xScale(index),
      y: yScale(priorityScore["score"]),
      priorityScore,
    })
  };

  const unHighlightPriorityScore = () => {
    setTooltip(null);
  };

  const priorityScoreTooltip = tooltip ? (
    <PriorityScoreTooltip x={tooltip.x} y={tooltip.y} priorityScore={tooltip.priorityScore}/>
  ) : null;


  return (
    <div className='bucketPlot'>
      <svg
        width={isFirst ? (plotWidth + xOffset) : plotWidth}
        height={height}
        onMouseEnter={() => mouseOverElement()}
        onMouseLeave={() => mouseLeaveElement()}
      >
        {yAxisElement}
        <g transform={`translate(${isFirst ? xOffset : 0}, 0)`}>
          <rect
            width={plotWidth}
            height={plotHeight}
            className="bucketBox"
          />
          {priorityScores.map((priorityScore, index) => {
            const xPos = xScale(index);
            const labelOffset = 0;
            const labelAproxWidth = 8 * priorityScore.symbol.length;
            const labelAnchor = plotWidth < (xPos + labelAproxWidth) ? 'end' : 'start';
            const labelXposition = plotWidth < (xPos + labelAproxWidth) ? xPos - labelOffset : xPos + labelOffset;
            return (
              <Link
                key={keyForPriorityScore(priorityScore)}
                to={`/gene/${priorityScore.gene_id}`}
              >
                <circle
                  cx={xPos}
                  cy={yScale(priorityScore["score"])}
                  r="3"
                  fill={significantNodeColor}
                  onMouseEnter={() => highlightPriorityScore(priorityScore, index)}
                  onMouseLeave={() => unHighlightPriorityScore()}
                />
                {showLabels && (
                  <text
                    x={labelXposition}
                    y={yScale(priorityScore["score"])}
                    textAnchor={labelAnchor}
                    alignmentBaseline='middle'
                    fontSize={10}
                    className='priorityScoreGeneLabel'
                  >
                    {priorityScore.symbol}
                  </text>
                )}
              </Link>
            )
          })}
        </g>
        {xAxisOrBucketNumber}
        <ExpandElement
          bucket={bucket}
          isExpanded={isExpanded}
          onExpand={onExpand}
          onShrink={onShrink}
          plotWidth={plotWidth}
          xOffset={isFirst ? xOffset : 0}
          show={showExpandLabel}
        />
      </svg>
      {priorityScoreTooltip}
    </div>
  );
}

function ExpandElement({bucket, isExpanded, plotWidth, show, xOffset, onExpand, onShrink}) {
  const classes = classNames({
    expandLabel: true,
    show,
  });

  const iconWidth = 20;

  const iconPosition = xOffset + (plotWidth / 2) - (iconWidth / 2);

  if (bucket && !isExpanded) {
    return (
      <ExpandShrinkIcon
        iconElement={<SvgIcon icon="searchPlus" size={iconWidth} className={classes}/>}
        plotWidth={plotWidth}
        iconWidth={iconWidth}
        action={() => onExpand(bucket)}
        xPos={iconPosition}
      />
    );
  }

  if (isExpanded) {
    return (
      <React.Fragment>
        <ExpandShrinkIcon
          iconElement={<SvgIcon icon="searchMinus" size={iconWidth} className={classes}/>}
          plotWidth={plotWidth}
          iconWidth={iconWidth}
          action={() => onShrink()}
          xPos={iconPosition}
        />
      </React.Fragment>
    );
  }

  return null;
}


function ExpandShrinkIcon({iconElement, xPos, action, iconWidth}) {
  return (
    <g transform={`translate(${xPos}, 20)`}>
      <rect
        x={0}
        y={0}
        width={iconWidth}
        height={iconWidth}
        onClick={() => action()}
        className="expandPointerEvent"
      />
      {iconElement}
    </g>
  );
}

function PriorityScoreTooltip({x, y, priorityScore}) {
  return (
    <Tooltip
      x={x}
      y={y}
      width={0}
      height={0}
    >
      Gene: <b>{priorityScore.symbol}</b><br/>
      Target priority score: <b>{formatPriorityScore(priorityScore.score)}</b><br/>
      Tractability bucket: <b>{priorityScore.bucket}</b><br/>
      Cancer type: <b>{priorityScore.analysis.name}</b>
    </Tooltip>
  );
}


function PriorityScoresTable({priorityScores}) {

  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);

  const [query, setQuery] = useState('');

  const filteredPriorityScores = priorityScores.filter(priorityScore => priorityScore.symbol.includes(query));

  const totalHits = filteredPriorityScores.length;

  const goPrev = () => setPageNumber(pageNumber - 1);
  const goNext = () => setPageNumber(pageNumber + 1);

  const isFirstPage = pageNumber === 0;
  const isLastPage = pageNumber === ~~(totalHits / pageSize);

  const firstItem = pageNumber * pageSize;

  const priorityScoresInPage = filteredPriorityScores.slice(firstItem, firstItem + pageSize);

  return (
    <div>
      <div className='d-flex justify-content-between'>
        <div>
          <Input
            type='text'
            onChange={ev => setQuery(ev.target.value.toUpperCase())}
            placeholder='Search for gene'
          />
        </div>
        <div className='align-self-center'>
          <CSVLink data={priorityScoresInPage} filename='depmap-priority-scores-table.csv'>
            <FontAwesomeIcon
              icon={faDownload}
              title='Download as CSV'
              size='sm'
            />
          </CSVLink>
        </div>
      </div>
      <div className='my-2'>
        <Table>
          <thead>
          <tr>
            <th>Target gene symbol</th>
            <th>Target gene ID</th>
            <th className='text-center'>Tractability bucket</th>
            <th>Analysis (pan cancer, cancer specific)</th>
            <th className='text-center'>Target priority score</th>
          </tr>
          </thead>
          <tbody>
          {priorityScoresInPage.map(priorityScore => (
            <tr
              key={keyForPriorityScore(priorityScore)}
            >
              <td>
                <Link to={`/gene/${priorityScore.gene_id}`}>{priorityScore.symbol}</Link>
              </td>
              <td>
                {priorityScore.gene_id}
              </td>
              <td
                className='text-center'
              >
                {priorityScore.bucket}
              </td>
              <td>
                {priorityScore.analysis.name}
              </td>
              <td
                className='text-center'
                style={{backgroundColor: priorityScore.score >= 40 ? colorSignificantBg : colorInsignificantBg}}
              >
                {formatPriorityScore(priorityScore.score)}
              </td>
            </tr>
          ))}
          </tbody>
        </Table>
      </div>
      <div className='d-flex justify-content-between'>
        <div>
          <Pagination>
            <PaginationItem disabled={isFirstPage}>
              <PaginationLink onClick={goPrev}>
                Previous
              </PaginationLink>
            </PaginationItem>
            <small style={{padding: '0.75rem 0.25rem'}}>
            </small>
            <PaginationItem disabled={isLastPage}>
              <PaginationLink onClick={goNext}>
                Next
              </PaginationLink>
            </PaginationItem>
          </Pagination>
          Page <b>{pageNumber + 1}</b> of {~~(totalHits / pageSize) + 1}
        </div>
        <div>
          Rows per page:{' '}
          <Input
            type='select'
            onChange={event => setPageSize(+event.target.value)}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Input>
        </div>
      </div>
    </div>
  );
}


function keyForPriorityScore(priorityScore) {
  return `${priorityScore["gene_id"]}-${priorityScore.analysis.id}`;
}

function formatPriorityScore(priorityScore) {
  return priorityScore.toFixed(2);
}
