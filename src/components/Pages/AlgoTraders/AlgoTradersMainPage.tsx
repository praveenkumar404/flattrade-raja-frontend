import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AlgoTradersPages from './AlgoTradersPages'
import TradingViewChart from '../../../comman/ReusabelCompoents/TradingViewChart'
import Seller from '../Seller/Seller'
import PointData from '../../../comman/ReusabelCompoents/PointData'

const AlgoTradersMainPage: React.FC = () => {
  return (
    <Box>
      <Box>
        <Box sx={{display:'flex',justifyContent:'center',margin:'10px 0px'}}>
            <TradingViewChart/>
            <Box sx={{width: "30%"}}>
            <PointData/>
            <Seller/>
            </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AlgoTradersMainPage
