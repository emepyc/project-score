import React, {useState, useEffect, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import { Range } from 'rc-slider';
import {fetchScoreExtent} from '../../api';
import qs from "query-string";
import debounce from 'lodash.debounce';
import 'rc-slider/assets/index.css';
import './scoreRangeSlider.scss';

function setRangeInUrl(history, params) {
  history.push({
    search: `?${qs.stringify(params)}`,
  })
}

const deferredSetRangeInUrl = debounce(setRangeInUrl, 500);

function ScoreRangeFilter(props) {
  const urlParams = qs.parse(props.location.search);
  const {tissue, score: scoreRaw} = urlParams;
  const initialScoreRange = scoreRaw ? JSON.parse(scoreRaw) : null;

  const [scoreRange, setScoreRange] = useState(initialScoreRange);
  const [scoreExtent, setScoreExtent] = useState(null);
  const [urlTissue, setUrlTissue] = useState(tissue);

  props.history.listen(() => {
    const {tissue} = qs.parse(props.location.search);
    setUrlTissue(tissue);
  });

  const onChange = (range) => {
    setScoreRange(range);
    deferredSetRangeInUrl(props.history, {
        ...urlParams,
        score: JSON.stringify(range),
      }
    )
  };

  useEffect(() => {
    const params = {
      tissue,
    };
    fetchScoreExtent(params)
      .then(newScoreExtent => {
        setScoreExtent([newScoreExtent.min, newScoreExtent.max]);
      });
  }, [tissue]);

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
