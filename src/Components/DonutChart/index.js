import * as d3 from 'd3';
import React, {useEffect, useState, useRef} from 'react';
import {Group} from '@vx/group';
import {Pie, Line} from '@vx/shape'
import {Point} from '@vx/point';
import {withRouter} from 'react-router-dom';

import {fetchCancerTypes} from '../../api';
import Spinner from '../Spinner';
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
        stroke={colors[arc.data.id]}
        from={new Point({x: x, y: y})}
        to={new Point({x: xDiagonal, y: yDiagonal})}
      />
      <Line
        stroke={colors[arc.data.id]}
        from={new Point({x: xDiagonal, y: yDiagonal})}
        to={new Point({x: xHorizontal, y: yDiagonal})}
      />
      <text
        fill={d3.rgb(colors[arc.data.id]).darker()}
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

function cycle(arr, step) {
    const left = arr.slice(step);
    const right = arr.slice(0, step);
    return [...left, ...right];
}

function DonutChart({history}) {
  const [cancerTypes, setCancerTypes] = useState([]);
  const [containerWidth, setContainerWidth] = useState(500);
  const [containerHeight, setContainerHeight] = useState(500);
  const [loadingTissues, setLoadingTissues] = useState(false);

  const explanationMessageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
      setLoadingTissues(true);
      fetchCancerTypes()
        .then(resp => {
          setLoadingTissues(false);
          const rotated = cycle(resp, 3);
          setCancerTypes(rotated);
        });
    }, []
  );

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      setContainerHeight(containerRef.current.offsetWidth - 150);
    }
  });

  const handleMouseOverBar = (event, cancerTypeData) => {
    const explanationElement = explanationMessageRef.current;
    const containerElement = containerRef.current;

    explanationElement.innerHTML = `${cancerTypeData.name}<br /><strong>${
      cancerTypeData.count
      }</strong> cell line${cancerTypeData.count === 1 ? '' : 's'}`;

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

  const gotoTable = (data) => history.push(`/table?cancerType=${data.id}`);

  return (
    <Spinner
      style={{backgroundColor: '#FAFAFA'}}
      loading={loadingTissues}
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
              data={cancerTypes}
              pieValue={d => d.count}
              outerRadius={radius}
              innerRadius={radius - 20}
              cornerRadius={0}
              padAngle={0}
              pieSortValues={(a, b) => 0}
            >
              {pie => {
                return pie.arcs.map((arc, i) => {
                  const color = colors[arc.data.id];
                  const [centroidX, centroidY] = pie.path.centroid(arc);
                  return (
                    <g key={`cancerType-${arc.data.id}-${i}`}>
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
                        {arc.data.name}
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
