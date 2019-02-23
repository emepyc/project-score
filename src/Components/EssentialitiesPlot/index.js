import React, {Fragment, useState, useEffect, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import {fetchCrisprData} from '../../api';
import useUrlParams from '../useUrlParams';

import './essentialitiesPlot.scss';

const LOSS_OF_FITNESS_SCORE_LABEL = 'Loss of fitness score';
const FC_CLEAN_LABEL = 'Corrected log fold change';

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

  const [attributeToPlot, setAttributeToPlot] = useState('fc_clean');
  const [data, setData] = useState([]);
  const [containerWidth, setContainerWidth] = useState(500);

  const [urlParams] = useUrlParams(props);

  useEffect(() => {
    const params = {
      geneId: urlParams.geneId,
      modelId: urlParams.modelId,
      tissue: urlParams.tissue,
      scoreRange: urlParams.score,
      pageSize: 0,
    };

    console.log('params in essentiality plot...');
    console.log(params);

    fetchCrisprData(params)
      .then(resp => {
        console.log(resp);
      })
  }, [urlParams.geneId, urlParams.modelId, urlParams.tissue, JSON.stringify(urlParams.score)]);

  const essentialitiesPlotContainerRef = useRef(null);
  const essentialitiesPlotCanvasRef = useRef(null);
  const essentialitiesPlotSvgRef = useRef(null);
  const essentialitiesPlotEventsContainerRef = useRef(null);
  const essentialitiesPlotXlineRef = useRef(null);
  const essentialitiesPlotYlineRef = useRef(null);
  const essentialitiesPlotAxisBottomRef = useRef(null);
  const essentialitiesPlotAxisLeftRef = useRef(null);
  const xAxisLabelRef = useRef(null);
  const yAxisLabelRef = useRef(null);

  const yAxisLabel = attributeToPlot === 'fc_clean' ?
    FC_CLEAN_LABEL :
    LOSS_OF_FITNESS_SCORE_LABEL;

  const xAxisLabel = contextPage === 'gene' ? 'Cell lines' : 'Genes';

  if (!data.length) {
    return (
      <div>
        No data
      </div>
    );
  }

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
        className='essentialities-plot-container'
        ref={essentialitiesPlotContainerRef}
      >
        <canvas
          ref={essentialitiesPlotCanvasRef}
          className="star-plot-toplevel-container leave-space"
          height={config.height - config.marginTop}
          width={containerWidth - config.marginLeft}
        />

        <svg
          ref={essentialitiesPlotSvgRef}
          className='star-plot-toplevel-container top'
          height={config.height}
          width={containerWidth}
        >

          <rect
            ref={essentialitiesPlotEventsContainerRef}
            x={config.marginLeft}
            y={0}
            width={containerWidth - config.marginLeft}
            height={config.height - config.marginTop}
          />

          <line
            ref={essentialitiesPlotXlineRef}
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
            ref={essentialitiesPlotYlineRef}
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
            ref={essentialitiesPlotAxisBottomRef}
          />

          <g
            ref={essentialitiesPlotAxisLeftRef}
            transform={`translate(${config.marginLeft}, 0)`}
          />

          <text
            ref={xAxisLabelRef}
            x={0}
            y={0}
            textAnchor='middle'
            transform={`translate(${containerWidth / 2}, ${config.height - 10}`}
          >
            {xAxisLabel}
          </text>

          <text
            ref={yAxisLabelRef}
            x={0}
            y={0}
            textAnchor='middle'
            transform={`translate(15, ${config.height / 2}) rotate(-90)`}
          >
            {yAxisLabel}
          </text>
        </svg>

      </div>
    </Fragment>
  )
}

export default withRouter(essentialitiesPlot);
