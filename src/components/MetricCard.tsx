import React, { useEffect } from 'react';
import { Provider, createClient, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

type MetricCardProps = {
  metricName: string;
};

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
    maxWidth: '12rem',
  },

  title: {
    fontSize: 18,
    fontWeight: 300,
  },
  body: {
    fontSize: 30,
    fontWeight: 500,
  },
}));

const query = `
query($metricName: String!) {
  getLastKnownMeasurement(metricName: $metricName) {
    metric
    value
    unit
  }
}
`;

export default ({ metricName }: MetricCardProps) => {
  return (
    <Provider value={client}>
      <SimpleCard metricName={metricName} />
    </Provider>
  );
};

const SimpleCard = (props: any) => {
  const classes = useStyles();
  // Default to houston

  const [{ data }, executeQuery] = useQuery({
    query: query,
    variables: {
      metricName: props.metricName,
    },
  });

  useEffect(() => {
    executeQuery({ requestPolicy: 'cache-and-network', pollInterval: 1300 });
  }, [executeQuery]);

  return (
    <div>
      {data && (
        <Paper className={classes.paper}>
          <Typography className={classes.title}>{props.metricName}</Typography>
          <Typography className={classes.body} gutterBottom>
            {data.getLastKnownMeasurement.value + ' ' + data.getLastKnownMeasurement.unit}
          </Typography>
        </Paper>
      )}
    </div>
  );
};
