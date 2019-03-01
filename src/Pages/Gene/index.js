import React, {useState} from 'react';
import {ButtonGroup, Button} from 'reactstrap';
import Table from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';
import ScoreRangeFilter from '../../Components/ScoreRangeFilter';
import EssentialitiesPlot from '../../Components/EssentialitiesPlot';
import GeneInfoSummary from '../../Components/GeneInfoSummary';
import TissueHighlight from '../../Components/TissueHighlight';
import {Row, Col} from 'reactstrap';
import Card from '../../Components/Card';
import {CardBody, CardTitle} from 'reactstrap';


function Gene() {

  const [tissues, setTissues] = useState([]);
  const [colorBy, setColorBy] = useState("score");
  const [attributeToPlot, setAttributeToPlot] = useState("fc_clean");
  const onTissuesLoaded = (tissues) => setTissues(tissues);

  return (
    <div>
      <GeneInfoSummary/>
      <Card>
        <Row>
          <Col>
            <TissueFilter/>
          </Col>
          <Col>
            <ScoreRangeFilter/>
          </Col>
        </Row>
      </Card>

      <Row>
        <Col lg={{size: 6}} md={{size: 12}}>
          <Card>
            <CardTitle>
              Essentiality plot
            </CardTitle>
            <CardBody>
              <Row>
                <Col>
                  <ButtonGroup>
                    <Button
                      active={attributeToPlot === "fc_clean"}
                      outline={attributeToPlot !== "fc_clean"}
                      onClick={() => setAttributeToPlot("fc_clean")}
                    >
                      Corrected log fold change
                    </Button>
                    <Button
                      active={attributeToPlot === "bf_scaled"}
                      outline={attributeToPlot !== "bf_scaled"}
                      onClick={() => setAttributeToPlot("bf_scaled")}
                    >
                      Loss of fitness score
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <EssentialitiesPlot
                onTissuesLoaded={onTissuesLoaded}
                colorBy={colorBy}
                attributeToPlot={attributeToPlot}
                xAxisLabel="Cell lines"
              />
              <Row>
                <Col>
                  <ButtonGroup>
                    <Button
                      active={colorBy === "score"}
                      outline={colorBy !== "score"}
                      onClick={() => setColorBy("score")}
                    >
                      Color by score
                    </Button>
                    <Button
                      active={colorBy === "tissue"}
                      outline={colorBy !== "tissue"}
                      onClick={() => setColorBy("tissue")}
                    >
                      Color by tissue
                    </Button>
                  </ButtonGroup>
                  {colorBy === "tissue" && (
                    <TissueHighlight
                      tissues={tissues}
                      blocks={4}
                    />
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col lg={{size: 6}} md={{size: 12}}>
          <Card>
            <CardTitle>
              Essentiality Table
            </CardTitle>
            <CardBody>
              <Row>
                <Col xs={{size: 12}}>
                  <Table/>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Gene;
