import React, {Fragment, useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import useUrlParams from '../useUrlParams';
import {fetchSignificantModels, totalModels} from '../../api';
import Spinner from '../Spinner';
import SignificantCountPlot from '../SignificantCountPlot';
import {Card, CardHeader, CardBody, CardTitle} from "../Card";
import {Col, Row} from "reactstrap";
import HasAttribute from '../HasAttribute';

function GeneSummaryPlots(props) {
  const [numberOfEssentialModels, setNumberOfEssentialModels] = useState(0);
  const [numberOfEssentialTissues, setNumberOfEssentialTissues] = useState(0);
  const [totalNumberOfTissues, setTotalNumberOfTissues] = useState(0);
  const [urlParams] = useUrlParams(props);
  const [loading, setLoading] = useState(false);
  const [isPanCancer, setIsPanCancer] = useState(false);
  const [isTumourSuppressor, setIsTumourSuppressor] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchSignificantModels(urlParams.geneId)
      .then(gene => {
        setNumberOfEssentialModels(gene.numberOfSignificantModels);
        setIsTumourSuppressor(gene.isTumourSuppressor);
        setIsPanCancer(gene.isPanCancer);
        setNumberOfEssentialTissues(gene.numberOfSignificantTissues);
        setTotalNumberOfTissues(gene.numberOfTotalTissues);
        setLoading(false);
      });
  }, []);

  const essentialModelsSuffix = numberOfEssentialModels === 1 ? '' : 's';
  const essentialTissuesSuffix = totalNumberOfTissues === 1 ? '' : 's';

  return (
    <Fragment>

      <Spinner
        loading={loading}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Gene summary
            </CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <div className="text-center">Loss of fitness in <b>{numberOfEssentialModels}</b> cell
                  line{essentialModelsSuffix}</div>
              </Col>
              <Col>
                <div className="text-center">Loss of fitness in <b>{numberOfEssentialTissues}</b> cancer
                  type{essentialTissuesSuffix}</div>
              </Col>
              <Col>
                <div className="text-center">Pan-cancer core fitness</div>
              </Col>
              <Col>
                <div className="text-center">Tumour suppressor</div>
              </Col>
            </Row>
            <Row>
              <Col>
                <SignificantCountPlot
                  total={totalModels}
                  significant={numberOfEssentialModels}
                />
              </Col>
              <Col>
                <SignificantCountPlot
                  total={totalNumberOfTissues}
                  significant={numberOfEssentialTissues}
                />
              </Col>
              <Col>
                <HasAttribute
                  attribute={isPanCancer}
                />
              </Col>
              <Col>
                <HasAttribute
                  attribute={isTumourSuppressor}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Spinner>

    </Fragment>
  );
}

export default withRouter(GeneSummaryPlots);