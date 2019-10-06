import React, {useState, useRef} from 'react';
import {Button, Input, Label} from 'reactstrap';
import isEqual from 'lodash.isequal';

import {Slider} from '../RangeSlider';

export default function PriorityScoresSettings({defaultSettings, onSubmit}) {
  const [tractability, setTractability] = useState(defaultSettings.tractability);
  const [threshold, setThreshold] = useState(defaultSettings.threshold);

  const prevSettings = useRef(defaultSettings);

  const submit = () => {
    const settings = currentSettings();
    onSubmit(settings);
    prevSettings.current = settings;
  };

  const currentSettings = () => ({
    tractability,
    threshold,
  });

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between flex-row">
        <div className="mx-5 my-4 flex-column">
          <Label>
            <Input
              type='checkbox'
              checked={tractability}
              onChange={() => setTractability(!tractability)}
            />{' '}
            Tractability
          </Label>
        </div>

        <div className="flex-column">
          <Label for="priority-score-threshold-slider">
            Priority score threshold
          </Label>
          <Slider
            id="priority-score-threshold-slider"
            width={350}
            min={defaultSettings.threshold}
            max={100}
            defaultValue={defaultSettings.threshold}
            step={1}
            onChange={setThreshold}
            value={threshold}
          />
        </div>
      </div>

      <div className="mx-5 my-2">
        <Button
          onClick={() => submit()}
          color={"primary"}
          disabled={isEqual(currentSettings(), prevSettings.current)}
        >
          Update
        </Button>
      </div>
    </React.Fragment>
  );
}
