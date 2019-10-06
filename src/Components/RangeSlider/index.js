import React from 'react';
import {Range} from 'rc-slider';

import 'rc-slider/assets/index.css';
import './rangeSlider.scss';

export default function RangeSlider({min, max, value, step, defaultValue, onChange}) {
  return (
    <Range
      allowCross={false}
      min={min}
      max={max}
      value={value}
      step={step}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
}
