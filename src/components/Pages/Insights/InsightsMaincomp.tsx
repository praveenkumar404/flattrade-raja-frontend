// // {
// //     "type": "index",
// //     "data": {
// //         "t": "tf",
// //         "e": "NSE",
// //         "tk": "26000",
// //         "lp": "23947.30",
// //         "pc": "-1.04"
// //     },
// //     "status": true
// // }

import { Box } from '@mui/material'
import React from 'react'
import TradingViewChart from '../../../comman/ReusabelCompoents/TradingViewChart'

const InsightsMaincomp = () => {
    return (
        <div>
            <Box>
                <TradingViewChart />
            </Box>
        </div>
    )
}

export default InsightsMaincomp
