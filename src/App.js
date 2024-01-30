import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import React from 'react';
import { useTable, useFilters, usePagination } from 'react-table';

function App() {
  const data = React.useMemo(() =>
  [
  {
  name: 'Kim Parrish',
  address: '4420 Valley Street, Garnerville, NY 10923',
  date: '07/11/2020',
  order: '87349585892118',
  },
  {
  name: 'Michele Castillo',
  address: '637 Kyle Street, Fullerton, NE 68638',
  date: '07/11/2020',
  order: '58418278790810',
  },
  {
  name: 'Eric Ferris',
  address: '906 Hart Country Lane, Toccoa, GA 30577',
  date: '07/10/2020',
  order: '81534454080477',
  },
  {
  name: 'Gloria Noble',
  address: '2403 Edgewood Avenue, Fresno, CA 93721',
  date: '07/09/2020',
  order: '20452221703743',
  },
  {
  name: 'Darren Daniels',
  address: '882 Hide A Way Road, Anaktuvuk Pass, AK 99721',
  date: '07/07/2020',
  order: '22906126785176',
  },
  {
  name: 'Ted McDonald',
  address: '796 Bryan Avenue, Minneapolis, MN 55406',
  date: '07/07/2020',
  order: '87574505851064',
  },
  ],
  []
 )

 const columns = React.useMemo(
  () => [
  {
  Header: 'User Info',
  columns: [
  {
  Header: 'Name',
  accessor: 'name',
  },
  {
  Header: 'Address',
  accessor: 'address',
  },
  ],
  },
  {
  Header: 'Order Info',
  columns: [
  {
  Header: 'Date',
  accessor: 'date',
  },
  {
  Header: 'Order #',
  accessor: 'order',
  },
  ],
  },
  ],
  []
 )

 const defaultColumn = React.useMemo(
  () => ({
    Filter: TextFilter,
  }),
  []
 )


 const {
  getTableProps,
  getTableBodyProps,
  headerGroups,
  prepareRow,
  page,
  pageOptions,
  state: { pageIndex },
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
 } = useTable({ columns, data, defaultColumn, initialState: { pageSize: 2 }, }, usePagination, useFilters,)

 function TextFilter({
  column: { filterValue, preFilteredRows, setFilter },
 }) {
  const count = preFilteredRows.length
 
  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={`Search ${count} records...`}
    />
  )
 }


 const [fetchedData, setData] = useState([]);
 const API_URL = 'https://jsonplaceholder.typicode.com/posts';
 const fetchData = async () => {
  try {
    const response = await fetch(API_URL);
    const newData = await response.json();
    setData(newData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


useEffect(() => {
  fetchData();
}, []);

  return (
    <div>
          <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}>{column.render('Header')}
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {page.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
           <div>
       <button onClick={() => previousPage()} disabled={!canPreviousPage}>
         Previous Page
       </button>
       <button onClick={() => nextPage()} disabled={!canNextPage}>
         Next Page
       </button>
       <div>
         Page{' '}
         <em>
           {pageIndex + 1} of {pageOptions.length}
         </em>
       </div>
     </div>
     <div>
     <div>
      {/* Display the fetched or cached data in your UI */}
      <h1>Data from API:</h1>
      <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
    </div>
    </div>
    </div>
   );
}

export default App;
