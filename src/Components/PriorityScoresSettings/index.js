import React, {useState, useRef} from 'react';
import {Button, Input, Label} from 'reactstrap';
import isEqual from 'lodash.isequal';

import {Slider} from '../RangeSlider';

export default function PriorityScoresSettings({defaultSettings, onSubmit}) {
  const [tractability, setTractability] = useState(defaultSettings.tractability);
  const [classAMarker, setClassAMarker] = useState(defaultSettings.classAMarker);
  const [classBMarker, setClassBMarker] = useState(defaultSettings.classBMarker);
  const [classCMarker, setClassCMarker] = useState(defaultSettings.classCMarker);
  const [foldSbf, setFoldSbf] = useState(defaultSettings.foldSbf);
  const [mgkPercFdr, setMgkPercFrd] = useState(defaultSettings.mgkPercFdr);
  const [highlyExpr, setHighlyExpr] = useState(defaultSettings.highlyExpr);
  const [threshold, setThreshold] = useState(defaultSettings.threshold);

  const prevSettings = useRef(defaultSettings);

  const submit = () => {
    const settings = currentSettings();
    onSubmit(settings);
    prevSettings.current = settings;
  };

  const currentSettings = () => ({
    tractability,
    classAMarker,
    classBMarker,
    classCMarker,
    foldSbf,
    mgkPercFdr,
    threshold,
    highlyExpr,
  });

  return (
    <div>
      <div className="mx-5 d-flex justify-content-between flex-row">
        <div className="my-4 flex-column">
          <Label>
            <Input
              type='checkbox'
              checked={tractability}
              onChange={() => setTractability(!tractability)}
            />{' '}
            Tractability
          </Label>
        </div>

        <div className="my-4 flex-column">
          <div className="text-center">
            Priority scores:
          </div>
          <div className="ml-2">

            <div className="d-flex flex-row">
              <div className="d-column mx-3">
                Level 1: Target
                <div className="ml-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={classAMarker}
                      onChange={() => setClassAMarker(!classAMarker)}
                    />
                    Class A marker
                  </Label>
                </div>
                <div className="ml-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={classBMarker}
                      onChange={() => setClassBMarker(!classBMarker)}
                    />
                    Class B marker
                  </Label>
                </div>
                <div className="ml-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={classCMarker}
                      onChange={() => setClassCMarker(!classCMarker)}
                    />
                    Class C marker
                  </Label>
                </div>
              </div>
              <div className="d-column mx-3">
                Level 2: Cell line
                <div className="ml-2">
                  <Label>Scaled bayes factor &gt;</Label>
                  <Input
                    type="select"
                    value={foldSbf}
                    onChange={(event) => setFoldSbf(event.target.value)}
                  >
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </Input>
                </div>
                <div className="ml-2">
                  <Label>Gene fitness FDR &lt;</Label>
                  <Input
                    type="select"
                    value={mgkPercFdr}
                    onChange={(event) => setMgkPercFrd(event.target.value)}
                  >
                    <option>10</option>
                    <option>5</option>
                    <option>0</option>
                  </Input>
                </div>
                <div className="ml-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={highlyExpr}
                      onChange={() => setHighlyExpr(!highlyExpr)}
                    />
                    Highly expressed
                  </Label>
                </div>
              </div>
            </div>

          </div>

        </div>

        <div className="my-4 flex-column">
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

      <div className="mx-5 my-4">
        <Button
          onClick={() => submit()}
          color={"primary"}
          disabled={isEqual(currentSettings(), prevSettings.current)}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
