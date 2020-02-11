import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterActions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import { makeStyles } from '@material-ui/core/styles';
import { IState } from '../../store';
import Box from '@material-ui/core/Box';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const useStyles = makeStyles(theme => ({
  list: {
    width: '20rem',
    background: 'white',
    position: 'absolute',
    zIndex: 1,
    opacity: 0.9,
    margin: theme.spacing(1, 1, 1, 1),
    borderRadius: '5px',
  },
  chip: {
    margin: '5px',
  },
  filterInput: {
    width: '20rem',
    padding: theme.spacing(1),
    border: 'none',
    backgroundColor: 'transparent',
    '&:focus': {
      outline: 'none !important',
    },
  },
  searchBox: {
    minHeight: 30,
    width: '20rem',
    borderColor: grey[400],
    borderRadius: 5,
    borderWidth: 1,
    border: 'solid',
    '&:hover': {
      background: grey[200],
      borderColor: blue[300],
    },
    display: 'flex',
    flexDirection: 'row',
  },
  selectedFilterContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
}));

const query = `
query {
  getMetrics
}
`;

const getFilters = (state: IState) => {
  const { filters } = state.filter;
  return {
    filters,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <MetricFilter />
    </Provider>
  );
};

const MetricFilter = () => {
  const classes = useStyles();
  const filterInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { filters } = useSelector(getFilters);

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

  const handleKeyUp = (name: string) => (event: any) => {
    if (event.keyCode === 46) {
      let name = filters[filters.length - 1];
      if (name !== ' ') {
        dispatch(filterActions.removeFilter({ selectedFilter: name }));
      }
    }
  };

  const focusInput = () => {
    if (filterInputRef && filterInputRef.current) {
      filterInputRef.current.value = '';
      filterInputRef.current.focus();
    }
  };

  const handleClickList = (event: any) => {
    let filterInput = event.target.value;
    if (data.getMetrics.includes(event.target.value)) {
      dispatch(filterActions.addFilter({ selectedFilter: event.target.value }));
      focusInput();
    } else if (filterInput === 'No options') {
      focusInput();
    }
  };

  const handleDeleteList = (name: string) => (event: any) => {
    dispatch(filterActions.removeFilter({ selectedFilter: name }));
    if (name === 'clearAll') {
      dispatch(filterActions.clearAll());
    }
  };

  if (fetching) return <LinearProgress />;

  return (
    <div>
      <Box id="searchBox" alignItems="flex-end" className={classes.searchBox}>
        <Box className={classes.selectedFilterContainer}>
          {filters.map((f: string, index: number) => {
            if (f !== '') {
              return (
                <Box key={index}>
                  <Chip className={classes.chip} size="small" onDelete={handleDeleteList(f)} label={f} />
                </Box>
              );
            }
            return false;
          })}
          {filters.length > 1 && (
            <Box>
              <Chip
                className={classes.chip}
                size="small"
                color="secondary"
                onDelete={handleDeleteList('clearAll')}
                label={'clear all'}
              />
            </Box>
          )}

          <Box>
            <input
              className={classes.filterInput}
              ref={filterInputRef}
              // onChange={handleChange('filterInput')}
              onInput={handleClickList}
              onKeyUp={handleKeyUp('filterInput')}
              type="text"
              list="metricList"
              placeholder="Search Metrics..."
            ></input>
          </Box>
        </Box>
      </Box>
      <Box>
        <label htmlFor="searchBox">press delete to remove last filters</label>
      </Box>
      <datalist id="metricList">
        {data.getMetrics.length > filters.length - 1 ? (
          data.getMetrics.map((f: string, index: number) => {
            if (!filters.includes(f)) return <option value={f} key={index}></option>;
            return null;
          })
        ) : (
          <option value={'No options'} key={0}></option>
        )}
      </datalist>
    </div>
  );
};
