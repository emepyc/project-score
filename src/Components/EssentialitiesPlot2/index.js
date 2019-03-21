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

function EssentialitiesPlot(props) {
  const config = {
    height: 300,
    marginTop: 50,
    marginLeft: 50,
    significantField: 'bf_scaled',
  };

  const [data, setData] = useState([]);
  const [urlParams] = useUrlParams(props);
  const [loading, setLoading] = useState(false);
  const [containerWidth] = useState(750);
  const [xDomain, setXDomain] = useState(null);

  const {attributeToPlot, highlight} = props;

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
    <Spinner loading={loading}>
      {data.length && (
        <Fragment>
          <EssentialitiesBrush
            data={data}
            width={containerWidth - config.marginLeft}
            attributeToPlot={attributeToPlot}
            onRangeChanged={setXDomain}
          />
          <div style={{position: 'relative'}}>
            {highlight && (<EssentialitiesTooltip
                highlight={highlight}
                attributeToPlot={attributeToPlot}
                xDomain={xDomain}
                data={data}
                width={containerWidth - config.marginLeft}
                height={config.height - config.marginTop}
              />
            )}
            <EssentialitiesCanvasPlot
              data={data}
              width={containerWidth - config.marginLeft}
              height={config.height - config.marginTop}
              significantField={config.significantField}
              attributeToPlot={attributeToPlot}
              xDomain={xDomain}
              {...props}
            />
          </div>
        </Fragment>
      )}
    </Spinner>
  );
}

export default withRouter(EssentialitiesPlot);


function EssentialitiesBrush({width, data, attributeToPlot, onRangeChanged}) {
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
    <Fragment>
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
        allowCross={false}
        min={0}
        max={data.length}
        step={1}
        defaultValue={[0, data.length]}
        onChange={onChange}
      />
    </Fragment>
  );
}


function EssentialitiesTooltip(props) {
  const {
    highlight: nodeData,
    data,
    xDomain,
    attributeToPlot,
    width,
    height
  } = props;

  const rowToNode = row => findIndex(
    data,
    d => (d.model.id === row.modelId) && (d.gene.id === row.geneId),
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
    .range([0, width])
    .domain(xDomain || [0, data.length]);

  const yScale = d3.scaleLinear()
    .range([0, height])
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
  } = props;

  const insignificantNodeColor = '#758E4F';
  const significantNodeColor = '#EA5156';
  const nodeRadius = 3;

  const canvasPlot = useRef(null);
  const eventsContainer = useRef(null);

  const yExtent = d3.extent(
    data,
    d => d[attributeToPlot],
  );
  const xScale = d3.scaleLinear()
    .range([0, width])
    .domain(xDomain || [0, data.length]);

  const yScale = d3.scaleLinear()
    .range([0, height])
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
      const dataPointColor = colorBy === 'tissue' ?
        colors[dataPoint.model.sample.tissue.name] : (
          dataPoint[significantField] < 0 ? significantNodeColor : insignificantNodeColor
        );
      ctx.beginPath();
      ctx.arc(
        xScale(dataPoint.index),
        yScale(dataPoint[attributeToPlot]),
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
    });

  }, [data.length, attributeToPlot, xDomain]);

  const onMouseMove = useCallback(() => {
    const ev = d3.event;
      if (ev) {
      const xMouse = xScale.invert(ev.offsetX);
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

  useEffect(() => {
    d3.select(eventsContainer.current)
      .on('mousemove', onMouseMove);
  });

  return (
    <div>
      <canvas
        ref={canvasPlot}
        className='topLevelContainer leaveSpace'
        height={height}
        width={width}
      />
      <div
        ref={eventsContainer}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0.2,
          backgroundColor: 'cyan',
          width: width,
          height: height,
        }}
        onMouseMove={onMouseMove}
      />

    </div>
  );
}
