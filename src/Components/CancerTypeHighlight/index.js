import React from 'react';
import {Row, Col} from 'reactstrap';
import {cancerTypeColorDict as cancerTypeColor} from '../../colors';
import {fetchCancerTypes} from '../../api';
import FetchData from "../FetchData";

function cancerTypeFilterElement(cancerType, key, onSelectCancerType) {
  return (
    <div key={key}>
      <div
        style={{
          display: 'inline-block',
          backgroundColor: cancerTypeColor[cancerType],
          width: '10px',
          height: '10px',
          borderRadius: '5px'
        }}
      />
      <span
        style={{paddingLeft: '5px', cursor: 'pointer', fontSize: '0.9em'}}
        onMouseOver={() => onSelectCancerType(cancerType)}
        onMouseOut={() => onSelectCancerType(null)}
      >
          {cancerType}
      </span>
    </div>
  );
}


function CancerTypeHighlight({blocks, onSelectCancerType}) {
  return (
    <FetchData
      endpoint={fetchCancerTypes}
    >
      {
        cancerTypesResponse => {
          const cancerTypes = cancerTypesResponse.map(cancerType => cancerType.name);
          const cancerTypesPerBlock = Math.round(cancerTypes.length / blocks);

          return (
            <Row
              style={{marginTop: '20px'}}
            >
              {[...Array(blocks).keys()].map(block => {
                return (
                  <Col xs={12 / blocks} key={block}>
                    {[...Array(cancerTypesPerBlock).keys()].map(pos => cancerTypeFilterElement(
                      cancerTypes[block * cancerTypesPerBlock + pos],
                      `${block}${cancerTypesPerBlock}${pos}`,
                      onSelectCancerType,
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

export default CancerTypeHighlight;
