import React from 'react';
import { useSelector } from 'react-redux';
import { Provider, createClient } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import { IState } from '../../store';
import MetricCard from '../../components/MetricCard';
import LineGraph from '../../components/LineGraph';
import grey from '@material-ui/core/colors/grey';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    background: grey[200],
    minHeight: window.innerHeight,
  },
}));

const getFilters = (state: IState) => {
  const { filters } = state.filter;
  return {
    filters,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <MetricGraph />
    </Provider>
  );
};

const MetricGraph = () => {
  const classes = useStyles();

  const { filters } = useSelector(getFilters);

  return (
    <>
      {filters.length > 1 ? (
        <Box display="flex" m={2} flexDirection="row" flexWrap="wrap" className={classes.root}>
          {filters.map((filter, index) => {
            if (filter !== '') {
              return (
                <Box key={index} display="flex" m={2} flexDirection="column">
                  <MetricCard metricName={filter} />
                  <LineGraph metricName={filter} />
                </Box>
              );
            }
            return false;
          })}
        </Box>
      ) : (
        <Box style={{ width: window.innerWidth }} display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h6">NO FILTER SELECTED</Typography>
        </Box>
      )}
    </>
  );
};
