import React, {useState, useRef} from 'react';
import {Button, Input, Label} from 'reactstrap';
import isEqual from 'lodash.isequal';

import {Slider} from '../RangeSlider';

import "./priorityScoresSettings.scss";

export default function PriorityScoresSettings({defaultSettings, onSubmit}) {
  const [tractability, setTractability] = useState(defaultSettings.tractability);
  const [hcg, setHcg] = useState(defaultSettings.hcg);
  const [csHcg, setCsHcg] = useState(defaultSettings.csHcg);
  const [mutatedInPrimaryTumors, setMutatedInPrimaryTumors] = useState(defaultSettings.mutatedInPrimaryTumors);
  const [mutatedInPrimaryTumorsCosmic, setMutatedInPrimaryTumorsCosmic] = useState(defaultSettings.mutatedInPrimaryTumorsCosmic);
  const [weakerMarker, setWeakerMarker] = useState(defaultSettings.weakerMarker);
  const [genomicMarkerStrength, setGenomicMarkerStrength] = useState(defaultSettings.genomicMarkerStrength);
  const [foldSbf, setFoldSbf] = useState(defaultSettings.foldSbf);
  const [mgkPercFdr, setMgkPercFrd] = useState(defaultSettings.mgkPercFdr);
  const [highlyExpr, setHighlyExpr] = useState(defaultSettings.highlyExpr);
  const [isMutated, setIsMutated] = useState(defaultSettings.isMutated);
  const [depPathway, setDepPathway] = useState(defaultSettings.depPathway);
  const [threshold, setThreshold] = useState(defaultSettings.threshold);

  const prevSettings = useRef(defaultSettings);

  const submit = () => {
    const settings = currentSettings();
    onSubmit(settings);
    prevSettings.current = settings;
  };

  const currentSettings = () => ({
    tractability,
    hcg,
    csHcg,
    mutatedInPrimaryTumors,
    mutatedInPrimaryTumorsCosmic,
    weakerMarker,
    genomicMarkerStrength,
    foldSbf,
    mgkPercFdr,
    threshold,
    highlyExpr,
    isMutated,
    depPathway,
  });

  return (
    <div className="mb-5">
      <div className="mx-5 my-4 d-flex justify-content-between flex-row flex-wrap">
        <div className="mt-4 mx-2 flex-column">
          <Label>
            <Input
              type='checkbox'
              checked={tractability}
              onChange={() => setTractability(!tractability)}
            />{' '}
            <span className="settings-header-section">Tractability</span>
          </Label>
        </div>

        <div className="my-4 mx-2 flex-column">
          <Label for="priority-score-threshold-slider">
            <span className="settings-header-section">Priority score threshold</span>
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
