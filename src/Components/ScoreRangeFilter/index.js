import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';

import {fetchScoreExtent} from '../../api';
import useUrlParams from '../useUrlParams';
import FetchData from "../FetchData";
import {Range} from "../RangeSlider";

import './scoreRangeSlider.scss';

function ScoreRangeFilter(props) {
  const [urlParams, , setUrlParams] = useUrlParams(props);

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
            <div className='my-2'>
              Score range:
            </div>
            <Range
              width={300} // TODO: Hardcoded?
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
  );
}

export default withRouter(ScoreRangeFilter);
