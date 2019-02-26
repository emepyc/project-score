import React, {useState, useEffect} from 'react';
import TableDisplay from '../TableDisplay';
import {withRouter} from 'react-router-dom';
import classnames from 'classnames';
import useUrlParams from '../useUrlParams';
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

  const [data, setData] = useState([]);
  const [sort] = useState('fc_clean');
  const [search, setSearch] = useState("");
  const [pageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  // const [sortDirection, setSortDirection] = useState(1);
  const [totalHits, setTotalHits] = useState(null);

  const [urlParams] = useUrlParams(props);

  const goPrev = () => setPageNumber(pageNumber - 1);
  const goNext = () => setPageNumber(pageNumber + 1);

  useEffect(() => {
    const params = {
      geneId: urlParams.geneId,
      modelId: urlParams.modelId,
      sort,
      pageSize,
      pageNumber,
      search,
      tissue: urlParams.tissue,
      scoreRange: urlParams.score,
    };

    fetchCrisprData(params)
      .then(resp => {
        setData(parseData(resp.data));
        setTotalHits(resp.count)
      })
  }, [
    urlParams.geneId,
    urlParams.modelId,
    sort,
    pageSize,
    pageNumber,
    search,
    urlParams.tissue,
    JSON.stringify(urlParams.score)
  ]);

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
