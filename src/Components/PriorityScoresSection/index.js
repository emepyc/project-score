import React, {useEffect, useRef} from "react";
import {withRouter} from "react-router-dom";
import * as d3 from "d3";
import {Card, CardBody, CardHeader} from 'reactstrap';

import useUrlParams from '../useUrlParams';
import {fetchPriorityScores} from '../../api';
import FetchData from '../FetchData';
import useWidth from '../useWidth';

import "./priorityScores.scss";

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

function PriorityScores({analysis}) {
  const container = useRef(null);
  const containerWidth = useWidth(container);

  return (
    <Card>
      <CardHeader>
        Priority scores
      </CardHeader>
      <CardBody>
        <div ref={container}>
          <FetchData
            endpoint={fetchPriorityScores}
            params={{analysis}}
            deps={analysis}
          >
            {priorityScores => (
              <PriorityScoresPlot plotWidth={containerWidth} priorityScores={priorityScores.data}/>
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

function PriorityScoresPlot({plotWidth, priorityScores}) {
  const priorityScoresByBucket = distributeIntoBuckets(priorityScores);
  const priorityScoresDomain = d3.extent(priorityScores, priorityScore => priorityScore["score"]);
  const bucketNumbers = Object.keys(priorityScoresByBucket);

  const xOffset = 100;

  return (
    <React.Fragment>
      {bucketNumbers.map((bucketNumber, index) => (
        <PriorityScoreBucketPlot
          plotWidth={~~((plotWidth - (xOffset * 2)) / bucketNumbers.length)}
          xOffset={xOffset}
          isFirst={index === 0}
          domain={priorityScoresDomain}
          key={bucketNumber}
          bucket={bucketNumber}
          priorityScores={priorityScoresByBucket[bucketNumber]}
        />
      ))}
    </React.Fragment>
  );
}

function PriorityScoreBucketPlot({plotWidth, xOffset, isFirst, domain, bucket, priorityScores}) {
  const height = 300;

  const yAxisRef = useRef(null);

  const xScale = d3.scaleLinear()
    .range([0, plotWidth])
    .domain([0, priorityScores.length - 1]);

  const yScale = d3.scaleLinear()
    .range([height, 0])
    .domain(domain);

  useEffect(() => {
    if (isFirst === true) {
      const yAxis = d3.axisLeft(yScale);
      const axisLeft = d3
        .select(yAxisRef.current);
      axisLeft.call(yAxis);
    }
  });

  const yAxisElement = isFirst ? (
    <React.Fragment>
      <g
        transform={`translate(${xOffset - 35}, ${height / 2}) rotate(-90)`}
      >
        <text
          fill="#5A5F5F"
          textAnchor="middle"
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

  return (
    <svg
      width={isFirst ? (plotWidth + xOffset) : plotWidth}
      height={500}
    >
      {yAxisElement}
      <g transform={`translate(${isFirst ? xOffset : 0}, 0)`}>
        <rect width={plotWidth} height={300} className="bucketBox"/>
        {priorityScores.map((priorityScore, index) => (
          <circle key={priorityScore["gene_id"]} cx={xScale(index)} cy={yScale(priorityScore["score"])} r="3"
                  fill="green"/>
        ))}
        <g transform="translate(0, 300)">
          <rect y={0} x={0} width={plotWidth} height={50} className="bucketBox"/>
          <text x={plotWidth / 2} y={25} alignmentBaseline="middle" textAnchor="middle" stroke="black">
            {bucket}
          </text>
        </g>
      </g>

    </svg>
  );
}
