import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCog} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React, {useState, useEffect, useRef} from "react";
import {withRouter} from "react-router-dom";
import * as d3 from "d3";
import {Button, Card, CardBody, CardHeader, Collapse, Label, Input} from 'reactstrap';
import isEqual from "lodash.isequal";
import orderBy from "lodash.orderby";

import useUrlParams from '../useUrlParams';
import {fetchPriorityScores} from '../../api';
import FetchData from '../FetchData';
import useWidth from '../useWidth';
import {textDefaultColor} from '../../colors';
import SvgIcon from '../SvgIcon';

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
  tractability: true,
};

function PriorityScores({analysis}) {
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  const container = useRef(null);
  const containerWidth = useWidth(container);

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
            <div style={{width: "100%", height: "150px"}}>
              <Settings defaultSettings={settings} onSubmit={(newSettings) => setSettings(newSettings)}/>
            </div>
          </Collapse>
          <FetchData
            endpoint={fetchPriorityScores}
            params={{analysis}}
            deps={analysis}
          >
            {priorityScores => (
              <PriorityScoresPlot
                plotWidth={containerWidth}
                priorityScores={priorityScores.data}
                byBucket={settings.tractability}
              />
            )}
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
  }, []);

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

  return (
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
  );
}

function Settings({defaultSettings, onSubmit}) {
  const [tractability, setTractability] = useState(defaultSettings.tractability);

  const submit = () => onSubmit(currentSettings());

  const currentSettings = () => ({
    tractability,
  });

  return (
    <div>
      <div className="mx-5 my-4">
        <Label>
          <Input
            type='checkbox'
            checked={tractability}
            onChange={() => setTractability(!tractability)}
          />{' '}
          Tractability
        </Label>
      </div>
      <div className="mx-5 my-2">
        <Button
          onClick={() => submit()}
          color={"primary"}
          disabled={isEqual(currentSettings(), defaultSettings)}
        >
          Update
        </Button>
      </div>
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

