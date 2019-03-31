import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {Range} from 'rc-slider';
import {fetchScoreExtent} from '../../api';
import useUrlParams from '../useUrlParams';
import 'rc-slider/assets/index.css';
import './scoreRangeSlider.scss';
import Spinner from '../Spinner';
import classNames from 'classnames';

function ScoreRangeFilter(props) {
  const [urlParams, , setUrlParams] = useUrlParams(props);

  const [scoreMin, setScoreMin] = useState(urlParams.scoreMin);
  const [scoreMax, setScoreMax] = useState(urlParams.scoreMax);
  const [scoreExtent, setScoreExtent] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (range) => {
    setScoreMin(range[0]);
    setScoreMax(range[1]);
    setUrlParams({
      scoreMin: range[0],
      scoreMax: range[1],
    })
  };

  useEffect(() => {
    const params = {
      tissue: urlParams.tissue,
      geneId: urlParams.geneId,
      modelId: urlParams.modelId,
    };
    setLoading(true);
    fetchScoreExtent(params)
      .then(newScoreExtent => {
        setScoreExtent([newScoreExtent.min, newScoreExtent.max]);
        setLoading(false)
      });
  }, [urlParams.tissue, urlParams.geneId, urlParams.modelId]);

  if (!scoreExtent) {
    return (
      <Spinner loading={loading}>
        <div style={{minHeight: '30px'}}/>
      </Spinner>
    );
  }

  const scoreRange = [
    scoreMin === undefined ? scoreExtent[0] : +scoreMin,
    scoreMax === undefined ? scoreExtent[1] : +scoreMax,
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
    <Spinner loading={loading}>
      <Range
        allowCross={false}
        min={scoreExtent[0]}
        max={scoreExtent[1]}
        value={scoreRange}
        step={0.00001}
        defaultValue={scoreExtent}
        onChange={onChange}
      />
      <div className='my-2'>
        Score range:
      </div>
      <div className='my-2'>
        From <span className={fromClasses}>{scoreRange[0]}</span> to <span className={toClasses}>{scoreRange[1]}</span>
      </div>
    </Spinner>
  );
}

export default withRouter(ScoreRangeFilter);
