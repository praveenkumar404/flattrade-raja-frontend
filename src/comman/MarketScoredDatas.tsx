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
  // console.log("valsing : ", isType)
  const webookindexdata = webhookcontrol.map((res: any, index) =>res)


    const subscriptmessageincdec = isType?.pc && Number(isType.pc) < 0 ? false : true;;
   const Selectoption = {
    mylabel : selectedDropdownValues?.length > 0 ? `${selectedDropdownValues?.map((item: any) => item?.label?.toString())}` :'',
    myvalue : selectedDropdownValues?.length > 0 ? `${selectedDropdownValues?.map((item: any) => item?.value?.toString())}` :''
   } 

//    {
//     "type": "index",
//     "data": {
//         "t": "tf",
//         "e": "NSE",
//         "tk": "26037",
//         "lp": "24041.80",
//         "pc": "-0.07"
//     },
//     "status": true
// }
   
  return (
    <Box>
      {/* Dashboard Content */}
      <Grid container sx={{ marginTop: '10px',backgroundColor: subscriptmessageincdec == true ? 'green' : '#ff0000',borderRadius:'10px', padding:'5px 0px 0px 5px' }}>
        {/* Emails Sent Card */}
        <Grid item xs={12}>
          <Paper
            sx={{
              backgroundColor: '#e3defb',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <Box ml={2}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color:'#3b2f75' }}>
                 {Selectoption?.mylabel}
                </Typography>
                <Typography sx={{color:'#5c5c5c'}}>{Number(Selectoption?.myvalue)}</Typography>
                
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                  {subscriptmessageincdec == true ? <VerticalAlignTopIcon sx={{color:'green',fontSize:'24px'}}/>:<VerticalAlignBottomIcon sx={{color:'#ff0000',fontSize:'24px'}}/>}
                  <Typography sx={{ color: subscriptmessageincdec == true ? 'green' :'#ff0000', fontWeight: 'bold' }}>{myoption?.some((item:any) => item.value === Number(selectedValue)) ? `${Number(isType?.pc)} %`:'-'}</Typography>
                </Box>
            </Box>
          
          </Paper>
        </Grid>
      </Grid>
      </Box>
  );
};

export default MarketScoredDatas;
