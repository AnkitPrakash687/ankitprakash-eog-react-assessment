import React from 'react';
import Container from '@material-ui/core/Container';
import MetricFilter from './Features/MetricFilter/MetricFilter';
import MetricGraph from './Features/MetricGraph/MetricGraph';
import Box from '@material-ui/core/Box';

export default () => {
  return (
    <Container>
      <Box display="flex" m={1} p={1} justifyContent="flex-end">
        <MetricFilter />
      </Box>
      <MetricGraph />
    </Container>
  );
};
