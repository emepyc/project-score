import React from 'react';
import {Row, Col} from 'reactstrap';
import colors from '../../colors';

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


function TissuesHighlight({tissues, blocks}) {
  const tissuesPerBlock = Math.round(tissues.length / blocks);
  if (tissues.length === 0) {
    return <div/>;
  }

  return (
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
  );
}

export default TissuesHighlight;
