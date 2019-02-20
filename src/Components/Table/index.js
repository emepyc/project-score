import React, {useState, useEffect} from 'react';
import TableDisplay from '../TableDisplay';
import classnames from 'classnames';
import {
  Nav,
  NavLink
} from 'reactstrap';
import {fetchCrisprData} from '../../api';

import './customTable.scss';

function parseData(raw) {
  return raw.map(d => {
    return [d.gene.symbol, d.model.names[0], d.model.sample.tissue.name, d.fc_clean, d.bf_scaled];
  });
}

export default function Table(props) {
  const [data, setData] = useState([]);
  const [sort, setSort] = useState('fc_clean');
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortDirection, setSortDirection] = useState(1);
  const [totalHits, setTotalHits] = useState(null);

  const goPrev = () => setPageNumber(pageNumber - 1);
  const goNext = () => setPageNumber(pageNumber + 1);

  useEffect(() => {
    const params = {
      sort,
      'page[number]': pageNumber,
    };
    fetchCrisprData(params)
      .then(resp => {
        setData(parseData(resp.data));
        setTotalHits(resp.count)
      })
  }, [sort, pageNumber]);

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber >= totalHits / pageSize;

  const navPrevClass = classnames({
    disabled: isFirstPage,
  });
  const navNextClass = classnames({
    disabled: isLastPage,
  });

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
      <TableDisplay
        {...props}
        data={data}
      />
    </div>
  )
}
