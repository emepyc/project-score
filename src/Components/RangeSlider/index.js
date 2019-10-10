import * as d3 from 'd3';
import React, {useRef, useState, useEffect} from 'react';
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

export function Range({width, min, max, value, step, defaultValue, onChange}) {
  const [labelWidth1, setLabelWidth1] = useState(0);
  const [labelWidth2, setLabelWidth2] = useState(0);

  const labelRef1 = useRef(null);
  const labelRef2 = useRef(null);

  useEffect(() => {
    setLabelWidth1(labelRef1.current ? labelRef1.current.clientWidth : 0);
    setLabelWidth2(labelRef2.current ? labelRef2.current.clientWidth : 0);

  }, [labelRef1.current, labelRef2.current]);

  console.log(labelWidth1, labelWidth2);

  const rangeWidth = width - labelWidth1 - labelWidth2;

  const xScale = d3.scaleLinear()
    .range([labelWidth1 + 2, width - labelWidth2 - 2])
    .domain([min, max]);

  const labelStyle1 = {
    position: "absolute",
    marginLeft: `-${labelWidth1}px`,
    left: xScale(value[0]),
    top: '20px',
    fontSize: '0.8em',
  };

  const labelStyle2 = {
    position: "absolute",
    left: xScale(value[1]),
    top: '20px',
    fontSize: '0.8em',
  };

  const containerStyle = {
    width,
    position: "relative",
    minHeight: "30px",
  };


  const rangeContainerStyle = {
    position: "absolute",
    width: rangeWidth,
    left: labelWidth1,
  };

  return (
    <div style={containerStyle}>
      <div style={rangeContainerStyle}>
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
      </div>
      <div ref={labelRef1} style={labelStyle1} className="label1">
        {value[0]}
      </div>
      <div ref={labelRef2} style={labelStyle2} className="label2">
        {value[1]}
      </div>
    </div>
  );
}

export function Slider({width, min, max, value, step, defaultValue, onChange}) {
  const labelRef = useRef(null);

  const labelWidth = labelRef.current ? labelRef.current.clientWidth : 0;

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
