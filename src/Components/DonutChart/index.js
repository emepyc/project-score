import * as d3 from 'd3';
import React, {useEffect, useState, useRef} from 'react';
import {Group} from '@vx/group';
import {Pie, Line} from '@vx/shape'
import {Point} from '@vx/point';
import {withRouter} from 'react-router-dom';

import {fetchTissues} from '../../api';
import Spinner from '../Spinner';
import Error from '../Error';
import useFetchData from "../useFetchData";
import colors from '../../colors';

import './donutChart.scss';

const donutChartSideOffset = 150;

const margins = {
  top: 50,
  left: donutChartSideOffset,
  right: donutChartSideOffset,
  bottom: 0,
};

function Label({radius, arc, x, y, maxX, center, children}) {
  const midAngle = (arc.endAngle + arc.startAngle) / 2;
  const xDiagonal = (radius + 20) * Math.cos(midAngle - Math.PI / 2);
  const yDiagonal = (radius + 20) * Math.sin(midAngle - Math.PI / 2);
  const xHorizontal = xDiagonal < 0 ? xDiagonal - 10 : xDiagonal + 10;

  if (arc.endAngle - arc.startAngle < 0.1) {
    return <span/>;
  }

  const textToShow = children.length > 20 ? `${children.substring(0, 17)}...` : children;

  const labelX = xHorizontal < 0 ? xHorizontal - 3 : xHorizontal + 3;

  return (
    <React.Fragment>
      <Line
        stroke={colors[arc.data.tissue]}
        from={new Point({x: x, y: y})}
        to={new Point({x: xDiagonal, y: yDiagonal})}
      />
      <Line
        stroke={colors[arc.data.tissue]}
        from={new Point({x: xDiagonal, y: yDiagonal})}
        to={new Point({x: xHorizontal, y: yDiagonal})}
      />
      <text
        fill={d3.rgb(colors[arc.data.tissue]).darker()}
        x={labelX}
        y={yDiagonal}
        fontSize="0.9em"
        alignmentBaseline="middle"
        textAnchor={xDiagonal < 0 ? 'end' : 'start'}
      >
        {textToShow}
      </text>
    </React.Fragment>
  );
}

function DonutChart({history}) {
  const [tissuesResponse, loading, error] = useFetchData(
    () => fetchTissues(),
    [],
  );

  const [tissues, setTissues] = useState([]);
  const [containerWidth, setContainerWidth] = useState(500);
  const [containerHeight, setContainerHeight] = useState(500);

  const explanationMessageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (tissuesResponse) {
      setTissues(tissuesResponse);
    }
  }, [tissuesResponse]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      setContainerHeight(containerRef.current.offsetWidth - 150);
    }
  }, [containerRef.current]);

  const handleMouseOverBar = (event, tissueData) => {
    const explanationElement = explanationMessageRef.current;
    const containerElement = containerRef.current;

    explanationElement.innerHTML = `${tissueData.tissue}<br /><strong>${
      tissueData.counts
      }</strong> cell line${tissueData.counts === 1 ? '' : 's'}`;

    // style of slices
    const slices = d3.select(containerElement).selectAll('path');
    slices.each(function () {
      this.parentNode.classList.add('faded');
    });
    event.target.parentNode.classList.remove('faded');
  };

  const handleMouseOut = () => d3
    .select(containerRef.current)
    .selectAll('path')
    .each(function () {
      this.parentNode.classList.remove('faded');
    });

  const radius = (containerWidth - (margins.left + margins.right)) / 2;

  const gotoTable = (data) => history.push(`/table?tissue=${data.id}`);

  if (error !== null) {
    return (
      <Error
        message="Error loading data"
      />
    )
  }

  return (
    <Spinner
      style={{backgroundColor: '#FAFAFA'}}
      loading={loading}
    >
      <div ref={containerRef} style={{position: 'relative'}}>
        <div
          id="explanation"
          className="my-auto"
          style={{
            top: `${radius + radius * 0.30}px`,
            left: `${radius + donutChartSideOffset - radius * 1.5 / 2}px`,
            borderRadius: `${radius * 1.5 / 2}`,
            width: `${radius * 1.5}px`
          }}
        >
          <span ref={explanationMessageRef} className="reset"/>
        </div>

        <svg
          className='donutChart'
          width={containerWidth}
          height={containerHeight - margins.top}
        >
          <Group
            top={radius + margins.top}
            left={radius + margins.left}
          >
            <Pie
              data={tissues}
              pieValue={d => d.counts}
              outerRadius={radius}
              innerRadius={radius - 20}
              cornerRadius={0}
              padAngle={0}
            >
              {pie => {
                return pie.arcs.map((arc, i) => {
                  const color = colors[arc.data.tissue];
                  const [centroidX, centroidY] = pie.path.centroid(arc);
                  return (
                    <g key={`tissue-${arc.data.id}-${i}`}>
                      <path
                        style={{cursor: 'pointer'}}
                        d={pie.path(arc)}
                        fill={color}
                        onMouseOver={event => handleMouseOverBar(event, arc.data)}
                        onMouseOut={handleMouseOut}
                        onClick={() => gotoTable(arc.data)}
                      />
                      <Label
                        radius={radius}
                        arc={arc}
                        x={centroidX}
                        y={centroidY}
                        maxX={containerWidth}
                        center={radius + margins.left}
                      >
                        {arc.data.tissue}
                      </Label>
                    </g>
                  );
                })
              }}
            </Pie>
          </Group>
        </svg>
      </div>
    </Spinner>
  )
}

export default withRouter(DonutChart);
