import React from 'react';
import { useSelector } from 'react-redux';
import { Provider, createClient } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import { IState } from '../../store';
import MetricCard from '../../components/MetricCard';
import LineGraph from '../../components/LineGraph';
import Grid from '@material-ui/core/Grid';
import grey from '@material-ui/core/colors/grey';
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    background: grey[200],
    minHeight: window.innerHeight,
    minWidth: window.innerWidth,
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
    <div>
      <Grid container className={classes.root}>
        {filters.map((filter, index) => {
          if (filter !== '') {
            return (
              <Grid item md={6} key={index}>
                <MetricCard metricName={filter} />
                <LineGraph metricName={filter} />
              </Grid>
            );
          }
          return false;
        })}
      </Grid>
    </div>
  );
};
