import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AlgoTradersPages from './AlgoTradersPages'
import TradingViewChart from '../../../comman/ReusabelCompoents/TradingViewChart'
import Seller from '../Seller/Seller'
import PointData from '../../../comman/ReusabelCompoents/PointData'
import { useWebSocketMessages } from '../../../Webhooktypeprocess'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'

const AlgoTradersMainPage: React.FC = () => {

  const [width, setWidth] = useState<number>(600); // Initial width of the scrollable area
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const watchlistselectrow = useSelector((state: RootState) => state?.tradingWatchlist?.TradingWatchlistPersist);

  const webhookdatas = useWebSocketMessages();
  const webhookcontrol = webhookdatas.flat()
  const isTypemarketload = webhookcontrol.find(
    (item: any) => item?.type === 'market' && item?.tk == watchlistselectrow?.value
  );

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  // Handle drag movement
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newWidth = Math.max(550, e.clientX); // Prevent shrinking below 100px
      setWidth(newWidth);
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Attach global event listeners for drag movement
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <Box>
      <Box>
        {
          isTypemarketload ? <Box style={{
          }}>
              <Box sx={{color:'#fff',bgcolor: isTypemarketload?.status == '001' ? '#ff0000' : isTypemarketload?.status == '002' ? '#00ff00' : isTypemarketload?.status == '003' ? 'yellow' : 'palevioletred',padding:1}}>
                  {isTypemarketload?.message}
              </Box>
          </Box> : null
        }
      <Box>{watchlistselectrow?.value}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '10px 0px' }}>
          <TradingViewChart />
          <Box sx={{
            width: `${width}px`,
            overflow: 'auto',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            position: 'relative',
          }}
          >
            <Box>
              <Box
                sx={{
                  width: '8px',
                  height: '100%',
                  cursor: 'ew-resize',
                  backgroundColor: 'transparent',
                  // borderTop: '3px solid rgb(128, 175, 233)',
                  borderLeft: '3px solid rgb(128, 175, 233)',
                  position: 'absolute',
                  '&:hover': { 
                    backgroundColor: 'transparent',
                    // borderTop: '3px solid #ff0000',
                    borderLeft: '3px solid #ff0000', },
                }}
                onMouseDown={handleMouseDown}
              ></Box>
            </Box>
            <Box>
              <PointData/>
              <Seller />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AlgoTradersMainPage
