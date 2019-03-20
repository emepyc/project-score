import React, {useState, useEffect, useRef, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
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
    nodeRadius: 3,
    significantField: 'bf_scaled',
  };

  const [data, setData] = useState([]);
  const [urlParams] = useUrlParams(props);
  const [loading, setLoading] = useState(false);
  const [containerWidth] = useState(750);

  const {attributeToPlot} = props;

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
          <EssentialitiesBrush/>
          <EssentialitiesCanvasPlot
            data={data}
            width={containerWidth - config.marginLeft}
            height={config.height - config.marginTop}
            significantField={config.significantField}
            attributeToPlot={attributeToPlot}
            nodeRadius={config.nodeRadius}
            {...props}
          />
        </Fragment>
      )}
    </Spinner>
  );
}

export default withRouter(EssentialitiesPlot);


function EssentialitiesCanvasPlot(props) {
  const {
    data,
    width,
    height,
    colorBy,
    attributeToPlot,
    significantField,
    nodeRadius,
  } = props;

  const insignificantNodeColor = '#758E4F';
  const significantNodeColor = '#EA5156';

  const canvasPlot = useRef(null);

  useEffect(() => {
    const yExtent = d3.extent(
      data,
      d => d[attributeToPlot],
    );
    const xScale = d3.scaleLinear()
      .range([0, width])
      .domain([0, data.length]);

    const yScale = d3.scaleLinear()
      .range([0, height])
      .domain([yExtent[1], yExtent[0]]);

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

  }, [data.length]);

  return (
    <div className='essentialitiesPlotContainer'>
      <canvas
        ref={canvasPlot}
        className='topLevelContainer leaveSpace'
        height={height}
        width={width}
      />
    </div>
  );
}
