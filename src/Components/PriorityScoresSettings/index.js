import React, {useState, useRef} from 'react';
import {Button, Input, Label, Tooltip} from 'reactstrap';
import isEqual from 'lodash.isequal';
import isArray from 'lodash.isarray';

import {Slider} from '../RangeSlider';
import {priorityScoresHelp} from "../../definitions";

import "./priorityScoresSettings.scss";

export default function PriorityScoresSettings({defaultSettings, onSubmit}) {
  const [tractability, setTractability] = useState(defaultSettings.tractability);
  const [l1Weight, setL1Weight] = useState(defaultSettings.l1Weight);
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
    setL1Weight(defaultSettings.l1Weight);
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
    l1Weight,
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
    <React.Fragment>
      <div className='mb-5' style={{fontSize: '0.9em'}}>
        <div className='d-flex justify-content-between flex-wrap flex-row-reverse'>
          <div className='d-flex justify-content-end' style={{fontSize: '0.9em'}}>
            <Label className='mr-4'>
              <Input
                type='checkbox'
                checked={tractability}
                onChange={() => setTractability(!tractability)}
              />{' '}
              <span className='settings-header-section'>Group target by tractability</span>
            </Label>
            <div className='mx-2 flex-column'>
              <Label for='priority-score-threshold-slider'>
              <span className='settings-header-section'>
                Priority score threshold
              </span>
                <Help
                  label='Priority score threshold'
                  definition={priorityScoresHelp.priorityScoreThreshold}
                />
              </Label>
              <Slider
                id='priority-score-threshold-slider'
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

          <div className='d-flex flex-row flex-grow-1'>
            <span className="flex-shrink-1 settings-header-section">
              Adjust priority score inputs and weighting:
            </span>
          </div>

        </div>

        <div className="d-flex justify-content-around flex-wrap">
          <div className='mx-5 flex-grow-1'>
            <ScoreWeightSlider
              label='Level 1: Biomarker & tumour prevalence'
              value={l1Weight}
              defaultValue={defaultSettings.l1Weight}
              onChange={setL1Weight}
            />
            <div className="mt-5">
              <Label>
                <Input
                  type="checkbox"
                  checked={hcg}
                  onChange={() => setHcg(!hcg)}
                />
                High confidence driver
              </Label>
              <Help
                label='High confidence driver'
                definition={priorityScoresHelp.highConfidenceDriver}
              />
            </div>
            <div className="mt-1">
              <Label>
                <Input
                  type="checkbox"
                  checked={csHcg}
                  onChange={() => setCsHcg(!csHcg)}
                />
                High-confidence cancer gene (cancer type)
              </Label>
            </div>
            <div className="mt-1">
              <Label>
                <Input
                  type="checkbox"
                  checked={mutatedInPrimaryTumors}
                  onChange={() => setMutatedInPrimaryTumors(!mutatedInPrimaryTumors)}
                />
                Mutated in primary tumours
              </Label>
              <Help
                label='Mutated in primary tumours'
                definition={priorityScoresHelp.mutatedInPrimaryTumors}
              />
            </div>
            <div className="mt-1">
              <Label>
                <Input
                  type="checkbox"
                  checked={mutatedInPrimaryTumorsCosmic}
                  onChange={() => setMutatedInPrimaryTumorsCosmic(!mutatedInPrimaryTumorsCosmic)}
                />
                COSMIC variant in primary tumours
              </Label>
              <Help
                label='COSMIC variant in primary tumours'
                definition={priorityScoresHelp.cosmicVariantInPrimaryTumors}
              />
            </div>
            <div className="mt-1">
              <Label>
                <Input
                  type="checkbox"
                  checked={weakerMarker}
                  onChange={() => setWeakerMarker(!weakerMarker)}
                />
                Weaker marker
              </Label>
              <Help
                label='Weaker marker'
                definition={priorityScoresHelp.weakerMarker}
              />
            </div>
            <div className="mt-1">
              <Label>
                Min genomic marker strength
              </Label>
              <Help
                label='Genomic marker class'
                definition={[
                  {label: 'Class A marker', definition: priorityScoresHelp.classAmarker},
                  {label: 'Class B marker', definition: priorityScoresHelp.classBmarker},
                  {label: 'Class C marker', definition: priorityScoresHelp.classCmarker},
                ]}
              />
              <Input
                type="select"
                value={genomicMarkerStrength}
                onChange={(event) => setGenomicMarkerStrength(event.target.value)}
              >
                <option value={0}>No marker</option>
                <option value={1}>1 (class A)</option>
                <option value={2}>2 (class B)</option>
                <option value={3}>3 (class C)</option>
              </Input>
            </div>
          </div>
          <div className='mx-5 flex-grow-1'>
            <ScoreWeightSlider
              label='Level 2: Cell lines fitness effect'
              value={100 - l1Weight}
              defaultValue={100 - defaultSettings.l1Weight}
              onChange={newL1Weight => setL1Weight(100 - newL1Weight)}
            />
            <div className="mt-5">
              <Label>
                Min fitness score category
                <Help
                  label='Fitness score categories'
                  definition={[
                    {label: 'Fitness score < -1', definition: priorityScoresHelp.fitnessScoreFold1},
                    {label: 'Fitness score < -2', definition: priorityScoresHelp.fitnessScoreFold2},
                    {label: 'Fitness score < -3', definition: priorityScoresHelp.fitnessScoreFold3},
                  ]}
                />
              </Label>
              <Input
                type="select"
                value={foldSbf}
                onChange={(event) => setFoldSbf(event.target.value)}
              >
                <option value={0}>No min score</option>
                <option value={1}>Fitness score &lt; -1</option>
                <option value={2}>Fitness score &lt; -2</option>
                <option value={3}>Fitness score &lt; -3</option>
              </Input>
            </div>
            <div className="mt-1">
              <Label>
                Max MAGeCK FDR %
                <Help
                  label={'MAGeCK FDR percentage'}
                  definition={[
                    {label: 'MAGeCK < 10% FDR', definition: priorityScoresHelp.mageck10fdr},
                    {label: 'MAGeCK < 5% FDR', definition: priorityScoresHelp.mageck5fdr},
                  ]}
                />
              </Label>
              <Input
                type="select"
                value={mgkPercFdr}
                onChange={(event) => setMgkPercFrd(event.target.value)}
              >
                <option value={10}>MAGeCK &lt; 10% FDR</option>
                <option value={5}>MAGeCK &lt; 5% FDR</option>
                <option value={0}>Not set</option>
              </Input>
            </div>
            <div className="mt-1">
              <Label>
                <Input
                  type="checkbox"
                  checked={highlyExpr}
                  onChange={() => setHighlyExpr(!highlyExpr)}
                />
                Highly expressed
              </Label>
              <Help
                label='Highly expressed'
                definition={priorityScoresHelp.highlyExpressed}
              />
            </div>
            <div className="mt-1">
              <Label>
                <Input
                  type="checkbox"
                  checked={depPathway}
                  onChange={() => setDepPathway(!depPathway)}
                />
                Enriched pathway
              </Label>
              <Help
                label='Enriched pathway'
                definition={priorityScoresHelp.enrichedPathway}
              />
            </div>
            <div className="mt-1">
              <Label>
                <Input
                  type="checkbox"
                  checked={isMutated}
                  onChange={() => setIsMutated(!isMutated)}
                />
                Mutated
              </Label>
              <Help
                label='Mutated'
                definition={priorityScoresHelp.mutated}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mx-5 my-4">
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
    </React.Fragment>
  );
}

