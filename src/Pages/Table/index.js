import React from 'react';
import _Table from '../../Components/Table';
import TissueFilter from '../../Components/TissueFilter';


function Table(props) {
  return (
    <div>
      <TissueFilter />
      <_Table />
    </div>
  )
}

export default Table;
