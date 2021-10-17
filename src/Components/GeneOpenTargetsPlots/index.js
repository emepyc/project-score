import React from 'react';
import first from 'lodash.first';
import uniqBy from 'lodash.uniqby';
import {Card, CardHeader, CardBody, Row, Col} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import useUrlParams from '../useUrlParams';
import FetchData from '../FetchData';
import {BinaryCountPlot, DonutChart} from '../SignificantCountPlot';
import {fetchGeneInfo, fetchOtGeneInfo} from '../../api';
import otLogo from '../GeneInfoHeader/OtLogo.png';
import Steps from "../Steps";

function GeneOpenTargetsPlots(props) {
  const [urlParams] = useUrlParams(props);

  return (
    <FetchData
      endpoint={fetchGeneInfo}
      params={{
        geneId: urlParams.geneId,
      }}
      deps={[urlParams.geneId]}
    >
      {geneInfo => {
        const ensemblIdentifier = first(geneInfo.identifiers.filter(
          identifier => identifier.source.name === 'ensembl_gene_id',
        ));
        return (
          <Card>
            <CardHeader className='d-flex justify-content-between'>
              <div className='align-self-center'>
                Target Profile
              </div>
              <div>
                <span className='align-self-center mr-2'>Link to:</span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://platform.opentargets.org/target/${ensemblIdentifier.identifier}`}
                >
                  <img alt='OpenTargets' src={otLogo} width={100}/>
                </a>
              </div>
            </CardHeader>
            <CardBody>
              {(ensemblIdentifier ? (
                <FetchOpenTargetsGene ensemblId={ensemblIdentifier.identifier}/>
              ) : (
                <div>
                  No gene info from OpenTargets
                </div>
              ))}
            </CardBody>
          </Card>
        );
      }}
    </FetchData>
  );
}

export default withRouter(GeneOpenTargetsPlots);

function FetchOpenTargetsGene(props) {
  const {ensemblId} = props;
  return (
    <FetchData
      endpoint={fetchOtGeneInfo}
      params={{
        ensemblId,
      }}
      deps={[ensemblId]}
    >
      {otGene => (
        <React.Fragment>
          <Row>
            <Col>
              <div className="text-center">{otGene.drugs.uniqueDrugs} Drugs</div>
            </Col>
            <Col>
              <div className="text-center">COSMIC cancer hallmarks</div>
            </Col>
            {/*<Col>*/}
            {/*  <div className="text-center">Tractability</div>*/}
            {/*</Col>*/}
          </Row>
          <Row>
            <Col>
              {otGene.drugs.clinicalTrialsPerPhase.length ? (
                <DonutChart
                  segments={otGene.drugs.clinicalTrialsPerPhase}
                  mainNumber={otGene.drugs.uniqueDrugs}
                />
              ) : <div className='text-center font-weight-bold'>No data</div>}
            </Col>

            <Col>
              {otGene.cancerHallmarks ? (
                <React.Fragment>
                  <BinaryCountPlot
                    count1={{
                      label: "suppress",
                      count: uniqBy(
                        otGene.cancerHallmarks.hallmarks.filter(hallmark => hallmark.impact === 'suppress'),
                        h => h.label,
                      ).length,
                    }}
                    count2={{
                      label: "promote",
                      count: uniqBy(
                        otGene.cancerHallmarks.hallmarks.filter(hallmark => hallmark.impact === 'promotes'),
                        h => h.label,
                      ).length
                    }}
                    dataTooltip={data => (
                      <React.Fragment>
                        <div>{data.label}</div>
                        <div><strong>{data.count}</strong></div>
                      </React.Fragment>
                    )}
                  />
                  <div className='text-center'>
                    role: {otGene.cancerHallmarks.roleInCancer}
                  </div>
                </React.Fragment>
              ) : (<div className='text-center font-weight-bold'>No data</div>)}

            </Col>
            {/*<Col className='text-center mt-3'>*/}
            {/*  <Steps*/}
            {/*    labels={otGene.tractability.categories}*/}
            {/*    values={otGene.tractability.categories}*/}
            {/*    descriptions={otGene.tractability.labels}*/}
            {/*    selectedValue={otGene.tractability.maxCategory}*/}
            {/*  />*/}
            {/*</Col>*/}
          </Row>
        </React.Fragment>
      )}
    </FetchData>
  );
}
