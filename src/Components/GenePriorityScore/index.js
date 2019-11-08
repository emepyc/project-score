import React, {useState, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import {Card, CardHeader, CardBody} from 'reactstrap';
import * as d3 from 'd3';

import {cancerTypeColor, textDefaultColor} from "../../colors";
import {fetchGenePriorityScore} from '../../api';
import useUrlParams from '../useUrlParams';
import FetchData from '../FetchData';
import useWidth from "../useWidth";
import Tooltip from '../Tooltip';


function GenePriorityScore(props) {
  const [{geneId}] = useUrlParams(props);

  const container = useRef(null);
  const containerWidth = useWidth(container);

  return (
    <div ref={container}>
      <FetchData
        endpoint={fetchGenePriorityScore}
        params={{geneId}}
        deps={[geneId]}
      >
        {priorityScore => {
          if (priorityScore.length === 0) {
            return (
              <div>
                No priority scores for gene
              </div>
            );
          }
          return (
            <Card>
              <CardHeader>
                Priority Scores
              </CardHeader>
              <CardBody>
                <PriorityScoreForAnalyses width={containerWidth} scores={priorityScore}/>
              </CardBody>
            </Card>
          )
        }}
      </FetchData>
    </div>
  );
}

export default withRouter(GenePriorityScore);


function PriorityScoreForAnalyses({width, scores}) {
  const [tooltip, setTooltip] = useState(null);
  const numberOfScores = 14;

  const maxLabelLength = d3.max(scores.map(score => score.analysis.length));
  const xLabelWidth = maxLabelLength * 8;

  const levelLabelHeight = 30;
  const xMargin = 15;
  const blockMargin = 12;
  const yLabelHeight = 150;
  const verticalMargin = 20;
  const svgWidth = width - (xMargin * 2);
  const cellWidth = (svgWidth - xLabelWidth) / (numberOfScores + 0.5);

  const levellabelYPosition = scores.length * (cellWidth + verticalMargin);

  const svgHeight = yLabelHeight + (scores.length * (verticalMargin + cellWidth)) + levelLabelHeight;

  const tooltipElement = tooltip ? (
    <Tooltip
      x={tooltip.x}
      y={tooltip.y}
      width={20}
      height={20}
      hideGuide={true}
    >
      {tooltip.message}
    </Tooltip>
  ) : null;

  return (
    <div style={{position: 'relative', width: '100%', marginRight: `${xMargin}px`}}>
      <svg
        width={svgWidth}
        height={svgHeight}
      >
        <g transform={`translate(0, ${yLabelHeight})`}>
          <Xlabels cellWidth={cellWidth} blockMargin={blockMargin}/>
          {scores.map((scoresForAnalysis, index) => {
            const rowY = index * (verticalMargin + cellWidth);
            return (
              <g key={scoresForAnalysis.analysis} transform={`translate(0, ${rowY})`}>
                <PriorityScoreRow
                  onHighlight={setTooltip}
                  rowY={rowY + yLabelHeight}
                  cellWidth={cellWidth}
                  scores={scoresForAnalysis}
                  blockMargin={blockMargin}
                />
              </g>
            )
          })}
          <LevelLabel
            posX={(cellWidth * 2) + blockMargin + (cellWidth * 5 / 2)}
            posY={levellabelYPosition}
            label='Level 1'
          />
          <LevelLabel
            posX={(cellWidth * 7) + (blockMargin * 2) + (cellWidth * 7 / 2)}
            posY={levellabelYPosition}
            label='Level 2'
          />
        </g>
      </svg>
      {tooltipElement}
    </div>
  )
}

function LevelLabel({posX, posY, label}) {
  return (
    <text
      x={posX}
      y={posY}
      alignmentBaseline='central'
      textAnchor='middle'
    >
      {label}
    </text>
  );
}

function Xlabels({cellWidth, blockMargin}) {
  return (
    <React.Fragment>
      /* General scores */
      <Xlabel
        posX={cellWidth / 2}
        label='Total priority score'
      />
      <Xlabel
        posX={cellWidth + (cellWidth / 2)}
        label='Rank (within cancer type)'
      />

      /* L1 scores */
      <Xlabel
        posX={(cellWidth * 2) + blockMargin + (cellWidth / 2)}
        label='Class A marker'
      />
      <Xlabel
        posX={(cellWidth * 3) + blockMargin + (cellWidth / 2)}
        label='Class B marker'
      />
      <Xlabel
        posX={(cellWidth * 4) + blockMargin + (cellWidth / 2)}
        label='Class C marker'
      />
      <Xlabel
        posX={(cellWidth * 5) + blockMargin + (cellWidth / 2)}
        label='Weaker marker'
      />
      <Xlabel
        posX={(cellWidth * 6) + blockMargin + (cellWidth / 2)}
        label='Mutated primary tumour'
      />

      /* L2 scores */
      <Xlabel
        posX={(cellWidth * 7) + (blockMargin * 2) + (cellWidth / 2)}
        label='Fitness score < -1'
      />
      <Xlabel
        posX={(cellWidth * 8) + (blockMargin * 2) + (cellWidth / 2)}
        label='Fitness score < -2'
      />
      <Xlabel
        posX={(cellWidth * 9) + (blockMargin * 2) + (cellWidth / 2)}
        label='Fitness score < -3'
      />
      <Xlabel
        posX={(cellWidth * 9) + (blockMargin * 2) + (cellWidth / 2)}
        label='Fitness score < -3'
      />
      <Xlabel
        posX={(cellWidth * 10) + (blockMargin * 2) + (cellWidth / 2)}
        label='MAGeCK < 10% FDR'
      />
      <Xlabel
        posX={(cellWidth * 11) + (blockMargin * 2) + (cellWidth / 2)}
        label='MAGeCK < 5% FDR'
      />
      <Xlabel
        posX={(cellWidth * 11) + (blockMargin * 2) + (cellWidth / 2)}
        label='MAGeCK < 5% FDR'
      />
      <Xlabel
        posX={(cellWidth * 12) + (blockMargin * 2) + (cellWidth / 2)}
        label='Somatically mutated cell line'
      />
      <Xlabel
        posX={(cellWidth * 13) + (blockMargin * 2) + (cellWidth / 2)}
        label='Fitness gene enriched pathway'
      />
    </React.Fragment>
  );
}

function Xlabel({posX, label}) {
  return (
    <g
      transform={`translate(${posX}) rotate(-45)`}
    >
      <text
        x={0}
        y={-15}
        alignmentBaseline='central'
        style={{
          fontSize: '0.9em',
          fill: textDefaultColor,
        }}
      >
        {label}
      </text>
    </g>
  );
}

function PriorityScoreRow({scores, rowY, cellWidth, blockMargin, onHighlight}) {
  const color = cancerTypeColor[scores.analysisId];

  return (
    <React.Fragment>
      /* General scores */
      <PriorityScoreWithTextValue
        posX={0}
        width={cellWidth}
        color={cancerTypeColor[scores.analysisId]}
        text={10}
      />
      <PriorityScoreWithTextValue
        posX={cellWidth}
        width={cellWidth}
        color={cancerTypeColor[scores.analysisId]}
        text={scores.rank}
      />

      /* L1 scores */
      <PriorityScoreWithColor
        posX={(cellWidth * 2) + blockMargin}
        width={cellWidth}
        color={scores.l1Scores.classA ? color : "#FFFFFF"}
      />
      <PriorityScoreWithColor
        posX={(cellWidth * 3) + blockMargin}
        width={cellWidth}
        color={scores.l1Scores.classB ? color : "#FFFFFF"}
      />
      <PriorityScoreWithColor
        posX={(cellWidth * 4) + blockMargin}
        width={cellWidth}
        color={scores.l1Scores.classC ? color : "#FFFFFF"}
      />
      <PriorityScoreWithColor
        posX={(cellWidth * 5) + blockMargin}
        width={cellWidth}
        color={scores.l1Scores.weakerMarker ? color : "#FFFFFF"}
      />
      <PriorityScoreWithColor
        posX={(cellWidth * 6) + blockMargin}
        width={cellWidth}
        color={scores.l1Scores.mutatedPrimaryTumour ? color : "#FFFFFF"}
      />

      /* L2 scores */
      <PriorityScoreWithColorScale
        posX={(cellWidth * 7) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.fold1Sbf.true}
        maxValue={scores.l2Scores.fold1Sbf.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 8) + (blockMargin * 2),
          message: `${scores.l2Scores.fold1Sbf.true} / ${scores.l2Scores.fold1Sbf.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 8) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.fold2Sbf.true}
        maxValue={scores.l2Scores.fold2Sbf.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 9) + (blockMargin * 2),
          message: `${scores.l2Scores.fold2Sbf.true} / ${scores.l2Scores.fold2Sbf.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 9) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.fold3Sbf.true}
        maxValue={scores.l2Scores.fold3Sbf.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 10) + (blockMargin * 2),
          message: `${scores.l2Scores.fold3Sbf.true} / ${scores.l2Scores.fold3Sbf.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 10) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.mgk5percFdr.true}
        maxValue={scores.l2Scores.mgk5percFdr.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 11) + (blockMargin * 2),
          message: `${scores.l2Scores.mgk5percFdr.true} / ${scores.l2Scores.mgk5percFdr.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 11) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.mgk10percFdr.true}
        maxValue={scores.l2Scores.mgk10percFdr.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 12) + (blockMargin * 2),
          message: `${scores.l2Scores.mgk10percFdr.true} / ${scores.l2Scores.mgk10percFdr.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 12) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.mut.true}
        maxValue={scores.l2Scores.mut.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 13) + (blockMargin * 2),
          message: `${scores.l2Scores.mut.true} / ${scores.l2Scores.mut.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 13) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.depPathway.true}
        maxValue={scores.l2Scores.depPathway.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 14) + (blockMargin * 2),
          message: `${scores.l2Scores.depPathway.true} / ${scores.l2Scores.depPathway.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <text
        x={(cellWidth * 14) + (blockMargin * 2) + 10}
        y={cellWidth / 2}
        alignmentBaseline='central'
        textAnchor='left'
        style={{
          fill: textDefaultColor,
        }}
      >
        {scores.analysis}
      </text>
    </React.Fragment>
  );
}

function PriorityScoreWithTextValue({posX, width, color, text}) {
  return (
    <React.Fragment>
      <PriorityScoreWithColor
        posX={posX}
        width={width}
        color={color}
      />
      <text
        x={posX + (width / 2)}
        y={width / 2}
        fill={textDefaultColor}
        textAnchor='middle'
        alignmentBaseline='central'
        style={{
          fontSize: '0.9em',
        }}
      >
        {text}
      </text>
    </React.Fragment>
  );
}

function PriorityScoreWithColorScale({posX, width, value, maxValue, color, ...props}) {
  const colorScale = d3.scaleLinear()
    .range(['#FFFFFF', color])
    .domain([0, maxValue]);

  return (
    <PriorityScoreWithColor
      posX={posX}
      width={width}
      color={colorScale(value)}
      {...props}
    />
  );
}

function PriorityScoreWithColor({posX, width, color, ...props}) {
  return (
    <rect
      x={posX}
      y={0}
      width={width}
      height={width}
      fill={color}
      style={{
        strokeWidth: 0.5,
        stroke: "#333333",
      }}
      {...props}
    />
  );
}
