import React from 'react';
import {withRouter} from 'react-router-dom';
import useUrlParams from '../useUrlParams';
import {fetchSignificantModels, totalModels} from '../../api';
import SignificantCountPlot from '../SignificantCountPlot';
import {Card, CardHeader, CardBody} from 'reactstrap';
import {Col, Row} from "reactstrap";
import HasAttribute from '../HasAttribute';
import FetchData from "../FetchData";

function GeneSummaryPlots(props) {
  const [urlParams] = useUrlParams(props);

  return (
    <FetchData
      endpoint={fetchSignificantModels}
      params={{
        geneId: urlParams.geneId,
      }}
      deps={[urlParams.geneId]}
    >
      {gene => {
        const essentialModelsSuffix = gene.numberOfSignificantModels === 1 ? '' : 's';
        const essentialTissuesSuffix = gene.numberOfTotalTissues === 1 ? '' : 's';

        return (
          <Card>
            <CardHeader>
              Fitness Summary
            </CardHeader>
            <CardBody>
              <Row>
                <Col>
                  <div className="text-center">Loss of fitness in <b>{gene.numberOfSignificantModels}</b> cell
                    line{essentialModelsSuffix}</div>
                </Col>
                <Col>
                  <div className="text-center">Loss of fitness in <b>{gene.numberOfSignificantTissues}</b> cancer
                    type{essentialTissuesSuffix}</div>
                </Col>
                <Col>
                  <div className="text-center">Pan-cancer core fitness</div>
                </Col>
                <Col>
                  <div className="text-center">Common essential</div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <SignificantCountPlot
                    total={totalModels}
                    significant={gene.numberOfSignificantModels}
                  />
                </Col>
                <Col>
                  <SignificantCountPlot
                    total={gene.numberOfTotalTissues}
                    significant={gene.numberOfSignificantTissues}
                  />
                </Col>
                <Col>
                  <HasAttribute
                    attribute={gene.isPanCancer}
                  />
                </Col>
                <Col>
                  <HasAttribute
                    attribute={gene.isCommonEssential}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        );
      }}
    </FetchData>
  );
}

export default withRouter(GeneSummaryPlots);
