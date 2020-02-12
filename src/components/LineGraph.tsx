import React from 'react';
import { useQuery } from 'urql';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

type LineGraphProps = {
  metricName: string;
  newData: any;
};

const SECONDS = 30 * 60,
  RATE = 1.3;
const dataLength = Math.floor(SECONDS / RATE);
const timestamp = new Date().getTime() - SECONDS * 1000;

const convertToTime = (time: number) => {
  let hrs = new Date(time).getHours().toString(),
    min = new Date(time).getMinutes().toString(),
    sec = new Date(time).getSeconds().toString();
  return hrs + ':' + min + ':' + sec;
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

export default ({ metricName, newData }: LineGraphProps) => {
  //console.log(result.data);
  const [{ data }] = useQuery({
    query: query,
    variables: {
      metricName: metricName,
      after: timestamp,
    },
  });
  // if (data) {
  //   console.log('newData', [...data.getMeasurements, ...newData].length);
  // }
  return (
    <LineChart
      syncId={1}
      width={500}
      height={350}
      data={
        data &&
        [...data.getMeasurements, ...newData]
          .map((f: any) => {
            return {
              at: convertToTime(f.at),
              metricName: f.metric,
              value: f.value,
            };
          })
          .slice(dataLength * -1)
      }
      margin={{ top: 5, right: 20, bottom: 5, left: -5 }}
    >
      <Line isAnimationActive={false} type="linear" dot={false} dataKey="value" stroke="#8884d8" />
      <XAxis minTickGap={10} type="category" dataKey="at" />
      <YAxis domain={['auto', 'auto']} />
      <YAxis />
      <Tooltip animationDuration={500} />
    </LineChart>
  );
};
