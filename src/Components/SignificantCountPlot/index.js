import React from 'react';
import {Pie} from '@vx/shape';
import {Group} from '@vx/group';
import {significantNodeColor as green, red as red} from '../../colors';

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
      <svg width={width} height={height}>
        <Group top={height / 2 - margin.top} left={width / 2}>
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
              return pie.arcs.map((arc, i) => {
                return (
                  <g key={`browser-${arc.data.label}-${i}`}>
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
  console.log(count1, count2);
  return (
    <div className='text-center'>
      <svg width={width} height={height}>
        <Group top={height / 2 - margin.top} left={width / 2}>
          <Pie
            data={[
              {pos: 0, opacity: 1, number: count1, color: red},
              {pos: 1, opacity: 1, number: count2, color: green},
            ]}
            pieValue={d => d.number}
            pieSort={d => d.pos}
            outerRadius={radius - 10}
            innerRadius={radius - 20}
            padAngle={0}
          >
            {pie => {
              return pie.arcs.map((arc, index) => (
                <g key={`browser-${arc.data.label}-${index}`}>
                  <path
                    d={pie.path(arc)}
                    fill={arc.data.color}
                    fillOpacity={arc.data.opacity}
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
