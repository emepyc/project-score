import React from 'react';
import first from 'lodash.first';
import {Card, CardHeader, CardBody, Row, Col} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {withRouter} from 'react-router-dom';
import useUrlParams from "../useUrlParams";
import FetchData from "../FetchData";
import {BinaryCountPlot} from "../SignificantCountPlot";
import {fetchGeneInfo, fetchOtGeneInfo} from "../../api";
import {significantNodeColor} from "../../colors";

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
            <CardHeader>
              Open Targets Resources
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
              <div className="text-center">Tractability</div>
            </Col>
            <Col>
              <div className="text-center">Cancer Hallmarks</div>
            </Col>
          </Row>
          <Row>
            <Col>
              <BinaryCountPlot
                count1={otGene.cancerHallmarks.filter(hallmark => hallmark.suppress).length}
                count2={otGene.cancerHallmarks.filter(hallmark => hallmark.promote).length}
              />
            </Col>
            <Col>
              <div
                className="mt-3"
              >
                {otGene.tractability.map(tractabilityLabel => (
                  <TractabilityCheck
                    key={tractabilityLabel}
                    label={tractabilityLabel}
                  />
                ))}
              </div>
            </Col>
          </Row>
        </React.Fragment>
      )}
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
