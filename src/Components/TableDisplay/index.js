import React, {Fragment} from 'react';
import {Table} from 'reactstrap';

function TableDisplay(props) {
  const data = props.data;

  return (
    <Fragment>
      <Table>
        <thead>
        <tr>
          <th>
            Gene
          </th>
          <th>
            Model
          </th>
          <th>
            Tissue
          </th>
          <th>
            <nobr>
              Corrected log fold change{' '}
            </nobr>
          </th>
          <th>
            <nobr>
              Loss of fitness score{' '}
            </nobr>
          </th>
        </tr>
        </thead>

        <tbody>
          {data.map(row => (
            <tr
              key={`${row[0]}-${row[1]}`}
            >
              <td>
                {row[0]}
              </td>
              <td>
                {row[1]}
              </td>
              <td>
                {row[2]}
              </td>
              <td>
                {row[3]}
              </td>
              <td>
                {row[4]}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  );
}

export default TableDisplay;
