import React from 'react';
import { useSelector } from 'react-redux';
import { Provider, createClient, dedupExchange, fetchExchange, subscriptionExchange } from 'urql';
import { useSubscription } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { makeStyles } from '@material-ui/core/styles';
import { IState } from '../../store';
import MetricCard from '../../components/MetricCard';
import LineGraph from '../../components/LineGraph';
import grey from '@material-ui/core/colors/grey';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const SECONDS = 30 * 60,
  RATE = 1.3;
const dataLength = Math.floor(SECONDS / RATE);

const subscriptionClient = new SubscriptionClient('ws://react.eogresources.com/graphql', {
  reconnect: true,
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    dedupExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
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

  const subscription = `
  subscription{
    newMeasurement{
      metric
      at
      value
      unit
    }
  }
  `;

  //  const [newMeasurement] = useSubscription({query: subscription})
  //  //console.log(newMeasurement.data)
  //  let subData = newMeasurement.data
  //  if(subData){
  //   console.log(subData.newMeasurement)
  //  }

  const [result] = useSubscription({ query: subscription }, (measurements = [], res) => {
    return [...measurements, res.newMeasurement];
  });
  let newData = result.data;
  // console.log(newData)
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
                  <LineGraph
                    metricName={filter}
                    newData={newData
                      .filter((f: any) => {
                        return f.metric === filter;
                      })
                      .slice(dataLength * -1)}
                  />
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
