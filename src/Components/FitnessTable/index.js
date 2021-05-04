import React, {useState, useEffect, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import debounce from 'lodash.debounce';
import {Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import TableDisplay, {sangerLogo} from '../TableDisplay';
import useUrlParams from '../useUrlParams';
import Spinner from '../Spinner';
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import {fetchCrisprData} from '../../api';
import useFetchData from "../useFetchData";
import Error from '../Error';

import './customTable.scss';
import {CSVLink} from "react-csv";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";

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
      source: d.source,
    }
  });
}

function FitnessTable(props) {
  const {showSearchbox} = props;

  const [urlParams] = useUrlParams(props);

  const [data, setData] = useState([]);
  const [sort, setSort] = useState('fc_clean');
  const [sortDirection, setSortDirection] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [totalHits, setTotalHits] = useState(null);


  const params = {
    geneId: urlParams.geneId,
    modelId: urlParams.modelId,
    excludePanCancerGenes: urlParams.excludePanCancerGenes,
    sort,
    sortDirection,
    pageSize: rowsPerPage,
    pageNumber,
    search,
    analysis: urlParams.analysis,
    scoreMin: urlParams.scoreMin,
    scoreMax: urlParams.scoreMax,
  };

  const deps = [
    urlParams.geneId,
    urlParams.modelId,
    sort,
    sortDirection,
    rowsPerPage,
    pageNumber,
    search,
    urlParams.scoreMin,
    urlParams.scoreMax,
    urlParams.excludePanCancerGenes,
    urlParams.analysis,
  ];

  const [dataResponse, loading, error] = useFetchData(
    fetchCrisprData,
    params,
    deps,
  );

  const goPrev = () => setPageNumber(pageNumber - 1);
  const goNext = () => setPageNumber(pageNumber + 1);

  useEffect(() => {
    if (dataResponse !== null) {
      setData(parseData(dataResponse.data));
      setTotalHits(dataResponse.count);
    }
  }, [dataResponse]);

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber >= totalHits / rowsPerPage;

  if (error !== null) {
    return (
      <Error message="Error loading data"/>)
  }

  return (
    <div className='fitness-table'>

      <div className='d-flex h-100 justify-content-between'>
        <div className='my-auto mr-auto p-1'>
          <div>
            Showing {' '}
            <span className='font-weight-bold'>{rowsPerPage * (pageNumber - 1) + 1}</span> - {' '}
            <span className='font-weight-bold'>{rowsPerPage * (pageNumber - 1) + rowsPerPage}</span> out of {' '}
            <span className='font-weight-bold'>{totalHits}</span> fitness values
          </div>
        </div>
        {showSearchbox && (
          <div>
            <GeneSearchbox
              onInputChange={(input) => setSearch(input.toUpperCase())}
              deferTime={1000}
            />
          </div>
        )}
        <div className='align-self-center ml-2'>
          <CSVLink data={data} filename='depmap-fitness-table.csv'>
            <FontAwesomeIcon
              icon={faDownload}
              title='Download as CSV'
              size='sm'
            />
          </CSVLink>
        </div>
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

      <div className='d-flex justify-content-between'>
        <div>
          <Pagination>
            <PaginationItem disabled={isFirstPage}>
              <PaginationLink onClick={goPrev}>
                Previous
              </PaginationLink>
            </PaginationItem>
            <small style={{padding: '0.75rem 0.25rem'}}>
            </small>
            <PaginationItem disabled={isLastPage}>
              <PaginationLink onClick={goNext}>
                Next
              </PaginationLink>
            </PaginationItem>
          </Pagination>
          Page <b>{pageNumber}</b> of {1 + ~~(totalHits / rowsPerPage)}
        </div>
        <div>
          Rows per page:{' '}
          <Input
            type='select'
            defaultValue={rowsPerPage}
            onChange={event => setRowsPerPage(+event.target.value)}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Input>
        </div>
      </div>
    </div>
  )
}

export default withRouter(FitnessTable);

function GeneSearchbox({onInputChange, deferTime = 300}) {
  const [inputValue, setInputValue] = useState("");

  const debounced = useRef(debounce((value) => onInputChange(value), deferTime));

  useEffect(() => debounced.current(inputValue), [inputValue]);

  return (
    <div className='p-1'>
      <InputGroup
        style={{width: '300px'}}
      >
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
