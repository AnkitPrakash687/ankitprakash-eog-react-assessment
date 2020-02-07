import React from 'react';
import Container from '@material-ui/core/Container'
import MetricFilter from './Features/MetricFilter/MetricFilter'
import MetricReading from './Features/MetricReading/MetricReading'
import MetricGraph from './Features/MetricGraph/MetricGraph'
import Box from '@material-ui/core/Box'

export default () => {
    return(
        <Container>
          <div style={{width: '100%'}}>
            <Box display="flex" >
            <MetricFilter/>
            </Box>
            <MetricGraph/>
            </div>
        </Container>
    )
}


