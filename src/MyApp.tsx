import React from 'react';
import Container from '@material-ui/core/Container'
import MetricFilter from './Features/MetricFilter/MetricFilter'
import MetricGraph from './Features/MetricGraph/MetricGraph'
import Box from '@material-ui/core/Box'
import grey from '@material-ui/core/colors/grey';

export default () => {
    return(
        <Container style={{background: grey[100], minHeight: window.innerHeight}}>
          <div style={{width: '100%'}}>
            <Box display="flex" m={1} p={1} justifyContent="flex-end">
            <MetricFilter/>
            </Box>
            <MetricGraph/>
            </div>
        </Container>
    )
}


