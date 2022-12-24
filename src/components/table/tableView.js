import React from 'react';
// import PropTypes from 'prop-types';
import { IconButton, TextField,Stack } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { DataGrid } from '@mui/x-data-grid'; 
// import searchFill from '@iconify/icons-eva/search-fill';
// import trash2Fill from '@iconify/icons-eva/close-outline';
import Iconify from '../Iconify';

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;
const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      tableroot: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        minHeight: '60px !important',
        margin: '10px'
      },
      textField: {
        [theme.breakpoints.down('xs')]: {
          width: '100%'
        },
        margin: theme.spacing(1, 0.5, 1.5),
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(0.5)
        },
        '& .MuiInput-underline:before': {
          borderBottom: `1px solid ${theme.palette.divider}`,
          // borderRight: `1px solid ${theme.palette.divider}`
        }
      },
      
    }),
  { defaultTheme }
);

const rowHeight = 100;
const rowHeightD = 52; 

function QuickSearchToolbar(props) {
  const classes = useStyles();

  return (
    <div className={classes.tableroot}>
      {/* <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div> */}
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder=" Search…"
        className={classes.textField}
        InputProps={{
          startAdornment: getIcon('mdi:search-fill'),
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="medium"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
             {getIcon("mdi:close")}
            </IconButton>
          )
        }}
        
      />
    </div>
  );
}

export default class TableView extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      rows: props.data || [],
      columns: [],
      searchText: '',
      name:''
    };
    
  }

  componentDidMount() {
    this.setState({ rows: this.props.data });
    this.setState({ columns: this.props.columns });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.rows && prevState.searchText === '') {
      return { rows: nextProps.data };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      // Perform some operation here
      // this.setState({ rows: this.props.data });
    }
  }

  requestSearch(searchValue) {
    this.setState({ searchText: searchValue });
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = this.state.rows.filter((row) => {
      return Object.keys(row).some((field) => {
        const textvalue =
          row[field] !== null && row[field] !== undefined ? row[field].toString() : '';
        return searchRegex.test(textvalue);
      });
    });
    this.setState({ rows: filteredRows });
  }

  render() {
    var pagesize = 10;
    if(window.innerWidth <= 1024){
      pagesize=7
    } 
    return (
      // style={{ height: 600, width: '100%', overflow: 'scroll' }}
      <div> 
        <DataGrid
          autoHeight
          rowHeight={this.props.name === 'region' ? rowHeight : rowHeightD }
          rows={this.state.rows}
          columns={this.state.columns}
          pageSize={pagesize}
          rowsPerPageOptions={[5]}
          disableMultipleSelection={true}
          disableSelectionOnClick
          showColumnRightBorder={false}
          onRowClick={(params)=>{
            if(this.props.onRowClick !== undefined){
              this.props.onRowClick(params);
            }
          }}
          onCellClick={(params)=>{
            if(this.props.onclickevt !== undefined){
              this.props.onclickevt(params);
            }
          }}
          components={{ Toolbar: QuickSearchToolbar,
            NoRowsOverlay: () => (
              <Stack style={{marginTop: '10%'}} alignItems="center" justifyContent="center">
                No records found
              </Stack>
            ),
            NoResultsOverlay: () => (
              <Stack style={{marginTop: '10%'}} alignItems="center" justifyContent="center">
                No results found
              </Stack>
            )
           }}
          componentsProps={{
            toolbar: {
              value: this.state.searchText,
              onChange: (event) => this.requestSearch(event.target.value),
              clearSearch: () => this.requestSearch('')
            }
            
          }}
        />
      </div>
    );
  }
}
