import React, {Fragment, useState, useEffect, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import sortBy from 'lodash.sortby';
import {fetchCrisprData} from '../../api';
import useUrlParams from '../useUrlParams';
import * as d3 from 'd3';

import './essentialitiesPlot.scss';

const LOSS_OF_FITNESS_SCORE_LABEL = 'Loss of fitness score';
const FC_CLEAN_LABEL = 'Corrected log fold change';
const significantField = 'bf_scaled';


function plotOnCanvas(containerWidth, attributeToPlot, config, refs, xScale, yScale, data) {
  const ctx = refs.plotCanvas.current.getContext('2d');

  ctx.clearRect(0, 0, containerWidth - config.marginLeft, config.height - config.marginTop);
  ctx.save();
  for (let i = 0; i < data.length; i++) {
    const dataPoint = data[i];
    ctx.beginPath();
    ctx.arc(
      xScale(dataPoint.index),
      yScale(dataPoint[attributeToPlot]),
      config.nodeRadius,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle =
      dataPoint[significantField] < 0
        ? config.significantNodeColor
        : config.insignificantNodeColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle =
      dataPoint[significantField] <= 0
        ? config.significantNodeColor
        : config.insignificantNodeColor;
    ctx.stroke();
  }


  // Axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('.0f'));
  const yAxis = d3.axisLeft(yScale);

  const axisLeft = d3
    .select(refs.plotAxisLeft.current);
  axisLeft.call(yAxis);

  const axisBottom = d3
    .select(refs.plotAxisBottom.current)
    .attr('transform', `translate(${config.marginLeft},${config.height - config.marginTop})`);
  axisBottom.call(xAxis);
}


function plotEssentialities(refs, attributeToPlot, data, config, containerWidth) {
  const dataSorted = sortBy(data, rec => rec[attributeToPlot]);
  const dataSortedWithIndex = dataSorted.map((d, i) => ({...d, index: i}));

  const quadTree = d3.quadtree(
    dataSortedWithIndex,
    d => d.index,
    d => d[attributeToPlot]
  );

  const showTooltip = (x, y, el, msg) => {
    d3.select(el)
      .html(msg)
      .style('left', `${x}px`)
      .style(`top`, `${y}px`)
      .style(`display`, 'block')
      .style('background-color', 'white');
  };

  const hideTooltip = el => {
    d3.select(el).style('display', 'none');
  };

  const highlightNode = nodeData => {
    const [
      gene,
      model,
      fc_clean,
      bf_scaled,
      pos,
    ] = nodeData;
    const essentialityValue =
      attributeToPlot === 'fc_clean' ?
        fc_clean :
        bf_scaled;

    const guideX = refs.plotXguide.current;
    const guideY = refs.plotYguide.current;

    const guideXpos = xScale(pos) + config.marginLeft;
    const guideYpos = yScale(essentialityValue);

    guideX.setAttribute('x1', guideXpos);
    guideX.setAttribute('x2', guideXpos);
    guideX.style.display = 'block';
    guideY.setAttribute('y1', guideYpos);
    guideY.setAttribute('y2', guideYpos);
    guideY.style.display = 'block';

    const msgTooltip = `Gene: <b>${gene}</b><br/>Model: <b>${model}</b><br/>Corrected log fold change:<b>${fc_clean}</b><br/>Loss of fitness score:<b>${bf_scaled}</b>`;
    showTooltip(guideXpos, guideYpos, refs.tooltip.current, msgTooltip);
  };

  const mouseMoveOnCanvas = () => {
    const ev = d3.event;
    const xClicked = xScale.invert(ev.offsetX - config.marginLeft);
    const yClicked = yScale.invert(ev.offsetY);

    const closest = quadTree.find(xClicked, yClicked);
    const closestData = [
      closest.bf_scaled,
      closest.model.names[0],
      closest.fc_clean,
      closest.bf_scaled,
      closest.index,
    ];

    highlightNode(closestData);
  };

  const mouseOutOnCanvas = () => {
    const guideX = refs.plotXguide.current;
    const guideY = refs.plotYguide.current;
    guideX.style.display = 'none';
    guideY.style.display = 'none';

    hideTooltip(refs.tooltip.current);
  };

  d3
    .select(refs.plotEventsContainer.current)
    .on('mousemove', mouseMoveOnCanvas)
    .on('mouseout', mouseOutOnCanvas);

  // Scales
  const yExtent = d3.extent(
    dataSortedWithIndex,
    d => d[attributeToPlot]
  );

  const xScale = d3
    .scaleLinear()
    .range([0, containerWidth - config.marginLeft])
    .domain([0, dataSortedWithIndex.length]);

  const yScale = d3
    .scaleLinear()
    .range([0, config.height - config.marginTop])
    .domain([yExtent[1], yExtent[0]]);

  const xScaleBrush = d3
    .scaleLinear()
    .range([0, containerWidth - config.marginLeft])
    .domain([0, dataSortedWithIndex.length]);

  const yScaleBrush = d3
    .scaleLinear()
    .range([0, config.brushHeight])
    .domain([yExtent[1], yExtent[0]]);

  // Brush
  const brushLine = d3
    .line()
    .curve(d3.curveMonotoneX)
    .x(d => xScaleBrush(d.index))
    .y(d => yScaleBrush(d[attributeToPlot]));

  d3
    .select(refs.plotBrushContainer.current)
    .selectAll('.handle--custom')
    .remove();

  const handle = d3
    .select(refs.plotBrushContainer.current)
    .selectAll('.handle--custom')
    .data([{type: 'w'}, {type: 'e'}])
    .enter()
    .append('path')
    .attr('class', 'handle--custom')
    .attr('fill', '#AAAAAA')
    .attr('fill-opacity', 0.8)
    .attr('stroke', '#000000')
    .attr('stroke-width', 1.5)
    .attr('cursor', 'ew-resize')
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(config.brushOffset)
      .startAngle(0)
      .endAngle((d, i) => i ? Math.PI : -Math.PI)
    );

  d3
    .select(refs.plotBrushContainer.current)
    .select('rect.selection')
    .attr('fill', '#AAAAAA');

  // create brush function redraw scatterplot with selection
  const brushed = () => {
    const selection = d3.event.selection;
    xScale.domain(selection.map(xScaleBrush.invert, xScaleBrush));
    handle.attr(
      'transform', (d, i) =>
        'translate(' + selection[i] + ',' + config.brushHeight / 2 + ')'
    );
    // this.props.selectRow(null);
    plotOnCanvas(containerWidth, attributeToPlot, config, refs, xScale, yScale, dataSortedWithIndex);
  };

  const brush = d3
    .brushX()
    .extent([[0, 0], [containerWidth - config.marginLeft, config.brushHeight]])
    .on('brush', brushed);

  d3
    .select(refs.plotBrushLine.current)
    .datum(dataSortedWithIndex)
    .attr('class', 'line')
    .attr('d', brushLine);

  d3
    .select(refs.plotBrushContainer.current)
    .call(brush)
    .call(brush.move, xScale.range());

  handle.raise();

  plotOnCanvas(containerWidth, attributeToPlot, config, refs, xScale, yScale, dataSortedWithIndex);
}


function essentialitiesPlot(props) {
  const contextPage = props.match.params.geneId ? 'gene' : 'model';
  const config = {
    height: 300,
    marginTop: 50,
    marginLeft: 50,
    brushHeight: 40,
    brushOffset: 10,
    insignificantNodeColor: '#FFCC00',
    significantNodeColor: '#758E4F',
    nodeRadius: 3,
    ctx: null,
    xScale: null,
    yScale: null,
    xAxis: null,
  };

  const refs = {
    plotContainer: useRef(null),
    plotBrush: useRef(null),
    plotBrushLine: useRef(null),
    plotBrushContainer: useRef(null),
    plotCanvas: useRef(null),
    plotSvg: useRef(null),
    plotEventsContainer: useRef(null),
    plotXguide: useRef(null),
    plotYguide: useRef(null),
    plotAxisBottom: useRef(null),
    plotAxisLeft: useRef(null),
    xAxisLabel: useRef(null),
    yAxisLabel: useRef(null),
    tooltip: useRef(null),
  };


  const resize = () => {
    const container = refs.plotContainer.current;
    setContainerWidth(container.offsetWidth)
  };

  const [attributeToPlot, setAttributeToPlot] = useState('fc_clean');
  const [data, setData] = useState([]);
  const [containerWidth, setContainerWidth] = useState(800);
  const [urlParams] = useUrlParams(props);

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
      scoreRange: urlParams.score,
      pageSize: 0,
    };

    fetchCrisprData(params)
      .then(resp => setData(resp.data))
  }, [urlParams.geneId, urlParams.modelId, urlParams.tissue, JSON.stringify(urlParams.score)]);

  const yAxisLabel = attributeToPlot === 'fc_clean' ?
    FC_CLEAN_LABEL :
    LOSS_OF_FITNESS_SCORE_LABEL;

  const xAxisLabel = contextPage === 'gene' ? 'Cell lines' : 'Genes';

  useEffect(() => {
    if (data.length) {
      plotEssentialities(refs, attributeToPlot, data, config, containerWidth);
    }
  });

  return (
    <Fragment>
      <div
        style={{
          display: 'inline-block',
          float: 'right',
          marginLeft: '10px',
          marginBottom: '10px'
        }}
      >
      </div>

      <div
        ref={refs.plotContainer}
        id='plot-container'
      >
        {/* Brush */}
        <svg
          className='brush-plot'
          ref={refs.plotBrush}
          style={{paddingLeft: '25px'}}
          height={config.brushHeight}
          width={containerWidth + config.brushOffset * 2 + 1}
        >
          <path
            transform="translate(25, 0)"
            ref={refs.plotBrushLine}
            className="line"
            style={{
              fill: 'none',
              stroke: '#003F83',
              strokeWidth: '2px'
            }}
          />
          <g
            transform="translate(25, 0)"
            ref={refs.plotBrushContainer}
            className="brush"
          />
        </svg>


        <div
          className='essentialities-plot-container'
        >
          <canvas
            ref={refs.plotCanvas}
            className='toplevel-container leave-space'
            height={config.height - config.marginTop}
            width={containerWidth - config.marginLeft}
          />

          <svg
            ref={refs.plotSvg}
            className='toplevel-container'
            height={config.height}
            width={containerWidth}
          >

            <rect
              ref={refs.plotEventsContainer}
              x={config.marginLeft}
              y={0}
              width={containerWidth - config.marginLeft}
              height={config.height - config.marginTop}
            />

            <line
              ref={refs.plotXguide}
              className='cross'
              x1={0}
              x2={0}
              y1={0}
              y2={config.height - config.marginTop}
              style={{
                display: 'none',
                stroke: '#eeeeee',
                strokeWidth: '2px',
                pointerEvents: 'none'
              }}
            />

            <line
              ref={refs.plotYguide}
              className='cross'
              x1={config.marginLeft}
              x2={containerWidth}
              y1={0}
              y2={0}
              style={{
                display: 'none',
                stroke: '#eeeeee',
                strokeWidth: '2px',
                pointerEvents: 'none'
              }}
            />

            <g
              ref={refs.plotAxisBottom}
            />

            <g
              ref={refs.plotAxisLeft}
              transform={`translate(${config.marginLeft}, 0)`}
            />

            <text
              ref={refs.xAxisLabel}
              x={0}
              y={0}
              textAnchor='middle'
              transform={`translate(${containerWidth / 2}, ${config.height - 10})`}
            >
              {xAxisLabel}
            </text>

            <text
              ref={refs.yAxisLabel}
              x={0}
              y={0}
              textAnchor='middle'
              transform={`translate(15, ${config.height / 2}) rotate(-90)`}
            >
              {yAxisLabel}
            </text>
          </svg>

          <div
            ref={refs.tooltip}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '3px',
              boxShadow: 'gray 0px 1px 2px',
              display: 'none',
              padding: '0.3rem 0.5rem',
              pointerEvents: 'none',
              position: 'absolute',
              whiteSpace: 'nowrap',
              zIndex: 100
            }}
          />

        </div>
      </div>
    </Fragment>
  )
}

export default withRouter(essentialitiesPlot);
