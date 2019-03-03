import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {Range} from 'rc-slider';
import {fetchScoreExtent} from '../../api';
import useUrlParams from '../useUrlParams';
import 'rc-slider/assets/index.css';
import './scoreRangeSlider.scss';
import Spinner from '../Spinner';

function ScoreRangeFilter(props) {
  const [urlParams, , setUrlParams] = useUrlParams(props, 500);

  const [scoreRange, setScoreRange] = useState(urlParams.score);
  const [scoreExtent, setScoreExtent] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (range) => {
    setScoreRange(range);
    setUrlParams({
      score: range,
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

  return (
    <Spinner loading={loading}>
      <Range
        allowCross={false}
        min={scoreExtent[0]}
        max={scoreExtent[1]}
        value={scoreRange || scoreExtent}
        step={0.00001}
        defaultValue={scoreExtent}
        onChange={onChange}
      />
      <div className='my-2'>
        Score range:
      </div>
      <div className='my-2'>
        From <span className='rangeNumber'>{scoreRange ? scoreRange[0] : scoreExtent[0]}</span> to <span className='rangeNumber'>{scoreRange ? scoreRange[1] : scoreExtent[1]}</span>
      </div>
    </Spinner>
  );
}

export default withRouter(ScoreRangeFilter);
