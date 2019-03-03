import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import TableDisplay from '../TableDisplay';
import useUrlParams from '../useUrlParams';
import Spinner from '../Spinner';
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import {fetchCrisprData} from '../../api';

import './customTable.scss';

function parseData(raw) {
  return raw.map(d => {
    return {
      geneSymbol: d.gene.symbol,
      modelName: d.model.names[0],
      tissue: d.model.sample.tissue.name,
      fc_clean: d.fc_clean,
      bf_scaled: d.bf_scaled,
      modelId: d.model.id,
      geneId: d.gene.id,
    }
  });
}

function Table(props) {
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    fetchCrisprData(params)
      .then(resp => {
        setLoading(false);
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

  // TODO: debounce
  const doSearch = (ev) => {
    const {value} = ev.target;
    setSearch(value);
  };

  return (
    <div className='essentialities-table'>

      <div className='d-flex h-100'>

        <div className='my-auto mr-auto p-1'>
          <div>
            Showing {' '}
            <span className='font-weight-bold'>{pageSize * (pageNumber - 1) + 1}</span> - {' '}
            <span className='font-weight-bold'>{pageSize * (pageNumber - 1) + pageSize}</span> out of {' '}
            <span className='font-weight-bold'>{totalHits}</span> essentialities
          </div>
        </div>

        <div className='p-1'>
          <InputGroup style={{width: '300px'}}>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Search</InputGroupText>
            </InputGroupAddon>
            <Input value={search} onChange={doSearch}/>
          </InputGroup>
        </div>


      </div>

      <Spinner
        loading={loading}
      >

        <TableDisplay
          {...props}
          data={data}
        />
      </Spinner>

      <Pagination>
        <PaginationItem disabled={isFirstPage}>
          <PaginationLink previous href='#' onClick={goPrev}/>
        </PaginationItem>
        <small style={{padding: '0.75rem 0.25rem'}}>
        </small>
        <PaginationItem disabled={isLastPage}>
          <PaginationLink next href='#' onClick={goNext}/>
        </PaginationItem>
      </Pagination>
      Page <b>{pageNumber}</b> of {1 + ~~(totalHits / pageSize)}
    </div>
  )
}

export default withRouter(Table);
