import React, {useState} from 'react';
import {Pie} from '@vx/shape';
import {Group} from '@vx/group';
import {significantNodeColor as green, red} from '../../colors';

const margin = {
  top: 1,
  left: 1,
  right: 1,
  bottom: 1
};

const width = 100;
const height = 100;

const radius = 50;

export default function SignificantCountPlot({total, significant}) {
  return (
    <div className='text-center'>
      <svg
        width={width}
        height={height}
      >
        <Group
          top={height / 2 - margin.top}
          left={width / 2}
        >
          <Pie
            data={[
              {pos: 0, opacity: 1, number: significant, color: green},
              {pos: 1, opacity: 0.1, number: total - significant, color: green}
            ]}
            pieValue={d => d.number}
            pieSort={d => d.pos}
            outerRadius={radius - 10}
            innerRadius={radius - 20}
            padAngle={0}
          >
            {pie => {
              return pie.arcs.map((arc, index) => {
                return (
                  <g key={index}>
                    <path
                      d={pie.path(arc)}
                      fill={arc.data.color}
                      fillOpacity={arc.data.opacity}
                    />
                  </g>
                );
              })
            }}
          </Pie>
        </Group>
        <text
          x={radius}
          y={radius}
          alignmentBaseline={'middle'}
          textAnchor={'middle'}
        >
          {~~(significant * 100 / total)}%
        </text>
      </svg>
    </div>
  )
}

export function BinaryCountPlot({count1, count2}) {
  return (
    <div className='text-center'>
      <svg width={width} height={height}>
        <Group top={height / 2 - margin.top} left={width / 2}>
          <Pie
            data={[
              {pos: 0, number: count1, color: red},
              {pos: 1, number: count2, color: green},
            ]}
            pieValue={d => d.number}
            pieSort={d => d.pos}
            outerRadius={radius - 10}
            innerRadius={radius - 20}
            padAngle={0}
          >
            {pie => {
              return pie.arcs.map((arc, index) => (
                <g key={index}>
                  <path
                    d={pie.path(arc)}
                    fill={arc.data.color}
                  />
                </g>
              ));
            }}
          </Pie>
        </Group>
        <text
          x={radius}
          y={radius}
          alignmentBaseline={'middle'}
          textAnchor={'middle'}
        >
          {count1 + count2}
        </text>
      </svg>
    </div>
  )
}

export function DonutChart({segments, mainNumber}) {
  const [selectedPhase, setSelectedPhase] = useState(null);

  return (
    <div className='text-center position-relative'>
      <svg width={width} height={height}>
        <Group top={height / 2 - margin.top} left={width / 2}>
          <Pie
            data={segments}
            pieValue={d => d.total}
            pieSort={d => d.pos}
            outerRadius={radius - 10}
            innerRadius={radius - 20}
            padAngle={0}
          >
            {pie => pie.arcs.map((arc, index) => (
              <g key={arc.data.label}>
                <path
                  onMouseLeave={() => setSelectedPhase(null)}
                  onMouseEnter={() => setSelectedPhase(arc.data)}

                  d={pie.path(arc)}
                  fill={green}
                  fillOpacity={index * 0.25}
                />
              </g>
            ))}
          </Pie>
        </Group>
        {selectedPhase ? (
          <React.Fragment>
            <text
              x={radius}
              y={radius - 8}
              alignmentBaseline='middle'
              textAnchor='middle'
            >
              {selectedPhase.label}
            </text>
            <text
              x={radius}
              y={radius + 8}
              alignmentBaseline='middle'
              textAnchor='middle'
            >
              ({selectedPhase.total})
            </text>
          </React.Fragment>
        ) : (
          <text
            x={radius}
            y={radius}
            alignmentBaseline='middle'
            textAnchor='middle'
          >
            {mainNumber}
          </text>
        )}
      </svg>
    </div>
  );
}
