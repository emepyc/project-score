import React, {useState, useEffect} from 'react';
import {Row, Col} from 'reactstrap';
import colors from '../../colors';
import {fetchTissues} from '../../api';
import Spinner from '../Spinner';

function tissueFilterElement(tissue, key) {
  return (
    <div key={key}>
      <div
        style={{
          display: 'inline-block',
          backgroundColor: colors[tissue],
          width: '10px',
          height: '10px',
          borderRadius: '5px'
        }}
      />
      <span
        style={{paddingLeft: '5px'}}
        // key={key}
        // onMouseOver={() => this.mouseOverTissue(tissue)}
      >
          {tissue}
      </span>
    </div>
  );
}


function TissuesHighlight({blocks}) {
  const [tissues, setTissues] = useState([]);
  const [loadingTissues, setLoadingTissues] = useState(false);

  const tissuesPerBlock = Math.round(tissues.length / blocks);

  useEffect(() => {
    setLoadingTissues(true);
    fetchTissues()
      .then(resp => {
        setLoadingTissues(false);
        setTissues(resp.map(tissue => tissue.tissue));
      })
  }, []);

  return (
    <Spinner
      loading={loadingTissues}
    >
      <Row
        style={{marginTop: '20px'}}
      >
        {[...Array(blocks).keys()].map(block => {
          return (
            <Col xs={12 / blocks} key={block}>
              {[...Array(tissuesPerBlock).keys()].map(pos => tissueFilterElement(
                tissues[block * tissuesPerBlock + pos],
                `${block}${tissuesPerBlock}${pos}`
                )
              )}
            </Col>
          );
        })}
      </Row>
    </Spinner>
  );
}

export default TissuesHighlight;
