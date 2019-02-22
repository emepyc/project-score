import React, {useState, useEffect} from 'react';
import TableDisplay from '../TableDisplay';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';
import qs from 'query-string';
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Nav,
  NavLink,
} from 'reactstrap';
import {fetchCrisprData} from '../../api';

import './customTable.scss';

function parseData(raw) {
  return raw.map(d => {
    return [d.gene.symbol, d.model.names[0], d.model.sample.tissue.name, d.fc_clean, d.bf_scaled];
  });
}

function Table(props) {
  const {tissue, score: scoreRaw} = qs.parse(props.location.search);
  const score = scoreRaw ? JSON.parse(scoreRaw) : null;

  const [urlTissue, setUrlTissue] = useState(tissue);
  const [urlScoreRange, setUrlScoreRange] = useState(score);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState('fc_clean');
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortDirection, setSortDirection] = useState(1);
  const [totalHits, setTotalHits] = useState(null);

  props.history.listen(() => {
    const {tissue, score} = qs.parse(props.location.search);
    setUrlTissue(tissue);
    setUrlScoreRange(score);
  });

  const goPrev = () => setPageNumber(pageNumber - 1);
  const goNext = () => setPageNumber(pageNumber + 1);

  useEffect(() => {
    const params = {
      sort,
      pageNumber,
      search,
      tissue,
      scoreRange: score,
    };
    fetchCrisprData(params)
      .then(resp => {
        setData(parseData(resp.data));
        setTotalHits(resp.count)
      })
  }, [sort, pageNumber, search, tissue, JSON.stringify(score)]);

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber >= totalHits / pageSize;

  const navPrevClass = classnames({
    disabled: isFirstPage,
  });
  const navNextClass = classnames({
    disabled: isLastPage,
  });

  // TODO: debounce
  const doSearch = (ev) => {
    const {value} = ev.target;
    setSearch(value);
  };

  return (
    <div className='essentialities-table'>
      <Nav style={{float: 'left'}}>
        <NavLink className={navPrevClass} href='#' onClick={goPrev}>
          &lt;
        </NavLink>
        <small style={{padding: '0.75rem 0.25rem'}}>
          Page <b>{pageNumber}</b> of {1 + ~~(totalHits / pageSize)}{' '}
          <small style={{color: '#999999'}}>({totalHits} total rows)</small>
        </small>
        <NavLink className={navNextClass} href="#" onClick={goNext}>
          &gt;
        </NavLink>
      </Nav>

      <InputGroup style={{width: '300px'}}>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Search</InputGroupText>
        </InputGroupAddon>
        <Input value={search} onChange={doSearch} />
      </InputGroup>

      <TableDisplay
        {...props}
        data={data}
      />
    </div>
  )
}

export default withRouter(Table);
