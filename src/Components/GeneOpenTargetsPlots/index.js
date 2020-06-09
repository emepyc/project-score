import React from 'react';
import first from 'lodash.first';
import {Card, CardHeader, CardBody, Row, Col} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import useUrlParams from "../useUrlParams";
import FetchData from "../FetchData";
import {BinaryCountPlot} from "../SignificantCountPlot";
import {fetchGeneInfo, fetchOtGeneInfo} from "../../api";

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
          </Row>
        </React.Fragment>
      )}
    </FetchData>
  );
}
