import React, {useState, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Card, CardHeader, CardBody, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import * as d3 from 'd3';

import {cancerTypeColor, textDefaultColor} from "../../colors";
import {priorityScoresHelp} from '../../definitions';
import {fetchGenePriorityScore} from '../../api';
import useUrlParams from '../useUrlParams';
import FetchData from '../FetchData';
import useWidth from "../useWidth";
import Tooltip from '../Tooltip';
import "./GenePriorityScore.scss";


function GenePriorityScore(props) {
  const [{geneId}] = useUrlParams(props);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const modalToggle = () => setModalIsOpen(!modalIsOpen);

  const container = useRef(null);
  const containerWidth = useWidth(container);

  return (
    <div ref={container}>
      <FetchData
        endpoint={fetchGenePriorityScore}
        params={{geneId}}
        deps={[geneId]}
      >
        {priorityScore => {
          if (priorityScore.length === 0) {
            return (
              <div>
                No priority scores for gene
              </div>
            );
          }
          return (
            <React.Fragment>
              <Card>
                <CardHeader>
                  Priority Scores
                  <span className="help" onClick={modalToggle}>?</span>
                </CardHeader>
                <CardBody>
                  <PriorityScoreForAnalyses width={containerWidth} scores={priorityScore}/>
                </CardBody>
              </Card>
              <Modal isOpen={modalIsOpen} toggle={modalToggle}>
                <ModalHeader>Priority scores</ModalHeader>
                <ModalBody>
                  <div className='priorityScoreHelp'>
                    <div className='section'>
                      <h6>Level 1: Biomarker & tumour prevalence</h6>
                      <PriorityScoresHelpItem label='Class A marker' description={priorityScoresHelp.classAmarker}/>
                      <PriorityScoresHelpItem label='Class B marker' description={priorityScoresHelp.classBmarker}/>
                      <PriorityScoresHelpItem label='Class C marker' description={priorityScoresHelp.classCmarker}/>
                      <PriorityScoresHelpItem label='Weaker marker' description={priorityScoresHelp.weakerMarker}/>
                      <PriorityScoresHelpItem
                        label='Mutated in primary tumours'
                        description={priorityScoresHelp.mutatedInPrimaryTumors}
                      />
                    </div>

                    <div className='section'>
                      <h6>Level 2: Cell lines fitness effect (averaged for sensitive cell lines)</h6>
                      <PriorityScoresHelpItem
                        label='Fitness score < -1'
                        description={priorityScoresHelp.fitnessScoreFold1}
                      />
                      <PriorityScoresHelpItem
                        label='Fitness score < -2'
                        description={priorityScoresHelp.fitnessScoreFold2}
                      />
                      <PriorityScoresHelpItem
                        label='Fitness score < -3'
                        description={priorityScoresHelp.fitnessScoreFold3}
                      />
                      <PriorityScoresHelpItem label='MAGeCK < 10% FRD' description={priorityScoresHelp.mageck10fdr}/>
                      <PriorityScoresHelpItem label='MAGeCK < 5% FRD' description={priorityScoresHelp.mageck5fdr}/>
                      <PriorityScoresHelpItem label='Mutated' description={priorityScoresHelp.mutated}/>
                      <PriorityScoresHelpItem
                        label='Enriched pathway'
                        description={priorityScoresHelp.enrichedPathway}
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={modalToggle}>Ok</Button>
                </ModalFooter>
              </Modal>
            </React.Fragment>
          )
        }}
      </FetchData>
    </div>
  );
}

export default withRouter(GenePriorityScore);


function PriorityScoresHelpItem({label, description}) {
  return (
    <div className='item'>
      <b>{label}</b>:{' '}
      <span dangerouslySetInnerHTML={{__html: description}}/>
    </div>
  );
}

function getLabelFontSize(labelLength, maxLabelWidth) {
  let fontFactor = 8, fontSize = 0.9;
  while (true) {
    const labelWidth = fontFactor * labelLength;
    if (labelWidth > maxLabelWidth) {
      fontSize -= 0.1;
      fontFactor -= 1;
      continue;
    }
    return [fontSize, fontFactor];
  }
}

const yLabelHeight = 150;

function PriorityScoreForAnalyses({width, scores}) {
  const [tooltip, setTooltip] = useState(null);
  const [helpModalIsOpen, setHelpModalIsOpen] = useState(false);
  const [helpModal, setHelpModal] = useState(null);
  const numberOfScores = 14;

  const maxLabelLength = d3.max(scores.map(score => score.analysis.length));
  const [fontSize, fontFactor] = getLabelFontSize(maxLabelLength, width * 0.3);
  const xLabelWidth = maxLabelLength * fontFactor;

  const levelLabelHeight = 30;
  const xMargin = 15;
  const blockMargin = 12;
  const verticalMargin = 20;
  const svgWidth = width - (xMargin * 2);
  const cellWidth = (svgWidth - xLabelWidth) / (numberOfScores + 0.5);

  const levellabelYPosition = scores.length * (cellWidth + verticalMargin);

  const svgHeight = yLabelHeight + (scores.length * (verticalMargin + cellWidth)) + levelLabelHeight;

  const tooltipElement = tooltip ? (
    <Tooltip
      x={tooltip.x}
      y={tooltip.y}
      width={20}
      height={20}
      hideGuide={true}
    >
      {tooltip.message}
    </Tooltip>
  ) : null;

  const helpModalToggle = () => setHelpModalIsOpen(!helpModalIsOpen);

  const modalElement = (
    <Modal isOpen={helpModalIsOpen} toggle={helpModalToggle}>
      <ModalHeader>{helpModal ? helpModal.label : ""}</ModalHeader>
      <ModalBody><span dangerouslySetInnerHTML={{__html: helpModal ? helpModal.description : ""}}/></ModalBody>
      <ModalFooter><Button onClick={helpModalToggle}>Ok</Button></ModalFooter>
    </Modal>
  );

  return (
    <div style={{position: 'relative', width: '100%', marginRight: `${xMargin}px`}}>
      {modalElement}
      <svg
        width={svgWidth}
        height={svgHeight}
      >
        <g transform={`translate(0, ${yLabelHeight})`}>
          <Xlabels
            cellWidth={cellWidth}
            blockMargin={blockMargin}
            onHelp={(label, description) => {
              console.log(label, description);
              setHelpModal({label, description});
              helpModalToggle();
            }}
          />
          {scores.map((scoresForAnalysis, index) => {
            const rowY = index * (verticalMargin + cellWidth);
            return (
              <g key={scoresForAnalysis.analysis} transform={`translate(0, ${rowY})`}>
                <PriorityScoreRow
                  onHighlight={setTooltip}
                  rowY={rowY + yLabelHeight}
                  cellWidth={cellWidth}
                  scores={scoresForAnalysis}
                  blockMargin={blockMargin}
                  fontSize={fontSize}
                />
              </g>
            )
          })}
          <LevelLabel
            posX={(cellWidth * 2) + blockMargin + (cellWidth * 5 / 2)}
            posY={levellabelYPosition}
            label='Level 1'
          />
          <LevelLabel
            posX={(cellWidth * 7) + (blockMargin * 2) + (cellWidth * 7 / 2)}
            posY={levellabelYPosition}
            label='Level 2'
          />
        </g>
      </svg>
      {tooltipElement}
    </div>
  )
}

function LevelLabel({posX, posY, label}) {
  return (
    <text
      x={posX}
      y={posY}
      alignmentBaseline='central'
      textAnchor='middle'
    >
      {label}
    </text>
  );
}

function Xlabels({cellWidth, blockMargin, onHelp}) {
  return (
    <React.Fragment>
      /* General scores */
      <Xlabel
        posX={cellWidth / 2}
        label='Total priority score'
      />
      <Xlabel
        posX={cellWidth + (cellWidth / 2)}
        label='Rank (within cancer type)'
      />

      /* L1 scores */
      <Xlabel
        posX={(cellWidth * 2) + blockMargin + (cellWidth / 2)}
        label='Class A marker'
        onHelp={() => onHelp('class A marker', priorityScoresHelp.classAmarker)}
      />
      <Xlabel
        posX={(cellWidth * 3) + blockMargin + (cellWidth / 2)}
        label='Class B marker'
        onHelp={() => onHelp('class B marker', priorityScoresHelp.classBmarker)}
      />
      <Xlabel
        posX={(cellWidth * 4) + blockMargin + (cellWidth / 2)}
        label='Class C marker'
        onHelp={() => onHelp('class C marker', priorityScoresHelp.classCmarker)}
      />
      <Xlabel
        posX={(cellWidth * 5) + blockMargin + (cellWidth / 2)}
        label='Weaker marker'
        onHelp={() => onHelp('Weaker marker', priorityScoresHelp.weakerMarker)}
      />
      <Xlabel
        posX={(cellWidth * 6) + blockMargin + (cellWidth / 2)}
        label='Mutated in primary tumours'
        onHelp={() => onHelp('Mutated in primary tumours', priorityScoresHelp.mutatedInPrimaryTumors)}
      />

      /* L2 scores */
      <Xlabel
        posX={(cellWidth * 7) + (blockMargin * 2) + (cellWidth / 2)}
        label='Fitness score < -1'
        onHelp={() => onHelp('Fitness score < -1', priorityScoresHelp.fitnessScoreFold1)}
      />
      <Xlabel
        posX={(cellWidth * 8) + (blockMargin * 2) + (cellWidth / 2)}
        label='Fitness score < -2'
        onHelp={() => onHelp('Fitness score < -2', priorityScoresHelp.fitnessScoreFold2)}
      />
      <Xlabel
        posX={(cellWidth * 9) + (blockMargin * 2) + (cellWidth / 2)}
        label='Fitness score < -3'
        onHelp={() => onHelp('Fitness score < -3', priorityScoresHelp.fitnessScoreFold3)}
      />
      <Xlabel
        posX={(cellWidth * 10) + (blockMargin * 2) + (cellWidth / 2)}
        label='MAGeCK < 10% FDR'
        onHelp={() => onHelp('MAGeCK < 10% FDR', priorityScoresHelp.mageck10fdr)}
      />
      <Xlabel
        posX={(cellWidth * 11) + (blockMargin * 2) + (cellWidth / 2)}
        label='MAGeCK < 5% FDR'
        onHelp={() => onHelp('MAGeCK < 5% FDR', priorityScoresHelp.mageck5fdr)}
      />
      <Xlabel
        posX={(cellWidth * 12) + (blockMargin * 2) + (cellWidth / 2)}
        label='Mutated'
        onHelp={() => onHelp('Mutated', priorityScoresHelp.mutated)}
      />
      <Xlabel
        posX={(cellWidth * 13) + (blockMargin * 2) + (cellWidth / 2)}
        label='Enriched pathway'
        onHelp={() => onHelp('Enriched pathway', priorityScoresHelp.enrichedPathway)}
      />
    </React.Fragment>
  );
}

function Xlabel({posX, label, onHelp}) {
  const helpElement = onHelp ? (
    <tspan
      className="help"
      onClick={(ev) => onHelp()}
    >
      ?
    </tspan>
  ) : null;

  return (
    <g
      transform={`translate(${posX}, -15) rotate(-45)`}
    >
      <text
        x={0}
        y={0}
        alignmentBaseline='central'
        style={{
          fontSize: '0.9em',
          fill: textDefaultColor,
        }}
      >
        {label}
        {helpElement}
      </text>
    </g>
  );
}

function PriorityScoreRow({scores, rowY, cellWidth, blockMargin, onHighlight, fontSize}) {
  const color = cancerTypeColor[scores.analysisId];

  return (
    <React.Fragment>
      /* General scores */
      <PriorityScoreWithTextValue
        posX={0}
        width={cellWidth}
        color={cancerTypeColor[scores.analysisId]}
        text={Math.round(scores.score)}
      />
      <PriorityScoreWithTextValue
        posX={cellWidth}
        width={cellWidth}
        color={cancerTypeColor[scores.analysisId]}
        text={scores.rank}
      />

      /* L1 scores */
      <PriorityScoreWithColor
        posX={(cellWidth * 2) + blockMargin}
        width={cellWidth}
        color={scores.l1Scores.classA ? color : "#FFFFFF"}
      />
      <PriorityScoreWithColor
        posX={(cellWidth * 3) + blockMargin}
        width={cellWidth}
        color={scores.l1Scores.classB ? color : "#FFFFFF"}
      />
      <PriorityScoreWithColor
        posX={(cellWidth * 4) + blockMargin}
        width={cellWidth}
        color={scores.l1Scores.classC ? color : "#FFFFFF"}
      />
      <PriorityScoreWithColor
        posX={(cellWidth * 5) + blockMargin}
        width={cellWidth}
        color={scores.l1Scores.weakerMarker ? color : "#FFFFFF"}
      />
      <PriorityScoreWithColor
        posX={(cellWidth * 6) + blockMargin}
        width={cellWidth}
        color={scores.l1Scores.mutatedPrimaryTumour ? color : "#FFFFFF"}
      />

      /* L2 scores */
      <PriorityScoreWithColorScale
        posX={(cellWidth * 7) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.fold1Sbf.true}
        maxValue={scores.l2Scores.fold1Sbf.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 8) + (blockMargin * 2),
          message: `${scores.l2Scores.fold1Sbf.true} / ${scores.l2Scores.fold1Sbf.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 8) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.fold2Sbf.true}
        maxValue={scores.l2Scores.fold2Sbf.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 9) + (blockMargin * 2),
          message: `${scores.l2Scores.fold2Sbf.true} / ${scores.l2Scores.fold2Sbf.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 9) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.fold3Sbf.true}
        maxValue={scores.l2Scores.fold3Sbf.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 10) + (blockMargin * 2),
          message: `${scores.l2Scores.fold3Sbf.true} / ${scores.l2Scores.fold3Sbf.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 10) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.mgk5percFdr.true}
        maxValue={scores.l2Scores.mgk5percFdr.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 11) + (blockMargin * 2),
          message: `${scores.l2Scores.mgk5percFdr.true} / ${scores.l2Scores.mgk5percFdr.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 11) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.mgk10percFdr.true}
        maxValue={scores.l2Scores.mgk10percFdr.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 12) + (blockMargin * 2),
          message: `${scores.l2Scores.mgk10percFdr.true} / ${scores.l2Scores.mgk10percFdr.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 12) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.mut.true}
        maxValue={scores.l2Scores.mut.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 13) + (blockMargin * 2),
          message: `${scores.l2Scores.mut.true} / ${scores.l2Scores.mut.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <PriorityScoreWithColorScale
        posX={(cellWidth * 13) + (blockMargin * 2)}
        width={cellWidth}
        value={scores.l2Scores.depPathway.true}
        maxValue={scores.l2Scores.depPathway.total}
        color={color}
        onMouseEnter={() => onHighlight({
          y: rowY + cellWidth / 2,
          x: (cellWidth * 14) + (blockMargin * 2),
          message: `${scores.l2Scores.depPathway.true} / ${scores.l2Scores.depPathway.total}`
        })}
        onMouseLeave={() => onHighlight(null)}
      />
      <text
        x={(cellWidth * 14) + (blockMargin * 2) + 10}
        y={cellWidth / 2}
        alignmentBaseline='central'
        textAnchor='left'
        style={{
          fill: textDefaultColor,
          fontSize: `${fontSize}em`,
        }}
      >
        {scores.analysis}
      </text>
    </React.Fragment>
  );
}

function PriorityScoreWithTextValue({posX, width, color, text}) {
  const [fontSize] = getLabelFontSize(`${text}`.length, width);
  return (
    <React.Fragment>
      <PriorityScoreWithColor
        posX={posX}
        width={width}
        color={color}
      />
      <text
        x={posX + (width / 2)}
        y={width / 2}
        fill={textDefaultColor}
        textAnchor='middle'
        alignmentBaseline='central'
        style={{
          fontSize: `${fontSize}em`,
        }}
      >
        {text}
      </text>
    </React.Fragment>
  );
}

function PriorityScoreWithColorScale({posX, width, value, maxValue, color, ...props}) {
  const colorScale = d3.scaleLinear()
    .range(['#FFFFFF', color])
    .domain([0, maxValue]);

  return (
    <PriorityScoreWithColor
      posX={posX}
      width={width}
      color={colorScale(value)}
      {...props}
    />
  );
}

function PriorityScoreWithColor({posX, width, color, ...props}) {
  return (
    <rect
      x={posX}
      y={0}
      width={width}
      height={width}
      fill={color}
      style={{
        strokeWidth: 0.5,
        stroke: "#333333",
      }}
      {...props}
    />
  );
}
