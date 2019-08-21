import classNames from 'classnames';
import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {Range} from 'rc-slider';
import {fetchScoreExtent} from '../../api';
import useUrlParams from '../useUrlParams';
import Spinner from '../Spinner';
import Error from '../Error';
import useFetchData from "../useFetchData";

import 'rc-slider/assets/index.css';
import './scoreRangeSlider.scss';

function ScoreRangeFilter(props) {
  const [urlParams, , setUrlParams] = useUrlParams(props);

  const params = {
    tissue: urlParams.tissue,
    geneId: urlParams.geneId,
    modelId: urlParams.modelId,
    excludePanCancerGenes: urlParams.excludePanCancerGenes,
  };

  const [newScoreExtent, loading, error] = useFetchData(
    () => fetchScoreExtent(params),
    [
      urlParams.tissue,
      urlParams.geneId,
      urlParams.modelId,
      urlParams.excludePanCancerGenes,
    ],
  );

  const [scoreMin, setScoreMin] = useState(urlParams.scoreMin);
  const [scoreMax, setScoreMax] = useState(urlParams.scoreMax);
  const [scoreExtent, setScoreExtent] = useState(null);

  const onChange = (range) => {
    setScoreMin(range[0]);
    setScoreMax(range[1]);
    setUrlParams({
      scoreMin: range[0],
      scoreMax: range[1],
    })
  };

  useEffect(() => {
    if (newScoreExtent !== null) {
      setScoreExtent([newScoreExtent.min, newScoreExtent.max]);
    }
  }, [newScoreExtent]);

  if (error !== null) {
    return (
      <Error
        message="Error loading data"
      />
    )
  }

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
