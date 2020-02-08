import React, { useEffect } from 'react';
import { useQuery } from 'urql';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

type LineGraphProps = {
  metricName: string;
};

const timestamp = new Date().getTime() - 3600000 / 2;
const convertToTime = (time: number) => {
  let hrs = new Date(time).getHours().toString(),
    min = new Date(time).getMinutes().toString();
  //sec = new Date(time).getSeconds().toString()
  return hrs + ':' + min;
};

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
export default ({ metricName }: LineGraphProps) => {
  const [{ data }, executeQuery] = useQuery({
    query: query,
    variables: {
      metricName: metricName,
      after: timestamp,
    },
  });

  useEffect(() => {
    executeQuery({ requestPolicy: 'cache-and-network', pollInterval: 1300 });
  }, [executeQuery]);

  if (data) {
    let metrics = data.getMeasurements.map((m: any) => {
      return { at: convertToTime(m.at), metricName: m.metric, value: m.value };
    });
    return (
      <LineChart width={500} height={300} data={metrics} margin={{ top: 5, right: 20, bottom: 5, left: -5 }}>
        <Line isAnimationActive={false} type="linear" dot={false} dataKey="value" stroke="#8884d8" />
        <XAxis minTickGap={10} type="category" domain={['auto', 'auto']} dataKey="at" />
        <YAxis domain={['auto', 'auto']} />
        <YAxis />
        <Tooltip />
      </LineChart>
    );
  }
  return <div></div>;
};
