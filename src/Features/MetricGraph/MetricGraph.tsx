import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
import { makeStyles } from '@material-ui/core/styles';
import { IState } from '../../store';
import MetricCard from '../../components/MetricCard'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import Grid from '@material-ui/core/Grid'

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const useStyles = makeStyles(theme => ({
 root:{
   margin: theme.spacing(10,10,10,10),
 
 }
}));
const query = `
query($metricName: String!, $after: Timestamp) {
    getMeasurements(input:{metricName:$metricName, after: $after}){
      value
      metric
      at
      unit
    }
}
`;

const getFilters = (state: IState) => {
  const { filters } = state.filter;
  return {
    filters
  };
};

const convertToTime = (time:number) =>{
  let hrs = new Date(time).getHours().toString(),
  min = new Date(time).getMinutes().toString()
  //sec = new Date(time).getSeconds().toString()
  return ( hrs + ':' + min)
}
export default () => {
  return (
    <Provider value={client}>
      <MetricGraph />
    </Provider>
  );
};

type LineGraphProps = {
  metricName: string,
}

const timestamp = new Date().getTime() - 3600000

const LineGraph = ({ metricName }: LineGraphProps) => {
  const [{ data }, executeQuery] = useQuery({
    query: query,
    variables: {
      metricName: metricName,
      after: timestamp
    }
  });

  useEffect(() => {
    executeQuery({ requestPolicy: 'cache-and-network', pollInterval: 3000 })
  }, [])

  if (data) {
    let metrics = data.getMeasurements.map((m:any) =>{
      return {at: convertToTime(m.at), metricName: m.metric, value: m.value}      
  })
    return <LineChart  width={500} height={300}
      data={metrics.slice(-500)} 
      margin={{ top: 5, right: 20, bottom: 5, left: -5 }}
      >
      <Line isAnimationActive={false} type="linear" dot={false} 
        dataKey="value" 
        stroke="#8884d8"
        />
      <XAxis minTickGap={10} type="category"  domain={['auto', 'auto']} dataKey="at" />
      <YAxis domain={['auto', 'auto']}/>
      <YAxis />
      <Tooltip />
    </LineChart>
  }
  return <div></div>;
}
const MetricGraph = () => {

  const classes = useStyles()

  const { filters } = useSelector(getFilters);


  return <div>
    <Grid container className={classes.root}>
    {filters.map((filter, index) => {
      if (filter !== ' ') {
        return (
          <Grid item md={6} key={index}>
          <MetricCard metricName={filter} />
          <LineGraph metricName={filter} />
          </Grid>)   
      }
      return false;
    })
    }
       </Grid>

  </div>



};
