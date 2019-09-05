import React, {useState, useEffect} from 'react';
import {Row, Col} from 'reactstrap';
import {tissueColor} from '../../colors';
import {fetchTissues} from '../../api';
import Spinner from '../Spinner';
import Error from '../Error';
import useFetchData from "../useFetchData";

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
  const [tissuesResponse, loading, error] = useFetchData(
    () => fetchTissues(),
    [],
  );
  const [tissues, setTissues] = useState([]);

  const tissuesPerBlock = Math.round(tissues.length / blocks);

  useEffect(() => {
    if (tissuesResponse) {
        setTissues(tissuesResponse.map(tissue => tissue.tissue));
    }
  }, [tissuesResponse]);

  if (error !== null) {
    return (
      <Error
        message="Error loading data"
      />
    )
  }

  return (
    <Spinner
      loading={loading}
    >
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
    </Spinner>
  );
}

export default TissuesHighlight;
