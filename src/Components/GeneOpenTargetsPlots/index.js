import React from 'react';
import first from 'lodash.first';
import {Card, CardHeader, CardBody, Row, Col} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {withRouter} from 'react-router-dom';
import useUrlParams from '../useUrlParams';
import FetchData from '../FetchData';
import {BinaryCountPlot, DonutChart} from '../SignificantCountPlot';
import {fetchGeneInfo, fetchOtGeneInfo} from '../../api';
import {significantNodeColor} from '../../colors';
import otLogo from '../GeneInfoHeader/OtLogo.png';

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
        console.log(geneInfo);
        const ensemblIdentifier = first(geneInfo.identifiers.filter(
          identifier => identifier.source.name === 'ensembl_gene_id',
        ));
        console.log(ensemblIdentifier);
        return (
          <Card>
            <CardHeader>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.targetvalidation.org/target/${ensemblIdentifier.identifier}`}
              >
                <img alt='OpenTargets' src={otLogo} width={125}/>
              </a>
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
      {otGene => {
        console.log(otGene);
        return (
          <React.Fragment>
            <Row>
              <Col>
                <div className="text-center">{otGene.drugs.uniqueDrugs} Drugs</div>
              </Col>
              <Col>
                <div className="text-center">Tractability</div>
              </Col>
              <Col>
                <div className="text-center">Cancer Hallmarks</div>
              </Col>
            </Row>
            <Row>
              <Col>
                {otGene.drugs.clinicalTrialsPerPhase.length ? (<DonutChart
                  segments={otGene.drugs.clinicalTrialsPerPhase}
                  mainNumber={otGene.drugs.uniqueDrugs}
                />) : <div className='text-center font-weight-bold'>No data</div>}
              </Col>
              <Col>

                {otGene.cancerHallmarks ? (<BinaryCountPlot
                  count1={{
                    label: "suppress",
                    count: otGene.cancerHallmarks.filter(hallmark => hallmark.suppress).length
                  }}
                  count2={{
                    label: "promote",
                    count: otGene.cancerHallmarks.filter(hallmark => hallmark.promote).length
                  }}
                  dataTooltip={data => (
                    <React.Fragment>
                      <div>{data.label}</div>
                      <div><strong>{data.count}</strong></div>
                    </React.Fragment>
                  )}
                />) : (<div className='text-center font-weight-bold'>No data</div>)}

              </Col>
              <Col>
                {otGene.tractability.length ? (<div
                    className="mt-3"
                  >
                    {otGene.tractability.map(tractabilityLabel => (
                      <TractabilityCheck
                        key={tractabilityLabel}
                        label={tractabilityLabel}
                      />
                    ))}
                  </div>
                ) : (<div className='text-center font-weight-bold'>No data</div>)}
              </Col>
            </Row>
          </React.Fragment>
        )
      }}
    </FetchData>
  );
}

function TractabilityCheck({label}) {
  return (
    <div
      className="mt-1"
    >
      <FontAwesomeIcon
        icon={faCheck}
        fixedWidth
        color={significantNodeColor}
      />
      <span className="ml-2">{label}</span>
    </div>
  );
}
