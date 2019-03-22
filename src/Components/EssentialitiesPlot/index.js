import React, {useCallback, useState, useEffect, useRef, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import findIndex from 'lodash.findindex';
import {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';
import Spinner from '../Spinner';
import useUrlParams from '../useUrlParams';
import {fetchCrisprData} from '../../api';
import colors from '../../colors';

import './essentialitiesPlot.scss';
import * as d3 from "d3";
import sortBy from "lodash.sortby";

const LOSS_OF_FITNESS_SCORE_LABEL = 'Loss of fitness score';
const FC_CLEAN_LABEL = 'Corrected log fold change';

function EssentialitiesPlot(props) {
  const config = {
    height: 300,
    marginTop: 50,
    marginLeft: 50,
    significantField: 'bf_scaled',
  };

  const container = useRef(null);

  const [data, setData] = useState([]);
  const [urlParams] = useUrlParams(props);
  const [loading, setLoading] = useState(false);
  const [containerWidth, setContainerWidth] = useState(750);
  const [xDomain, setXDomain] = useState(null);

  const {attributeToPlot, highlight} = props;

  const resize = () => setContainerWidth(container.current.offsetWidth);

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);


  useEffect(() => {
    const params = {
      geneId: urlParams.geneId,
      modelId: urlParams.modelId,
      tissue: urlParams.tissue,
      scoreMin: urlParams.scoreMin,
      scoreMax: urlParams.scoreMax,
      pageSize: 0,
    };

    setLoading(true);

    fetchCrisprData(params)
      .then(resp => {
        setLoading(false);
        const data = resp.data;
        const dataSorted = sortBy(data, rec => rec[attributeToPlot]);
        const dataSortedWithIndex = dataSorted.map((d, i) => ({...d, index: i}));

        setData(dataSortedWithIndex);
      });
  }, [urlParams.geneId, urlParams.modelId, urlParams.tissue, urlParams.scoreMin, urlParams.scoreMax]);

  return (
    <div ref={container}>
      <Spinner loading={loading}>
        {data.length && (
          <div>
            <EssentialitiesBrush
              data={data}
              width={containerWidth - config.marginLeft}
              onRangeChanged={setXDomain}
              marginLeft={config.marginLeft}
              {...props}
            />
            <div style={{position: 'relative'}}>
              {highlight && (<EssentialitiesTooltip
                  xDomain={xDomain}
                  data={data}
                  width={containerWidth}
                  height={config.height}
                  marginLeft={config.marginLeft}
                  marginTop={config.marginTop}
                  {...props}
                />
              )}
              <EssentialitiesCanvasPlot
                data={data}
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
        )}
      </Spinner>
    </div>
  );
}

export default withRouter(EssentialitiesPlot);


function EssentialitiesBrush({width, data, attributeToPlot, onRangeChanged, marginLeft}) {
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

  const onChange = useCallback(newRange => {
    setMinRange(newRange[0]);
    setMaxRange(newRange[1]);
    onRangeChanged(newRange)
  });

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
            stroke: '#003F83',
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
        onChange={onChange}
      />
    </div>
  );
}


function EssentialitiesTooltip(props) {
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
    tissue,
    fc_clean,
    bf_scaled,
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

  const essentialityValue =
    attributeToPlot === 'fc_clean' ?
      fc_clean :
      bf_scaled;

  const x = xScale(index);
  const y = yScale(essentialityValue);

  return (
    <Fragment>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '3px',
          boxShadow: 'gray 0px 1px 2px',
          padding: '0.3rem 0.5rem',
          pointerEvents: 'none',
          position: 'absolute',
          whiteSpace: 'nowrap',
          zIndex: 100,
          left: `${x}px`,
          top: `${y}px`,
          display: 'block',
        }}
      >
        Gene: <b>{geneSymbol}</b><br/>
        Model: <b>{modelName}</b> ({tissue})<br/>
        Corrected log fold change:<b>{fc_clean}</b><br/>
        Loss of fitness score:<b>{bf_scaled}</b>
      </div>
      <div
        style={{
          border: '1px solid #EEEEEE',
          width: '0.5px',
          height: height,
          position: 'absolute',
          top: 0,
          left: x,
        }}
      />
      <div
        style={{
          border: '1px solid #EEEEEE',
          width: width,
          height: '0.5px',
          position: 'absolute',
          top: y,
          left: 0,
        }}
      />
    </Fragment>

  );
}

function EssentialitiesCanvasPlot(props) {
  const {
    data,
    width,
    height,
    colorBy,
    attributeToPlot,
    significantField,
    xDomain,
    onHighlight,
    highlightTissue,
    marginLeft,
    marginTop,
    xAxisLabel,
  } = props;

  const insignificantNodeColor = '#758E4F';
  const significantNodeColor = '#EA5156';
  const nodeRadius = 3;

  const canvasPlot = useRef(null);
  const eventsContainer = useRef(null);
  const xAxisElement = useRef(null);
  const yAxisElement = useRef(null);

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
      if (highlightTissue && dataPoint.model.sample.tissue.name !== highlightTissue) {
        return;
      }

      const dataPointColor = colorBy === 'tissue' ?
        colors[dataPoint.model.sample.tissue.name] : (
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

  }, [data.length, attributeToPlot, xDomain, highlightTissue, colorBy, width]);

  const onMouseMove = useCallback(() => {
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
        tissue: closest.model.sample.tissue.name,
        index: closest.index,
      });
    }
  });

  const onMouseOut = useCallback(() => {
    onHighlight(null);
  });

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
    // .attr('transform', `translate(${config.marginLeft},${config.height - config.marginTop})`);
    axisBottom.call(xAxis);
  });

  const yAxisLabel = attributeToPlot === 'fc_clean' ?
    FC_CLEAN_LABEL :
    LOSS_OF_FITNESS_SCORE_LABEL;


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
