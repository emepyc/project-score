import * as d3 from 'd3';
import sortBy from 'lodash.sortby';
import React, {useState, useEffect, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import findIndex from 'lodash.findindex';
import {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';
import {fetchCrisprData} from '../../api';
import {
  cancerTypeColorDict,
  insignificantNodeColor,
  significantNodeColor,
  colorInsignificantBg,
  colorSignificantBg
} from '../../colors';
import useUrlParams from '../useUrlParams';
import FetchData from "../FetchData";
import Tooltip from "../Tooltip";

import './fitnessPlot.scss';

const LOSS_OF_FITNESS_SCORE_LABEL = 'Loss of fitness score';
const FC_CLEAN_LABEL = 'Corrected log fold change';


function FitnessPlot(props) {
  const config = {
    height: 300,
    marginTop: 50,
    marginLeft: 50,
    significantField: 'bf_scaled',
  };

  const container = useRef(null);
  const [urlParams] = useUrlParams(props);

  const params = {
    geneId: urlParams.geneId,
    modelId: urlParams.modelId,
    cancerType: urlParams.cancerType,
    scoreMin: urlParams.scoreMin,
    scoreMax: urlParams.scoreMax,
    excludePanCancerGenes: urlParams.excludePanCancerGenes,
    pageSize: 0,
  };

  const deps = [
    urlParams.geneId,
    urlParams.modelId,
    urlParams.cancerType,
    urlParams.scoreMin,
    urlParams.scoreMax,
    urlParams.excludePanCancerGenes,
  ];

  const [containerWidth, setContainerWidth] = useState(750);
  const [xDomain, setXDomain] = useState(null);

  const {attributeToPlot, highlight} = props;

  const resize = () => setContainerWidth(container.current.offsetWidth);

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  const sortData = data => {
    const dataSorted = sortBy(data, rec => rec[attributeToPlot]);
    return dataSorted.map((d, i) => ({...d, index: i}));
  };

  return (
    <div ref={container}>
      <FetchData
        endpoint={fetchCrisprData}
        params={params}
        deps={deps}
      >
        {data => {
          const sortedData = sortData(data.data);
          return (
            <div>
              <FitnessBrush
                data={sortedData}
                width={containerWidth - config.marginLeft}
                onRangeChanged={setXDomain}
                marginLeft={config.marginLeft}
                {...props}
              />
              <div style={{position: 'relative'}}>
                {highlight && (<FitnessTooltip
                    xDomain={xDomain}
                    data={sortedData}
                    width={containerWidth}
                    height={config.height}
                    marginLeft={config.marginLeft}
                    marginTop={config.marginTop}
                    {...props}
                  />
                )}
                <FitnessCanvasPlot
                  data={sortedData}
                  width={containerWidth}
                  height={config.height}
                  significantField={config.significantField}
                  xDomain={xDomain}
                  marginLeft={config.marginLeft}
                  marginTop={config.marginTop}
                  {...props}
                />
              </div>
            </div>
          );
        }}
      </FetchData>
    </div>
  );
}

export default withRouter(FitnessPlot);


function FitnessBrush({width, data, attributeToPlot, onRangeChanged, marginLeft}) {
  const height = 50;

  const brushLineElement = useRef(null);
  const [minRange, setMinRange] = useState(0);
  const [maxRange, setMaxRange] = useState(data.length);

  const yExtent = d3.extent(
    data,
    d => d[attributeToPlot],
  );
  const xScaleBrush = d3.scaleLinear()
    .range([0, width])
    .domain([0, data.length]);

  const yScaleBrush = d3.scaleLinear()
    .range([0, height])
    .domain([yExtent[1], yExtent[0]]);

  const brushLine = d3
    .line()
    .curve(d3.curveMonotoneX)
    .x(d => xScaleBrush(d.index))
    .y(d => yScaleBrush(d[attributeToPlot]));

  useEffect(() => {
    d3.select(brushLineElement.current)
      .datum(data)
      .attr('d', brushLine);
  });

  // With this code commented out, the brush does not reset the range after the data has changed (for example when filtering by tissue or score range)
  // This may result in a bit weird behaviour when filtering by tissue and then removing the filtering.
  // Uncomment this block to reset the brushing range with every data change (although that may come with other weirdness)
  // Now uncommented!! (comment out to reverse)
  useEffect(() => {
    setMinRange(0);
    setMaxRange(data.length);
    onRangeChanged([0, data.length]);
  }, [onRangeChanged, data.length]);

  const onChange = newRange => {
    setMinRange(newRange[0]);
    setMaxRange(newRange[1]);
    onRangeChanged(newRange)
  };

  return (
    <div
      style={{marginLeft: `${marginLeft}px`}}
    >
      <svg
        height={height}
        width={width}
      >
        <rect
          x={xScaleBrush(minRange)}
          y={0}
          width={xScaleBrush(maxRange) - xScaleBrush(minRange)}
          height={height}
          fill='#EEEEEE'
        />
        <path
          ref={brushLineElement}
          style={{
            fill: 'none',
            stroke: '#5ba633',
            strokeWidth: '2px',
          }}
        />
      </svg>
      <Range
        style={{
          width,
        }}
        allowCross={false}
        min={0}
        max={data.length}
        step={1}
        defaultValue={[0, data.length]}
        value={[minRange, maxRange]}
        onChange={onChange}
      />
    </div>
  );
}


function FitnessTooltip(props) {
  const {
    highlight: nodeData,
    data,
    xDomain,
    attributeToPlot,
    width,
    height,
    marginLeft,
    marginTop,
  } = props;

  const rowToNode = row => findIndex(
    data,
    d => {
      return (d.model.names[0] === row.modelName) && (d.gene.id === row.geneId);
    },
  );

  const index = nodeData.index || rowToNode(nodeData);

  const {
    geneSymbol,
    modelName,
    cancer_type,
    fc_clean,
    bf_scaled,
    source,
  } = nodeData;

  const yExtent = d3.extent(
    data,
    d => d[attributeToPlot],
  );
  const xScale = d3.scaleLinear()
    .range([marginLeft, width])
    .domain(xDomain || [0, data.length]);

  const yScale = d3.scaleLinear()
    .range([0, height - marginTop])
    .domain([yExtent[1], yExtent[0]]);

  const fitnessValue =
    attributeToPlot === 'fc_clean' ?
      fc_clean :
      bf_scaled;

  const x = xScale(index);
  const y = yScale(fitnessValue);

  const backgroundColor = bf_scaled < 0 ? colorSignificantBg : colorInsignificantBg;

  return (
    <Tooltip
      x={x}
      y={y}
      width={width}
      height={height}
    >
      Gene: <b>{geneSymbol}</b><br/>
      Model: <b>{modelName}</b> ({cancer_type})<br/>
      Corrected fold change:<b>{fc_clean}</b><br/>
      Loss of fitness score:<b><span style={{padding: '0.4em 0.2em', backgroundColor}}>{bf_scaled}</span></b><br />
      Source:<b>{source}</b>
    </Tooltip>
  );
}

function FitnessCanvasPlot(props) {
  const {
    data,
    width,
    height,
    colorBy,
    attributeToPlot,
    significantField,
    xDomain,
    onHighlight,
    highlightCancerType,
    marginLeft,
    marginTop,
    xAxisLabel,
  } = props;

  const nodeRadius = 3;

  const canvasPlot = useRef(null);
  const eventsContainer = useRef(null);
  const xAxisElement = useRef(null);
  const yAxisElement = useRef(null);

  const yExtent = d3.extent(
    data,
    d => d[attributeToPlot],
  );

  const xScale = React.useCallback(
    d3.scaleLinear()
      .range([marginLeft, width])
      .domain(xDomain || [0, data.length]),
    [marginLeft, width, xDomain, data.length]
  );

  const yScale = React.useCallback(
    d3.scaleLinear()
      .range([0, height - marginTop])
      .domain([yExtent[1], yExtent[0]]),
    [height, marginTop, yExtent[0], yExtent[1]]
  );

  const quadTree = d3.quadtree(
    data,
    d => d.index,
    d => d[attributeToPlot]
  );

  useEffect(() => {
    const ctx = canvasPlot.current.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    ctx.save();

    data.forEach(dataPoint => {
      if (highlightCancerType && dataPoint.model.sample.cancer_type.name !== highlightCancerType) {
        return;
      }

      const dataPointColor = colorBy === 'cancerType' ?
        cancerTypeColorDict[dataPoint.model.sample.cancer_type.name] : (
          dataPoint[significantField] < 0 ? significantNodeColor : insignificantNodeColor
        );

      const x = xScale(dataPoint.index);
      const y = yScale(dataPoint[attributeToPlot]);

      if (x >= marginLeft) {
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          nodeRadius,
          0,
          2 * Math.PI,
          false,
        );
        ctx.fillStyle = dataPointColor;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = dataPointColor;
        ctx.stroke();
      }
    });

  }, [
    data,
    attributeToPlot,
    xDomain,
    highlightCancerType,
    colorBy,
    width,
    height,
    marginLeft,
    significantField,
    xScale,
    yScale,
  ]);

  const onMouseMove = () => {
    const ev = d3.event;
    if (ev) {
      const xMouse = xScale.invert(ev.offsetX + marginLeft);
      const yMouse = yScale.invert(ev.offsetY);

      const closest = quadTree.find(xMouse, yMouse);

      onHighlight({
        geneId: closest.gene.id,
        modelName: closest.model.names[0],
        bf_scaled: closest.bf_scaled,
        fc_clean: closest.fc_clean,
        geneSymbol: closest.gene.symbol,
        cancer_type: closest.model.sample.cancer_type.name,
        tissue: closest.model.sample.tissue.name,
        index: closest.index,
        source: closest.source,
      });
    }
  };

  const onMouseOut = () => {
    onHighlight(null);
  };

  useEffect(() => {
    d3.select(eventsContainer.current)
      .on('mousemove', onMouseMove)
      .on('mouseout', onMouseOut);
  });

  useEffect(() => {
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('.0f'));
    const yAxis = d3.axisLeft(yScale);
    const axisLeft = d3
      .select(yAxisElement.current);
    axisLeft.call(yAxis);

    const axisBottom = d3
      .select(xAxisElement.current);
    axisBottom.call(xAxis);
  });

  const yAxisLabel = attributeToPlot === 'fc_clean' ?
    FC_CLEAN_LABEL :
    LOSS_OF_FITNESS_SCORE_LABEL;

  const zeroY = yScale(0);

  return (
    <div>
      <canvas
        ref={canvasPlot}
        className='topLevelContainer leaveSpace'
        height={height}
        width={width}
      />
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {attributeToPlot === 'bf_scaled' && (
          <line x1={marginLeft} x2={width} y1={zeroY} y2={zeroY} strokeDasharray='5,5' stroke={insignificantNodeColor}/>
        )}
        <g
          ref={xAxisElement}
          transform={`translate(0, ${height - marginTop})`}
        />
        <g
          ref={yAxisElement}
          transform={`translate(${marginLeft}, 0)`}
        />

        <text
          x={0}
          y={0}
          textAnchor='middle'
          transform={`translate(${(width / 2) + (marginLeft / 2)}, ${height - 10})`}
        >
          {xAxisLabel}
        </text>

        <text
          x={0}
          y={0}
          textAnchor='middle'
          transform={`translate(15, ${(height / 2) - (marginTop / 2)}) rotate(-90)`}
        >
          {yAxisLabel}
        </text>

      </svg>
      <div
        ref={eventsContainer}
        style={{
          position: 'absolute',
          top: 0,
          left: marginLeft,
          width: width - marginLeft,
          height: height - marginTop,
        }}
        onMouseMove={onMouseMove}
      />
    </div>
  );
}