function ScoreWeightSlider({label, width, value, defaultValue, onChange}) {
  return (
    <React.Fragment>
      <span className="settings-subheader-section">{label}</span>
      <div className="mt-1 mb-3">
        <Label>
          Score contribution
        </Label>
        <Slider
          width={width}
          min={0}
          max={100}
          value={value}
          step={1}
          defaultValue={defaultValue}
          onChange={onChange}
          tipFormatter={value => `${value}%`}
        />
      </div>
    </React.Fragment>
  );
}

function Help({label, definition}) {
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

  const id = `${label.split(' ').join('-')}-help`;

  const fullDefinition = isArray(definition) ? (
    <div className='priorityScoreSettingsHelp'>
      {definition.map(nextDefinition => (
        <div className='item' key={nextDefinition.label}>
          <b>{nextDefinition.label}</b>: <span dangerouslySetInnerHTML={{__html: nextDefinition.definition}}/>
        </div>
      ))}
    </div>
  ) : (
    <div
      className='text-justify'
      dangerouslySetInnerHTML={{__html: definition}}
    />
  );

  return (
    <React.Fragment>
      <span>
        <sup
          id={id}
          onClick={() => setTooltipIsOpen(true)}
          style={{cursor: 'pointer'}}
        >
          ?
        </sup>
      </span>
      <Tooltip
        trigger='click mouseLeave'
        target={id}
        placement='auto'
        isOpen={tooltipIsOpen}
        toggle={() => setTooltipIsOpen(false)}
        innerClassName='project-score-tooltip'
      >
        <div style={{fontSize: '0.9em'}}>
          {fullDefinition}
          <div className='d-flex justify-content-end'>
            <Button
              color='link'
              onClick={() => setTooltipIsOpen(false)}
              style={{fontSize: '0.9em'}}
            >
              Close
            </Button>
          </div>
        </div>
      </Tooltip>
    </React.Fragment>
  );
}
