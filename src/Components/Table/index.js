import React, {useState, useEffect} from 'react';
import {withRouter} from 'react-router-dom';
import {Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import TableDisplay from '../TableDisplay';
import useUrlParams from '../useUrlParams';
import Spinner from '../Spinner';
// The searchbox for the table has been disabled because there is no way to search for genes names / disease names
// If the API supports that we can uncomment the functionality (and make sure the search terms are treated properly)
// import {
//   Input,
//   InputGroup,
//   InputGroupAddon,
//   InputGroupText,
// } from 'reactstrap';
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
  const [sort, setSort] = useState('fc_clean');
  // const [search, setSearch] = useState("");
  const [pageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortDirection, setSortDirection] = useState(1);
  const [totalHits, setTotalHits] = useState(null);

  const [urlParams] = useUrlParams(props);

  const goPrev = () => setPageNumber(pageNumber - 1);
  const goNext = () => setPageNumber(pageNumber + 1);

  useEffect(() => {
    const params = {
      geneId: urlParams.geneId,
      modelId: urlParams.modelId,
      sort,
      sortDirection,
      pageSize,
      pageNumber,
      // search,
      tissue: urlParams.tissue,
      scoreMin: urlParams.scoreMin,
      scoreMax: urlParams.scoreMax,
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
    sortDirection,
    pageSize,
    pageNumber,
    // search,
    urlParams.tissue,
    urlParams.scoreMin,
    urlParams.scoreMax,
  ]);

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber >= totalHits / pageSize;

  // TODO: debounce
  // const doSearch = (ev) => {
  //   const {value} = ev.target;
  //   setSearch(value);
  // };

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

        {/*<div className='p-1'>*/}
          {/*<InputGroup style={{width: '300px'}}>*/}
            {/*<InputGroupAddon addonType="prepend">*/}
              {/*<InputGroupText>Search</InputGroupText>*/}
            {/*</InputGroupAddon>*/}
            {/*<Input value={search} onChange={doSearch}/>*/}
          {/*</InputGroup>*/}
        {/*</div>*/}


      </div>

      <Spinner
        loading={loading}
      >

        <TableDisplay
          {...props}
          data={data}
          sortDirection={sortDirection}
          sort={sort}
          onSortChange={(sortField) => {
            if (sortField !== sort) {
              setSortDirection(1);
              setSort(sortField);
            } else {
              setSortDirection(sortDirection * -1);
            }
          }}
        />
      </Spinner>

      <Pagination>
        <PaginationItem disabled={isFirstPage}>
          <PaginationLink href='#' onClick={goPrev}>
            Previous
          </PaginationLink>
        </PaginationItem>
        <small style={{padding: '0.75rem 0.25rem'}}>
        </small>
        <PaginationItem disabled={isLastPage}>
          <PaginationLink href='#' onClick={goNext}>
            Next
          </PaginationLink>
        </PaginationItem>
      </Pagination>
      Page <b>{pageNumber}</b> of {1 + ~~(totalHits / pageSize)}
    </div>
  )
}

export default withRouter(Table);
