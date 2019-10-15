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

  const reset = () => {
    setTractability(defaultSettings.tractability);
    setHcg(defaultSettings.hcg);
    setCsHcg(defaultSettings.csHcg);
    setMutatedInPrimaryTumors(defaultSettings.mutatedInPrimaryTumors);
    setMutatedInPrimaryTumorsCosmic(defaultSettings.mutatedInPrimaryTumorsCosmic);
    setWeakerMarker(defaultSettings.weakerMarker);
    setGenomicMarkerStrength(defaultSettings.genomicMarkerStrength);
    setFoldSbf(defaultSettings.foldSbf);
    setMgkPercFrd(defaultSettings.mgkPercFdr);
    setHighlyExpr(defaultSettings.highlyExpr);
    setIsMutated(defaultSettings.isMutated);
    setDepPathway(defaultSettings.depPathway);
    setThreshold(defaultSettings.threshold);
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

        <div className="mt-4 mx-2 flex-column">
          <div className="text-lg-center">
            <span className="settings-header-section">Priority scores:</span>
          </div>
          <div className="ml-2">

            <div className="d-flex flex-row flex-wrap">
              <div className="d-column mx-3">
                <span className="settings-subheader-section">Level 1: Target</span>
                <div className="ml-2 mt-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={hcg}
                      onChange={() => setHcg(!hcg)}
                    />
                    High-confidence cancer gene
                  </Label>
                </div>
                <div className="ml-2 mt-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={csHcg}
                      onChange={() => setCsHcg(!csHcg)}
                    />
                    High-confidence cancer gene (cancer type)
                  </Label>
                </div>
                <div className="ml-2 mt-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={mutatedInPrimaryTumors}
                      onChange={() => setMutatedInPrimaryTumors(!mutatedInPrimaryTumors)}
                    />
                    Mutated in primary tumors
                  </Label>
                </div>
                <div className="ml-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={mutatedInPrimaryTumorsCosmic}
                      onChange={() => setMutatedInPrimaryTumorsCosmic(!mutatedInPrimaryTumorsCosmic)}
                    />
                    Mutated in primary tumors (in COSMIC)
                  </Label>
                </div>
                <div className="ml-2 mt-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={weakerMarker}
                      onChange={() => setWeakerMarker(!weakerMarker)}
                    />
                    Genomic marker is weak
                  </Label>
                </div>
                <div className="ml-2 mt-2">
                  <Label>Min genomic marker strength</Label>
                  <Input
                    type="select"
                    value={genomicMarkerStrength}
                    onChange={(event) => setGenomicMarkerStrength(event.target.value)}
                  >
                    <option value={0}>0</option>
                    <option value={1}>1 (class A)</option>
                    <option value={2}>2 (class B)</option>
                    <option value={3}>3 (class C)</option>
                  </Input>
                </div>
              </div>
              <div className="d-column mx-3">
                <span className="settings-subheader-section">Level 2: Cell line</span>
                <div className="ml-2 mt-2">
                  <Label>Min fold scaled bayes factor</Label>
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
                <div className="ml-2 mt-2">
                  <Label>Max perc gene fitness FDR</Label>
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
                <div className="ml-2 mt-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={highlyExpr}
                      onChange={() => setHighlyExpr(!highlyExpr)}
                    />
                    Highly expressed
                  </Label>
                </div>
                <div className="ml-2 mt-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={depPathway}
                      onChange={() => setDepPathway(!depPathway)}
                    />
                    In over-represented pathway
                  </Label>
                </div>
                <div className="ml-2 mt-2">
                  <Label>
                    <Input
                      type="checkbox"
                      checked={isMutated}
                      onChange={() => setIsMutated(!isMutated)}
                    />
                    Is mutated
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4 mx-2 flex-column">
          <Label for="priority-score-threshold-slider">
            <span className="settings-header-section">Priority score threshold</span>
          </Label>
          <Slider
            id="priority-score-threshold-slider"
            width={250}
            min={1}
            max={100}
            defaultValue={defaultSettings.threshold}
            step={1}
            onChange={setThreshold}
            value={threshold}
          />
        </div>
      </div>

      <div className="mx-5 my-4">
        <span className="mx-2">
          <Button
            onClick={() => submit()}
            color={"primary"}
            disabled={isEqual(currentSettings(), prevSettings.current)}
          >
            Update
          </Button>
        </span>
        <span className="mx-2">
          <Button
            onClick={() => reset()}
            color={"secondary"}
            disabled={
              isEqual(defaultSettings, currentSettings())
            }
          >
          Reset
        </Button>
        </span>
      </div>
    </div>
  );
}
