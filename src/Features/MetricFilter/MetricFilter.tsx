import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  filterActions, filterInputActions,
  openMetricListActions, resultFilterListActions
} from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText'
import Chip from '../../components/Chip';
import { makeStyles } from '@material-ui/core/styles';
import { IState } from '../../store';
import Down from '@material-ui/icons/ArrowDropDownRounded';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const useStyles = makeStyles(theme => ({
  list: {
    width: '50rem',
    background: 'white',
    position: 'absolute',
    zIndex: 1,
    opacity: 0.9,
    margin: theme.spacing(1, 1, 1, 1),
    borderRadius: '5px'
  },
  chip: {
    margin: theme.spacing(1)
  },
  input: {
    width: 1000
  }
}));
const query = `
query {
  getMetrics
}
`;

const getFilters = (state: IState) => {
  const { filters } = state.filter;
  return {
    filters
  };
};

const getFilterInput = (state: IState) => {
  const { filterInput } = state.filterInput
  return {
    filterInput
  }
}

const getOpenMetricList = (state: IState) => {
  const { openMetricList } = state.openMetricList
  return {
    openMetricList
  }
}

const getResultFilterList = (state: IState) => {
  const { resultFilterList } = state.resultFilterList
  return {
    resultFilterList
  }
}

export default () => {
  return (
    <Provider value={client}>
      <MetricFilter />
    </Provider>
  );
};

const MetricFilter = () => {
  const classes = useStyles()
  // Default to houston

  const dispatch = useDispatch();
  const { filters } = useSelector(getFilters);
  const { filterInput } = useSelector(getFilterInput)
  const { openMetricList } = useSelector(getOpenMetricList)
  const { resultFilterList } = useSelector(getResultFilterList)

  const [result] = useQuery({
    query
  });

  const { fetching, data, error } = result;
  useEffect(() => {
    console.log('useEffect')
    if (error) {
      dispatch(filterActions.filterApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;

    const { getMetrics } = data;
    let filterSet = new Set(filters)

    let result = getMetrics
      .filter((item: string) => { return !filterSet.has(item) })
    dispatch(resultFilterListActions.resultFilterList({ resultFilterList: result }));

  }, [dispatch, data, error, filters]);

  const handleChange = (name: string) => (event: any) => {
    let filterInput = event.target.value
    if (name === 'filterInput') {
      if (filterInput !== ' ') {
        let result = data.getMetrics.filter((item: string) => { return item.includes(filterInput) })
        dispatch(resultFilterListActions.resultFilterList({ resultFilterList: result }));
      }
      dispatch(filterInputActions.filterInput({ filterInput: event.target.value }))
    }
  }

  const handleClick = (name: string) => (event: any) => {
    if (name === 'filterInput') {
      dispatch(openMetricListActions.openMetricList({ openMetricList: !openMetricList }))
    }
  }

  const handleClickList = (name: string) => (event: any) => {
    console.log(name)
    dispatch(filterActions.addFilter({ selectedFilter: name }))
    const { getMetrics } = data;
    console.log('getMetrics', getMetrics)
    dispatch(resultFilterListActions.resultFilterList({ resultFilterList: getMetrics }));
    dispatch(openMetricListActions.openMetricList({ openMetricList: !openMetricList }));
  }

  const handleDeleteList = (name: string) => (event: any) => {
    console.log(name)
    dispatch(filterActions.removeFilter({ selectedFilter: name }))
  }

  if (fetching) return <LinearProgress />;

  return <div>
    <OutlinedInput
      id="filled-adornment-weight"
      className={classes.input}

      value={filterInput}
      disabled
      multiline
      rowsMax={5}
      onChange={handleChange('filterInput')}
      onClick={handleClick('filterInput')}
      endAdornment={<InputAdornment position="start"><div>
        {filters.map((f: string, index: number) => {
          if (f !== ' ') {
            return (
              <Chip
                className={classes.chip}
                onDelete={handleDeleteList(f)}
                label={f}
                key={index}
              />
            )
          }
          return false
        })}<Down /></div></InputAdornment>}
      aria-describedby="filled-weight-helper-text"
      inputProps={{
        'aria-label': 'weight',
      }}
    >
    </OutlinedInput>

    <List className={classes.list}
      style={{ display: (openMetricList && resultFilterList.length > 0) ? 'block' : 'none' }}>
      {resultFilterList.map((f: string, index: number) => {
        return <ListItem button onClick={handleClickList(f)} key={index}>
          <ListItemText
            primary={f}
          />
        </ListItem>
      })}
    </List>
  </div>;
};
