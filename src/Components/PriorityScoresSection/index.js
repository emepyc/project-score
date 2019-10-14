import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCog} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React, {useState, useEffect, useRef} from "react";
import {withRouter} from "react-router-dom";
import * as d3 from "d3";
import {Button, Card, CardBody, CardHeader, Collapse} from 'reactstrap';
import orderBy from "lodash.orderby";

import useUrlParams from '../useUrlParams';
import {fetchPriorityScores} from '../../api';
import FetchData from '../FetchData';
import useWidth from '../useWidth';
import {textDefaultColor} from '../../colors';
import PriorityScoresSettings from '../PriorityScoresSettings';
import SvgIcon from '../SvgIcon';
import Tooltip from '../Tooltip';

import "./priorityScoresSection.scss";

function PriorityScoresSection(props) {
  const [urlParams] = useUrlParams(props);

  if (!urlParams.analysis) {
    return (
      <div>No priority scores to show</div>
    );
  }

  return (
    <PriorityScores analysis={urlParams.analysis}/>
  );
}

export default withRouter(PriorityScoresSection);

const defaultSettings = {
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
  foldSbf: 3,
  mgkPercFdr: 10,
  highlyExpr: true,
  depPathway: true,
  isMutated: true,
};

function PriorityScores({analysis}) {
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  const container = useRef(null);
  const containerWidth = useWidth(container);

  const fetchDataParams = {
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
    },
  };

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
  ];

  return (
    <Card>
      <CardHeader>
        Priority scores
      </CardHeader>
      <CardBody>
        <div ref={container}>
          <Button
            outline
            color="secondary"
            onClick={() => setSettingsIsOpen(!settingsIsOpen)}
          >
            <FontAwesomeIcon icon={faCog}>
              Settings
            </FontAwesomeIcon>
          </Button>
          <Collapse isOpen={settingsIsOpen}>
            <div style={{width: "100%"}}>
              <PriorityScoresSettings
                defaultSettings={defaultSettings}
                onSubmit={(newSettings) => setSettings(newSettings)}
              />
            </div>
          </Collapse>
          <FetchData
            endpoint={fetchPriorityScores}
            params={fetchDataParams}
            deps={fetchDataDependencies}
          >
            {priorityScores => {
              return (
                <PriorityScoresPlot
                  plotWidth={containerWidth}
                  priorityScores={priorityScores.data}
                  byBucket={settings.tractability}
                />
              );
            }}
          </FetchData>
        </div>
      </CardBody>
    </Card>
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

function PriorityScoresPlot({plotWidth, priorityScores: priorityScoresAll, byBucket}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [priorityScores, setPriorityScores] = useState(priorityScoresAll);

  useEffect(() => {
    setPriorityScores(priorityScoresAll);
  }, [priorityScoresAll]);

  const priorityScoresDomain = d3.extent(priorityScores, priorityScore => priorityScore["score"]);

  const xOffset = 100;

  if (!byBucket) {
    return (
      <React.Fragment>
        <PriorityScoreBucketPlot
          plotWidth={plotWidth - (xOffset * 2)}
          xOffset={xOffset}
          isFirst={true}
          domain={priorityScoresDomain}
          key={1}
          bucket={null}
          priorityScores={orderBy(priorityScores, ['score'], ['desc'])}
        />
        <PriorityScoresXlabel plotWidth={plotWidth} label="Rank" xOffset={xOffset}/>
      </React.Fragment>
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
    <React.Fragment>
      {bucketNumbers.map((bucketNumber, index) => (
        <PriorityScoreBucketPlot
          plotWidth={~~((plotWidth - (xOffset * 2)) / bucketNumbers.length)}
          xOffset={xOffset}
          isFirst={index === 0}
          domain={priorityScoresDomain}
          key={bucketNumber}
          bucket={bucketNumber === "null" ? "Unclassified" : bucketNumber}
          priorityScores={priorityScoresByBucket[bucketNumber]}
          isExpanded={isExpanded}
          onExpand={expandBucket}
          onShrink={resetExpandBucket}
        />
      ))}
      <PriorityScoresXlabel plotWidth={plotWidth} label="Tractability bucket" xOffset={xOffset}/>
    </React.Fragment>
  );
}

function PriorityScoresXlabel({plotWidth, label}) {
  return (
    <svg width={plotWidth} height={50}>
      <g transform={`translate(${plotWidth / 2}, 25)`}>
        <text
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fill={textDefaultColor}
        >
          {label}
        </text>
      </g>
    </svg>
  )
}

function PriorityScoreBucketPlot(props) {
  const {
    plotWidth,
    xOffset,
    isFirst,
    domain,
    bucket,
    priorityScores,
    isExpanded = false,
    onExpand,
    onShrink,
  } = props;

  const [showExpandLabel, setShowExpandLabel] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  const height = 400;
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
      <g transform={`translate(${xOffset - 35}, ${plotHeight / 2}) rotate(-90)`}>
        <text
          fill={textDefaultColor}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          Priority score
        </text>
      </g>
      <g
        transform={`translate(${xOffset}, 0)`}
        ref={yAxisRef}
      />
    </React.Fragment>
  ) : null;

  const xAxisOrBucketNumber = bucket ? (
    <g transform={`translate(${isFirst ? xOffset : 0}, ${plotHeight})`}>
      <rect y={0} x={0} width={plotWidth} height={height - plotHeight} className="bucketBox"/>
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

  const isCramped = plotWidth / priorityScores.length < 5;

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
    <div style={{display: "inline-block", position: "relative"}}>
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
          {priorityScores.map((priorityScore, index) => (
            <circle
              key={priorityScore["gene_id"]}
              cx={xScale(index)}
              cy={yScale(priorityScore["score"])}
              r="3"
              fill="green"
              onMouseEnter={() => highlightPriorityScore(priorityScore, index)}
              onMouseLeave={() => unHighlightPriorityScore()}
            />
          ))}
        </g>
        {xAxisOrBucketNumber}
        <ExpandElement
          bucket={bucket}
          isCramped={isCramped}
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

function ExpandElement({bucket, isCramped, isExpanded, plotWidth, show, xOffset, onExpand, onShrink}) {
  const classes = classNames({
    expandLabel: true,
    show,
  });

  const iconWidth = 20;

  const iconPosition = xOffset + (plotWidth / 2) - (iconWidth / 2);

  if (bucket && isCramped && !isExpanded) {
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
      Priority score: <b>{priorityScore.score.toFixed(2)}</b><br/>
      Bucket: <b>{priorityScore.bucket}</b><br/>
    </Tooltip>
  );
}