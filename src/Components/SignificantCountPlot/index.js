import range from 'lodash.range';
import React, {useState} from 'react';
import {Pie} from '@vx/shape';
import {Group} from '@vx/group';
import {Tooltip} from 'reactstrap';

import useId from "../useId";
import {significantNodeColor as green, red} from '../../colors';

import style from './significantCountPlot.module.scss';


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

export function BinaryCountPlot({count1, count2, dataTooltip}) {
  const [tooltipsOpenState, setTooltipsOpenState] = useState([false, false]);

  const id = useId();

  return (
    <div className='text-center'>
      <svg width={width} height={height}>
        <Group top={height / 2 - margin.top} left={width / 2}>
          <Pie
            data={[
              {pos: 0, number: count1.count, color: red},
              {pos: 1, number: count2.count, color: green},
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
                    className={style.path}
                    id={`tooltip-binary-plot-${id}-${index}`}
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
          {count1.count + count2.count}
        </text>
      </svg>
      <Tooltip
        position='auto'
        isOpen={tooltipsOpenState[0]}
        target={`tooltip-binary-plot-${id}-0`}
        toggle={() => setTooltipsOpenState([!tooltipsOpenState[0], tooltipsOpenState[1]])}
      >
        <div>
          {dataTooltip(count1)}
        </div>
      </Tooltip>
      <Tooltip
        position='auto'
        isOpen={tooltipsOpenState[1]}
        target={`tooltip-binary-plot-${id}-1`}
        toggle={() => setTooltipsOpenState([tooltipsOpenState[0], !tooltipsOpenState[1]])}
      >
        <div>
          {dataTooltip(count2)}
        </div>
      </Tooltip>
    </div>
  )
}

export function DonutChart({segments, mainNumber}) {
  const defaultTooltipsState = range(0, segments.length).reduce((defaultTooltipsState, phase) => ({
    ...defaultTooltipsState,
    [phase]: false,
  }), {});

  const [tooltipsOpenState, setTooltipsOpenState] = useState(defaultTooltipsState);

  const toggleTooltipForPhase = phase =>
    setTooltipsOpenState({
      ...tooltipsOpenState,
      [phase]: !tooltipsOpenState[phase],
    });

  return (
    <div className='text-center'>
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
              <g key={arc.data.phase}>
                <path
                  className={style.path}
                  id={`tooltip-phase-${arc.data.phase}`}
                  d={pie.path(arc)}
                  fill={green}
                  fillOpacity={0.2 + index * 0.2}
                />
              </g>
            ))}
          </Pie>
        </Group>
        <text
          x={radius}
          y={radius}
          alignmentBaseline='middle'
          textAnchor='middle'
        >
          {mainNumber}
        </text>
      </svg>
      {segments.map(segment => {
        const phase = segment.phase;
        return (
          <Tooltip
            position='auto'
            key={phase}
            isOpen={tooltipsOpenState[phase]}
            target={`tooltip-phase-${phase}`}
            toggle={() => toggleTooltipForPhase(phase)}
          >
            <div>
              {segment.label}
            </div>
            <div>
              <strong>{segment.total}</strong> clinical trials
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}
