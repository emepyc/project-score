import React, {Fragment} from 'react';
import {Pie} from '@vx/shape';
import {Group} from '@vx/group';

export default function SignificantEssentialitiesSummaryPlot({total, significant, children}) {
  if (!total) {
    return <div/>;
  }

  return (
    <Fragment>
      <div className='text-center'>
        {children}
      </div>

      <SignificantCountPlot
        total={total}
        significant={significant}
      />

    </Fragment>
  );
}


function SignificantCountPlot({total, significant}) {
  const margin = {
    top: 1,
    left: 1,
    right: 1,
    bottom: 1
  };

  const width = 100;
  const height = 100;

  const radius = 50;


  return (
        <div className='text-center'>
        <svg width={width} height={height}>
          <Group top={height / 2 - margin.top} left={width / 2}>
            <Pie
              data={[
                {pos: 0, opacity: 0.7, number: significant},
                {pos: 1, opacity: 0.1, number: total - significant}
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
                      <path d={pie.path(arc)} fill={'green'} fillOpacity={arc.data.opacity}/>
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