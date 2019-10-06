import * as d3 from 'd3';
import React, {useRef} from 'react';
import RCSlider from 'rc-slider';
import Tooltip from 'rc-tooltip';

import 'rc-slider/assets/index.css';
import './rangeSlider.scss';

const createSliderWithTooltip = RCSlider.createSliderWithTooltip;
const TooltipRange = createSliderWithTooltip(RCSlider.Range);
const TooltipSlider = createSliderWithTooltip(RCSlider);
const Handle = Slider.Handle;

const handle = (props) => {
  const {value, dragging, index, ...restProps} = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

export function Range({min, max, value, step, defaultValue, onChange}) {
  return (
    <TooltipRange
      allowCross={false}
      min={min}
      max={max}
      value={value}
      step={step}
      defaultValue={defaultValue}
      onChange={onChange}
      handle={handle}
    />
  );
}

export function Slider({width, min, max, value, step, defaultValue, onChange}) {
  const labelRef = useRef(null);

  const labelWidth =  labelRef.current ? labelRef.current.clientWidth : 0;

  const containerStyle = {
    width,
    position: "relative",
  };

  const xScale = d3.scaleLinear()
    .range([0, width])
    .domain([min, max]);

  const labelStyle = {
    position: "absolute",
    marginLeft: `-${(labelWidth / 2)}px`,
    left: xScale(value),
  };

  return (
    <div style={containerStyle}>
      <div>
        <TooltipSlider
          min={min}
          max={max}
          value={value}
          step={step}
          defaultValue={defaultValue}
          onChange={onChange}
          handle={handle}
        />
      </div>
      <div ref={labelRef} style={labelStyle}>
        <span>
          {value}
        </span>
      </div>
    </div>
  );
}
