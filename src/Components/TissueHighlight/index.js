import React, {useState, useEffect} from 'react';
import {Row, Col} from 'reactstrap';
import {tissueColor} from '../../colors';
import {fetchTissues} from '../../api';
import FetchData from "../FetchData";

function tissueFilterElement(tissue, key, onSelectTissue) {
  return (
    <div key={key}>
      <div
        style={{
          display: 'inline-block',
          backgroundColor: tissueColor[tissue],
          width: '10px',
          height: '10px',
          borderRadius: '5px'
        }}
      />
      <span
        style={{paddingLeft: '5px', cursor: 'pointer'}}
        onMouseOver={() => onSelectTissue(tissue)}
        onMouseOut={() => onSelectTissue(null)}
      >
          {tissue}
      </span>
    </div>
  );
}


function TissuesHighlight({blocks, onSelectTissue}) {
  return (
    <FetchData
      endpoint={fetchTissues}
    >
      {
        tissuesResponse => {
          const tissues = tissuesResponse.map(tissue => tissue.tissue);
          const tissuesPerBlock = Math.round(tissues.length / blocks);

          return (
            <Row
              style={{marginTop: '20px'}}
            >
              {[...Array(blocks).keys()].map(block => {
                return (
                  <Col xs={12 / blocks} key={block}>
                    {[...Array(tissuesPerBlock).keys()].map(pos => tissueFilterElement(
                      tissues[block * tissuesPerBlock + pos],
                      `${block}${tissuesPerBlock}${pos}`,
                      onSelectTissue,
                      )
                    )}
                  </Col>
                );
              })}
            </Row>
          );
        }
      }
    </FetchData>
  );
}

export default TissuesHighlight;
