import React, {useState, useRef} from 'react';
import {withRouter} from 'react-router-dom';

import {fetchScoreExtent} from '../../api';
import useUrlParams from '../useUrlParams';
import FetchData from "../FetchData";
import {Range} from "../RangeSlider";
import useWidth from "../useWidth";

import './scoreRangeSlider.scss';

function ScoreRangeFilter(props) {
  const [urlParams, , setUrlParams] = useUrlParams(props);
  const containerRef = useRef(null);
  const width = useWidth(containerRef);

  const params = {
    analysis: urlParams.analysis,
    geneId: urlParams.geneId,
    modelId: urlParams.modelId,
    excludePanCancerGenes: urlParams.excludePanCancerGenes,
  };

  const [scoreMin, setScoreMin] = useState(urlParams.scoreMin);
  const [scoreMax, setScoreMax] = useState(urlParams.scoreMax);

  const onChange = (range) => {
    setScoreMin(range[0]);
    setScoreMax(range[1]);
    setUrlParams({
      scoreMin: range[0],
      scoreMax: range[1],
    })
  };

  return (
    <div ref={containerRef}>
      <FetchData
        endpoint={fetchScoreExtent}
        params={params}
        deps={[
          urlParams.analysis,
          urlParams.geneId,
          urlParams.modelId,
          urlParams.excludePanCancerGenes,
        ]}
      >
        {newScoreExtent => {
          const scoreRange = [
            scoreMin === undefined ? newScoreExtent.min : +scoreMin,
            scoreMax === undefined ? newScoreExtent.max : +scoreMax,
          ];

          return (
            <React.Fragment>
              <div className='my-1'>
                Score range:
              </div>
              <Range
                width={width} // TODO: Hardcoded?
                min={newScoreExtent.min}
                max={newScoreExtent.max}
                value={scoreRange}
                step={0.00001}
                defaultValue={[newScoreExtent.min, newScoreExtent.max]}
                onChange={onChange}
              />
            </React.Fragment>
          );
        }}
      </FetchData>
    </div>
  );
}

export default withRouter(ScoreRangeFilter);
