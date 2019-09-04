import classNames from 'classnames';
import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Range} from 'rc-slider';
import {fetchScoreExtent} from '../../api';
import useUrlParams from '../useUrlParams';
import FetchData from "../FetchData";

import 'rc-slider/assets/index.css';
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

        const fromClasses = classNames({
          rangeNumber: true,
          significantScore: scoreRange[0] < 0,
        });

        const toClasses = classNames({
          rangeNumber: true,
          significantScore: scoreRange[1] < 0,
        });

        return (
          <React.Fragment>
            <Range
              allowCross={false}
              min={newScoreExtent.min}
              max={newScoreExtent.max}
              value={scoreRange}
              step={0.00001}
              defaultValue={[newScoreExtent.min, newScoreExtent.max]}
              onChange={onChange}
            />
            <div className='my-2'>
              Score range:
            </div>
            <div className='my-2'>
              From <span className={fromClasses}>{scoreRange[0]}</span> to <span
              className={toClasses}>{scoreRange[1]}</span>
            </div>
          </React.Fragment>
        );
      }}
    </FetchData>
  );
}

export default withRouter(ScoreRangeFilter);
