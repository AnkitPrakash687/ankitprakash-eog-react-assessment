import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { filterActions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const useStyles = makeStyles(theme => ({
  searchBox: {
    minHeight: 30,
    width: '22rem',
    display: 'flex',
    flexDirection: 'row',
  },
}));

const query = `
query {
  getMetrics
}
`;


export default () => {
  return (
    <Provider value={client}>
      <MetricFilter />
    </Provider>
  );
};

const MetricFilter = () => {
  const classes = useStyles();
 // const filterInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();


  const [result] = useQuery({
    query,
  });

  const { fetching, data, error } = result;

  // useEffect(() => {
  //     console.log(data.getMetrics)
  //  dispatch(filterActions.initializeFilterNotSelected({metrics: data.getMetrics}));

  // }, []);

  useEffect(() => {
    if (error) {
      dispatch(filterActions.filterApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
  }, [dispatch, data, error]);

  // const handleKeyUp = (name: string) => (event: any) => {
  //   if (event.keyCode === 46) {
  //     let name = filters[filters.length - 1];
  //     if (name !== ' ') {
  //       dispatch(filterActions.removeFilter({ selectedFilter: name }));
  //     }
  //   }
  // };

  // const focusInput = () => {
  //   if (filterInputRef && filterInputRef.current) {
  //     filterInputRef.current.value = '';
  //     filterInputRef.current.focus();
  //   }
  // };

  // const handleClickList = (event: any) => {
  //   let filterInput = event.target.value;
  //   if (data.getMetrics.includes(event.target.value)) {
  //     dispatch(filterActions.addFilter({ selectedFilter: event.target.value }));
  //     focusInput();
  //   } else if (filterInput === 'No options') {
  //     focusInput();
  //   }
  // };

  const handleChange = (name: string) => (event: any, value: any) => {
    if (name === 'metricFilter') {
      console.log(value)
      let filters = value.filter((metric:string)=>{ return metric !== ''})
      dispatch(filterActions.setFilter({ filters: filters }));
    }
  };

  // const handleDeleteList = (name: string) => (event: any) => {
  //   dispatch(filterActions.removeFilter({ selectedFilter: name }));
  //   if (name === 'clearAll') {
  //     dispatch(filterActions.clearAll());
  //   }
  // };

  if (fetching) return <LinearProgress />;

  return (
    <div>
      <Box id="searchBox" alignItems="flex-end" >
        
        <Autocomplete
        className={classes.searchBox}
        multiple
        autoHighlight
        id="metric-filter"
        options={data.getMetrics}
        filterSelectedOptions
        onChange={handleChange('metricFilter')}
        renderInput={params => (
          <TextField {...params} variant="outlined" placeholder="Select Metrics..." fullWidth />
        )}
      />
  
      </Box>
    
    </div>
  );
};
