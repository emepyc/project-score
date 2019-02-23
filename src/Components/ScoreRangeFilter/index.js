import React, {useState, useEffect, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import { Range } from 'rc-slider';
import {fetchScoreExtent} from '../../api';
import useUrlParams from '../useUrlParams';
import 'rc-slider/assets/index.css';
import './scoreRangeSlider.scss';

function ScoreRangeFilter(props) {
  const [urlParams, , setUrlParams] = useUrlParams(props, 500);

  const [scoreRange, setScoreRange] = useState(urlParams.score);
  const [scoreExtent, setScoreExtent] = useState(null);

  const onChange = (range) => {
    setScoreRange(range);
    setUrlParams({
      score: range,
    })
  };

  useEffect(() => {
    const params = {
      tissue: urlParams.tissue,
    };
    fetchScoreExtent(params)
      .then(newScoreExtent => {
        setScoreExtent([newScoreExtent.min, newScoreExtent.max]);
      });
  }, [urlParams.tissue]);

  if (!scoreExtent) {
    return (
      <div />
    );
  }

  return (
    <Fragment>
      <Range
        allowCross={false}
        min={scoreExtent[0]}
        max={scoreExtent[1]}
        value={scoreRange || scoreExtent}
        step={0.00001}
        defaultValue={scoreExtent}
        onChange={onChange}
      />
      <div>
        Extent ranging from {scoreExtent[0]} to {scoreExtent[1]}
      </div>
      <div>
        Score ranging from {scoreRange ? scoreRange[0] : scoreExtent[1]} to {scoreRange ? scoreRange[1] : scoreExtent[1]}
      </div>
    </Fragment>
  );
}

export default withRouter(ScoreRangeFilter);
