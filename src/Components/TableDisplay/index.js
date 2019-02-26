import React, {Fragment, useState} from 'react';
import {Table} from 'reactstrap';

function TableDisplay(props) {
  const data = props.data;

  const [selectedRow, setSelectedRow] = useState("");

  const getKeyForRow = (row) => `${row[0]}-${row[1]}`;

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
          {data.map(row => {
            const key = getKeyForRow(row);
            return (
              <tr
                style={{backgroundColor: (selectedRow === key ? '#eeeeee' : '#ffffff')}}
                key={key}
                onMouseOver={() => {setSelectedRow(key)}}
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
            )
          })}
        </tbody>
      </Table>
    </Fragment>
  );
}

export default TableDisplay;
