import * as d3 from 'd3';
import React, {useState} from 'react';
import findIndex from 'lodash.findindex';
import {Tooltip} from 'reactstrap';

import {significantNodeColor, insignificantNodeColor, textDefaultColor} from "../../colors";
import useId from '../useId';

export default function Steps(props) {
  const {
    labels,
    values,
    descriptions,
    selectedValue,
    onSelectStep,
  } = props;

  const uniqueId = useId();
  const [tooltipOpen, setTooltipOpen] = useState(null);

  const selectedValuePos = findIndex(values, value => value === selectedValue);
  const selectedSteps = labels.map((label, pos) => pos <= selectedValuePos);

  const stepSeparation = 50;

  const xPadding = 10;
  const maxLabelLength = d3.max(labels, label => label.length);
  const plotWidth = xPadding + (labels.length * stepSeparation) + labels[labels.length - 1].length;
  const textLengthFactor = 5;
  const plotHeight = maxLabelLength * textLengthFactor + 20;

  return (
    <React.Fragment>
      <svg
        width={plotWidth}
        height={plotHeight}
      >
        <g transform={`translate(${xPadding}, 0)`}>
          {labels.map((label, pos) => (
            <g
              key={label}
              transform={`translate(${pos * stepSeparation + 5}, ${plotHeight - 10})`}
            >
              {pos > 0 && (
                <line
                  x2={0}
                  y1={0}
                  x1={-stepSeparation + 5}
                  y2={0}
                  stroke={selectedSteps[pos] ? significantNodeColor : insignificantNodeColor}
                  style={{
                    pointerEvents: 'none',
                  }}
                />
              )}
              <circle
                cx={0}
                cy={0}
                r={5}
                fill={selectedSteps[pos] ? significantNodeColor : insignificantNodeColor}
                style={{
                  cursor: onSelectStep !== undefined ? 'pointer' : 'default',
                  outline: 'none',
                }}
                onClick={() => onSelectStep(values[pos])}
                onMouseLeave={() => setTooltipOpen(null)}
                id={`${uniqueId}-stepTooltip-${values[pos]}`}
              />
              {descriptions && descriptions[pos] && (
                <Tooltip
                  target={`${uniqueId}-stepTooltip-${values[pos]}`}
                  isOpen={tooltipOpen === pos}
                  toggle={() => setTooltipOpen(pos)}
                  innerClassName='project-score-tooltip'
                >
                  {descriptions[pos]}
                </Tooltip>
              )}
              <text
                x={0}
                y={0}
                textAnchor='start'
                transform={`translate(0, -10), rotate(-45)`}
                fill={textDefaultColor}
                style={{
                  pointerEvents: 'none',
                }}
              >
                {label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </React.Fragment>
  );

  // return (
  //   <React.Fragment>
  //     <div
  //       className='d-flex justify-content-between'
  //       style={{
  //         width: `${maxWidth}px`,
  //       }}
  //     >
  //       {labels.map(label => (
  //         <div
  //           style={{
  //             rotate: '-45deg',
  //           }}
  //         >
  //           {label}
  //         </div>
  //       ))}
  //     </div>
  //     <div
  //       className='position-relative d-flex justify-content-between'
  //       style={{
  //         width: `${maxWidth}px`,
  //       }}
  //     >
  //       <div
  //         className='position-absolute'
  //         style={{
  //           top: '4px',
  //           width: `100%`,
  //           border: `1px solid ${significantNodeColor}`,
  //         }}
  //       />
  //       <React.Fragment>
  //         {labels.map(() => (
  //           <Step/>
  //         ))}
  //       </React.Fragment>
  //     </div>
  //   </React.Fragment>
  // );
}


function Step() {
  return (
    <div
      style={{
        width: '10px',
        height: '10px',
        backgroundColor: significantNodeColor,
        borderRadius: '5px',
      }}
    />
  );
}
