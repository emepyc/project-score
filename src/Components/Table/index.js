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
  const [urlTissue, setUrlTissue] = useState("");
  const [data, setData] = useState([]);
  const [sort, setSort] = useState('fc_clean');
  const [filter, setFilter] = useState([]);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortDirection, setSortDirection] = useState(1);
  const [totalHits, setTotalHits] = useState(null);

  const {tissue} = qs.parse(props.location.search);

  props.history.listen(() => {
    console.log('changes in the url, we get this tissue now...');
    const {tissue} = qs.parse(props.location.search);
    console.log(tissue);
    setUrlTissue(tissue);
  });

  const goPrev = () => setPageNumber(pageNumber - 1);
  const goNext = () => setPageNumber(pageNumber + 1);

  useEffect(() => {
    const params = {
      sort,
      pageNumber,
      search,
      tissue,
    };
    fetchCrisprData(params)
      .then(resp => {
        setData(parseData(resp.data));
        setTotalHits(resp.count)
      })
  }, [sort, pageNumber, search, urlTissue]);

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
    console.log(`search for string: ${value}`);
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
