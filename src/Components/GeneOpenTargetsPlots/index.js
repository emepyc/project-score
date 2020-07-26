import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons'
import first from 'lodash.first';
import {Card, CardHeader, CardBody, Row, Col, NavLink} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import useUrlParams from '../useUrlParams';
import FetchData from '../FetchData';
import {BinaryCountPlot, DonutChart} from '../SignificantCountPlot';
import {fetchGeneInfo, fetchOtGeneInfo} from '../../api';
import otLogo from '../GeneInfoHeader/OtLogo.png';
import Steps from "../Steps";
import {textDefaultColor} from "../../colors";

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
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.targetvalidation.org/target/${ensemblIdentifier.identifier}`}
              >
                <img alt='OpenTargets' src={otLogo} width={125}/>
              </a>
              <NavLink href={`https://www.targetvalidation.org/target/${ensemblIdentifier.identifier}`}>
                <FontAwesomeIcon icon={faExternalLinkAlt}/>
              </NavLink>
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
              <div className="text-center">Cancer hallmarks</div>
            </Col>
            <Col>
              <div className="text-center">Tractability</div>
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
            <Col className='text-center mt-3'>
              <Steps
                labels={otGene.tractability.categories}
                values={otGene.tractability.categories}
                descriptions={otGene.tractability.labels}
                selectedValue={otGene.tractability.maxCategory}
              />
            </Col>
          </Row>
        </React.Fragment>
      )}
    </FetchData>
  );
}
