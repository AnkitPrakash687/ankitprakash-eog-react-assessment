import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterActions, filterInputActions, openMetricListActions, resultFilterListActions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
    padding: theme.spacing(1),
    border: 'none',
    backgroundColor: 'transparent',
    '&:focus': {
      outline: 'none !important',
    },
  },
  searchBox: {
    minHeight: 50,
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

const getOpenMetricList = (state: IState) => {
  const { openMetricList } = state.openMetricList;
  return {
    openMetricList,
  };
};

const getResultFilterList = (state: IState) => {
  const { resultFilterList } = state.resultFilterList;
  return {
    resultFilterList,
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
  const { openMetricList } = useSelector(getOpenMetricList);
  const { resultFilterList } = useSelector(getResultFilterList);

  const [result] = useQuery({
    query,
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    document.addEventListener('keyup', keyUpFunc, false);
  });

  useEffect(() => {
    const getFilteredList = (filterInput?: string) => {
      let filterSet = new Set(filters);

      let result = data.getMetrics.filter((item: string) => {
        return !filterSet.has(item);
      });
      if (filterInput && filterInput !== ' ') {
        return result.filter((item: string) => {
          return item.includes(filterInput);
        });
      }
      return result;
    };
    if (error) {
      dispatch(filterActions.filterApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;

    dispatch(resultFilterListActions.resultFilterList({ resultFilterList: getFilteredList() }));
  }, [dispatch, data, error, filters]);

  const keyUpFunc = (event: any) => {
    if (event.keyCode === 27) {
      dispatch(openMetricListActions.openMetricList({ openMetricList: false }));
    }
  };

  const handleKeyUp = (name: string) => (event: any) => {
    if (event.keyCode === 46) {
      let name = filters[filters.length - 1];
      if (name !== ' ') {
        dispatch(filterActions.removeFilter({ selectedFilter: name }));
      }
    }
  };
  const handleChange = (name: string) => (event: any) => {
    const getFilteredList = (filterInput?: string) => {
      let filterSet = new Set(filters);

      let result = data.getMetrics.filter((item: string) => {
        return !filterSet.has(item);
      });
      if (filterInput && filterInput !== ' ') {
        return result.filter((item: string) => {
          return item.includes(filterInput);
        });
      }
      return result;
    };
    let filterInput = event.target.value;
    if (name === 'filterInput') {
      if (filterInput !== ' ') {
        dispatch(openMetricListActions.openMetricList({ openMetricList: true }));
        dispatch(resultFilterListActions.resultFilterList({ resultFilterList: getFilteredList(filterInput) }));
      }
      dispatch(filterInputActions.filterInput({ filterInput: event.target.value }));
    }
  };

  const handleClick = (name: string) => (event: any) => {
    if (name === 'filterInput') {
      if (filterInputRef && filterInputRef.current) {
        filterInputRef.current.focus();
      }
      dispatch(openMetricListActions.openMetricList({ openMetricList: !openMetricList }));
    }
  };

  const handleClickList = (name: string) => (event: any) => {
    dispatch(filterInputActions.filterInput({ filterInput: '' }));
    dispatch(filterActions.addFilter({ selectedFilter: name }));
    dispatch(resultFilterListActions.resultFilterList({ resultFilterList: data.getMetrics }));
    dispatch(openMetricListActions.openMetricList({ openMetricList: !openMetricList }));

    if (filterInputRef && filterInputRef.current) {
      filterInputRef.current.focus();
    }
  };

  // const handleClose = (name: string) => (event: any) => {
  //   if (name === 'list') {
  //     dispatch(openMetricListActions.openMetricList({ openMetricList: false }));
  //   }
  // };

  const handleDeleteList = (name: string) => (event: any) => {
    dispatch(filterActions.removeFilter({ selectedFilter: name }));
    if (name === 'clearAll') {
      dispatch(filterActions.clearAll({ selectedFilter: name }));
    }
  };

  if (fetching) return <LinearProgress />;

  return (
    <div>
      <Box id="searchBox" className={classes.searchBox} onClick={handleClick('filterInput')}>
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

          <Box justifyContent="center">
            <input
              className={classes.filterInput}
              ref={filterInputRef}
              onChange={handleChange('filterInput')}
              onKeyUp={handleKeyUp('filterInput')}
              type="text"
              placeholder="Search Metrics..."
            ></input>
          </Box>
        </Box>
      </Box>
      <label htmlFor="searchBox">press delete to remove last filters</label>
      <List className={classes.list} style={{ display: openMetricList ? 'block' : 'none' }}>
        {resultFilterList.length > 0 ? (
          resultFilterList.map((f: string, index: number) => {
            return (
              <ListItem button onClick={handleClickList(f)} key={index}>
                <ListItemText primary={f} />
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <ListItemText primary={'No more options'} />
          </ListItem>
        )}
      </List>
    </div>
  );
};
