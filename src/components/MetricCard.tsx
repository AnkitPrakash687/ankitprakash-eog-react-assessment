import React, { useEffect } from 'react';
import { Provider, createClient, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

type MetricCardProps = {
    metricName: string,
}

const useStyles = makeStyles({
    root: {
      minWidth: 180,
      maxWidth: 300,
      height: 100
    },
  
    title: {
      fontSize: 18,
      fontWeight: 300
    },
    body: {
        fontSize: 30,
        fontWeight: 500
      },
  });

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
      <SimpleCard metricName={metricName}/>
    </Provider>
  );
};


const SimpleCard = (props:any) => {
  const classes = useStyles()
  // Default to houston

  const [{  data }, executeQuery] = useQuery({
    query:query,
    variables:{
        metricName: props.metricName
    }
   
  });

  useEffect(() => { 
        executeQuery( {requestPolicy: 'cache-and-network', pollInterval: 1300})  
  }, [executeQuery]);

  return <div>{
      data && <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} >
          {props.metricName}
        </Typography>
        <Typography className={classes.body} gutterBottom>
          {data.getLastKnownMeasurement.value + ' '+data.getLastKnownMeasurement.unit} 
        </Typography>
      </CardContent>
    </Card>
}</div>
};
