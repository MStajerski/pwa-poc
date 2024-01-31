import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';
import React from 'react';
import { useTable, useFilters, usePagination } from 'react-table';
import { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink, Font, pdf, BlobProvider } from '@react-pdf/renderer';

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

function refreshPage() {
  window.location.reload(false);
}

const [formData, setFormData] = useState({ title: '', year: '' });
const [userData, setUserData] = useState([]);

const handleInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSave = () => {
  const newData = [...userData, formData];
  setUserData(newData);

  // Clear form inputs
  setFormData({ title: '', year: '' });

  // Convert newData to JSON and create a Blob
  const jsonData = JSON.stringify(newData.slice(-1), null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });

  // Create a download link
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = 'savedData.json';
  downloadLink.click();
};

const handleFileChange = (e) => {
  const file = e.target.files[0];

  // Read the contents of the selected file
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const fileData = JSON.parse(event.target.result);
      setFormData(...fileData);
    } catch (error) {
      console.error('Error parsing JSON file:', error);
    }
  };
  reader.readAsText(file);
};

const downloadFile = (blob, fileName) => {
  const link = document.createElement('a');
  // create a blobURI pointing to our Blob
  console.log('blob', blob)
  console.log('fileName', fileName)
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  // some browser needs the anchor to be in the doc
  document.body.append(link);
  link.click();
  link.remove();
  // in case the Blob uses a lot of memory
  setTimeout(() => URL.revokeObjectURL(link.href), 7000);
};

Font.register({
  family: "Roboto",
  src:
    "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 10,
    fontFamily: "Roboto",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const MyDoc = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Title: {formData.title}</Text>
        <Text>Year: {formData.year}</Text>
      </View>
    </Page>
  </Document>
);


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
      <h1>service worker</h1>
      <>
       <button onClick={refreshPage}>Refresh Page</button>
      </>
      <h2>Add New Data:</h2>
      <form>
        <label>
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Year:
          <input type="text" name="year" value={formData.year} onChange={handleInputChange} />
        </label>
        <br />
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </form>
      <h2>Load Data from JSON File:</h2>
      <input type="file" accept=".json" onChange={handleFileChange} />
      <pre>{JSON.stringify(userData, null, 2)}</pre>
      <h2>PDF download:</h2>
      <PDFDownloadLink document={<MyDoc />} fileName="pwa.pdf">
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Download PDF file'
        }
      </PDFDownloadLink>
      <br />
      <h2>Generate PDF:</h2>
      <BlobProvider document={<Document font="Roboto"><Page size="A4" style={styles.page}><View style={styles.section}><Text>Title: {formData.title}</Text><Text>Body: {formData.body}</Text></View></Page></Document>}>
        {({ blob, url, loading, error }) => (
          <PDFDownloadLink document={<Document font="Roboto"><Page size="A4" style={styles.page}><View style={styles.section}><Text>Title: {formData.title}</Text><Text>Body: {formData.body}</Text></View></Page></Document>} fileName="document.pdf">
            {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
          </PDFDownloadLink>
        )}
      </BlobProvider>
      <h2>Generate PDF:</h2>
      {/* <PDFViewer width="600" height="400">
        <MyDoc />
      </PDFViewer> */}
      <h1>Data from API:</h1>
      <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
    </div>
    </div>
    </div>
   );
}

export default App;
