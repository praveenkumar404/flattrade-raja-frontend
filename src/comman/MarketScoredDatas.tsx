import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { CircularProgress } from '@mui/material';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useWebSocketMessages } from '../Webhooktypeprocess';

const MarketScoredDatas: React.FC<any> = ({myoption}:any) => {

    const selectedDropdownValues = useSelector((state: RootState) => state.auth.selectedDropdownValues);
    const selectedValue = selectedDropdownValues.map(option => option.value).join(', ');

    const webhookdatas = useWebSocketMessages();
  const webhookcontrol = webhookdatas.flat()
  const isType = webhookcontrol.find(
    (item: any) => item?.type === 'index'
  )?.data;
  const webookindexdata = webhookcontrol.map((res: any, index) =>res)


    const subscriptmessageincdec = isType?.pc && Number(isType.pc) < 0 ? false : true;;
   const Selectoption = {
    mylabel : selectedDropdownValues?.length > 0 ? `${selectedDropdownValues?.map((item: any) => item?.label?.toString())}` :'',
    myvalue : selectedDropdownValues?.length > 0 ? `${selectedDropdownValues?.map((item: any) => item?.value?.toString())}` :''
   } 
   
  return (
    <Box>
      {/* Dashboard Content */}
      <Grid container spacing={2} sx={{ marginTop: '10px',backgroundColor: '#0D1B2A',borderRadius:'10px',padding: '10px', }}>
        {/* Emails Sent Card */}
        <Grid item xs={12}>
          <Paper
            sx={{
              backgroundColor: '#1C2541',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <Box display="flex" alignItems="center">
              <EmailIcon sx={{ fontSize: 40, color: '#6FFFE9' }} />
              <Box ml={2} sx={{color:'#ff00ff'}}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                 {Selectoption?.mylabel}
                </Typography>
                <Typography>{Number(Selectoption?.myvalue)}</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
              {/* <CircularProgress
                variant="determinate"
                value={14}
                sx={{
                  color: '#6FFFE9',
                  '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
                }}
                thickness={5}
                size={50}
              /> */}

              {subscriptmessageincdec == true ? <VerticalAlignTopIcon sx={{color:'#00ff00',fontSize:'24px'}}/>:<VerticalAlignBottomIcon sx={{color:'#ff0000',fontSize:'24px'}}/>}
              <Typography sx={{ color: subscriptmessageincdec == true ? '#00ff00' :'#ff0000', fontWeight: 'bold' }}>{myoption?.some((item:any) => item.value === Number(selectedValue)) ? `${isType?.pc && Number(isType.pc)} %`:'Index Not Selected'}</Typography>
            </Box>
            </Box>
            
          </Paper>
        </Grid>
      </Grid>
      </Box>
  );
};

export default MarketScoredDatas;
