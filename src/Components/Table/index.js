import React, {useState, useEffect, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import debounce from 'lodash.debounce';
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
      isPanCancer: d.gene.essentiality_profiles[0].core_fitness_pancan,
    }
  });
}

function Table(props) {
  const {showSearchbox} = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState('fc_clean');
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
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
      excludePanCancerGenes: urlParams.excludePanCancerGenes,
      sort,
      sortDirection,
      pageSize,
      pageNumber,
      search,
      analysis: urlParams.analysis,
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
    search,
    urlParams.scoreMin,
    urlParams.scoreMax,
    urlParams.excludePanCancerGenes,
    urlParams.analysis,
  ]);

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber >= totalHits / pageSize;

  return (
    <div className='fitness-table'>

      <div className='d-flex h-100'>

        <div className='my-auto mr-auto p-1'>
          <div>
            Showing {' '}
            <span className='font-weight-bold'>{pageSize * (pageNumber - 1) + 1}</span> - {' '}
            <span className='font-weight-bold'>{pageSize * (pageNumber - 1) + pageSize}</span> out of {' '}
            <span className='font-weight-bold'>{totalHits}</span> fitness values
          </div>
        </div>

        {showSearchbox && (
          <GeneSearchbox
            onInputChange={(input) => setSearch(input.toUpperCase())}
            deferTime={1000}
          />
        )}

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

function GeneSearchbox({onInputChange, deferTime=300}) {
  const [inputValue, setInputValue] = useState("");

  const debounced = useRef(debounce((value) => onInputChange(value), deferTime));

  useEffect(() => debounced.current(inputValue), [inputValue]);

  return (
    <div className='p-1'>
      <InputGroup style={{width: '300px'}}>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Search</InputGroupText>
        </InputGroupAddon>
        <Input
          placeholder='Search for gene symbol'
          value={inputValue}
          onChange={(ev) => setInputValue(ev.target.value)}
        />
      </InputGroup>
    </div>
  );
}
