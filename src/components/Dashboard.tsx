import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import MultipleSelectWithSearch from '../comman/MultipleSelectPlaceholder';
import '../assets/css/Dashboard.css'
import waveBackground_dark from '../assets/images/backgroundsvgs/bg-dark.svg';
import waveBackground_light from '../assets/images/backgroundsvgs/bg-light.svg';
import waveBackground_default from '../assets/images/wave-haikei_light.svg';
import { useNavigate } from 'react-router-dom';
import { fetchUserToken } from '../api/authapi';
import { setRequestToken } from '../redux/authSlice';
// import { connectFlattradeWebSocket } from '../websocketClient';
// import { DataObject, MarketCard } from '../comman/MarketCard';
// import { LineBarWidgetchats } from './Pages/WidgetCharts/LineBarCharts/LineBarWidgetchats';
// import { LineBardata1 } from './Pages/WidgetCharts/LineBarCharts/datas/LineBardata1';
// import { ResponsiveLine } from '@nivo/line';
// import MarketScoreCard from '../comman/MarketScoreCard';
import UseColorScheme from '../comman/ReusabelCompoents/UseColorScheme';
import MarketScoredDatas from '../comman/MarketScoredDatas';
// import { bgwaveidentify } from '../comman/mythems';

const Dashboard = () => {
    const appKey = process.env.REACT_APP_FLATTRATE_APP_KEY;

    const dispatch = useDispatch<any>();
    const navigate = useNavigate();

    // const requestToken = useSelector((state: RootState) => state.auth.requestToken);
    const [SelectedOptions, setSelectedOptions] = useState<any>([])

    // const [bgwaveidentify, setbgwaveidentify] = useState<string | null>(null);

    useEffect(() => {
        const getToken = async () => {
          try {
            const data = await fetchUserToken();
            dispatch(setRequestToken(data?.requestToken));
            if (data && !appKey) {
              console.error('App key is not defined');
            }
          } catch (error) {
            console.error('Error fetching request token', error);
          }
        };
    
        getToken();
      }, [dispatch, appKey]);
      

      const colorScheme = UseColorScheme();
  
      const backgroundLayoutWave = colorScheme === 'dark'
      ? waveBackground_dark
      : colorScheme === 'light'
      ? waveBackground_light
      : waveBackground_default;

    const options = [
        { id: 1, label: 'Nifty', value: 26000 },
        { id: 2, label: 'Banknifty', value: 26009 },
        { id: 3, label: 'Niftynxt50', value: 26013 },
        { id: 4, label: 'Finnifty', value: 26037 },
        { id: 5, label: 'Midcap Nifty', value: 26014 },
    ];

    const handleSelect = (selectedOptions: { id: number; label: string; value: string }[]) => {
        // Log the selected objects to the console
        setSelectedOptions(selectedOptions)
    };
      

  //   const [data, setData] = useState<any[]>([]);
  // const [chartData, setChartData] = useState<any[]>([
  //   {x: '0',y:  0}
  // ]);
  // const [subscriptmessage,setsubscriptmessage] = useState<any>()
  // const [supportAndResistanceLines, setSupportAndResistanceLines] = useState<any[]>([
  //   { id: 'Base Price', value: 75500 },
  //   { id: 'Support 1', value: 30000 },
  //   { id: 'Support 2', value: 60500 },
  //   { id: 'Resistance 1', value: 82000 },
  //   { id: 'Resistance 2', value: 40500 },
  // ]);

  // const getselctedvalues = SelectedOptions?.map((item: any) => item?.value.toString())

  // useEffect(() => {
  //   const handleLpValue = (message: any) => {
  //     setsubscriptmessage(message);
  //     const timestamp = new Date().toLocaleTimeString();
  //     setData((prevData) => {
  //       const newData = [...prevData, { x: timestamp, y: message.lp }];
  //       return newData.slice(-80); // Keep only the last 80 points
  //     });
  //   };
  
  //   const ws = SelectedOptions?.length > 0
  //     ? connectFlattradeWebSocket(`${process.env.REACT_APP_USER_ID}`, requestToken, `${process.env.REACT_APP_ACCOUNT_ID}`, `NSE|${getselctedvalues}`, handleLpValue)
  //     : null;
  
  //   return () => {
  //     if (ws) {
  //       ws.close(); // Clean up WebSocket connection on unmount
  //     }
  //   };
  // }, [SelectedOptions, requestToken]);



  // useEffect(() => {
  //   if (data.length) {
  //     setChartData([
  //       {
  //         id: 'Live Price',
  //         data: data.map((point) => ({
  //           x: point?.x || '0',
  //           y: point?.y || 0
  //         }))
  //       }
  //     ]);
  //   }
  // }, [data]);


//   useEffect(() => {
//     // Function to handle live price (lp) updates from WebSocket
//     const handleLpValue = (message: any) => {
//         console.log("messlp",message)
//         setsubscriptmessage(message)
//       const timestamp = new Date().toLocaleTimeString(); // Get the current time
//     //   setData((prevData) => [...prevData, { x: timestamp, y: message?.lp }]); // Append new lp data point
//     // setData((prevData) => {
//     //     // Add new data point
//     //     const newData = [...prevData, { x: timestamp, y: message?.lp || 0 }];
        
//     //     // Ensure the data doesn't grow indefinitely; keep the last 20 points
//     //     if (newData.length > 80) {
//     //       newData.shift();
//     //     }

//     //     return newData;
//     //   });

//     setData((prevData) => {
//         const newData = [...prevData, { x: timestamp, y: message.lp }];
//         return newData.slice(-80); // Keep only the last 80 points
//       });

//     };

//     // Connect to WebSocket
//     const ws = SelectedOptions?.length > 0 ? connectFlattradeWebSocket(`${process.env.REACT_APP_USER_ID}`, requestToken, `${process.env.REACT_APP_ACCOUNT_ID}`, `NSE|${getselctedvalues}`, handleLpValue) : null;

//     return () => {
//       if (ws) {
//         ws.close();
//       }
//     };
//   }, [data,SelectedOptions]);

// //   // Update the chart data format when data changes
// //   useEffect(() => {

// //     // setChartData([
// //     //     {
// //     //       id: 'Live Price',
// //     //       data: data
// //     //     }
// //     //   ]);
// //     // setChartData([
// //     //   {
// //     //     id: 'Live Price',
// //     //     data: data.length ? data : [{ x: '0', y: 0 }]   // Ensure chartData has valid default data
// //     //   }
// //     // ]);

// //     if (data.length) {
// //       setChartData([
// //         {
// //           id: 'Live Price',
// //           data: data.map((point) => ({
// //             x: point?.x || '0',  // Default x to '0' if undefined
// //             y: point?.y || 0     // Default y to 0 if undefined
// //           }))
// //         }
// //       ]);
// //     }
// //   }, [data]);


// useEffect(() => {
//     const lineChartData = [
//       {
//         id: 'Live Price',
//         data: data.map((point) => ({
//           x: point.x || '0',
//           y: point.y || 0,
//         })),
//       },
//     //   ...supportAndResistanceLines.map((line) => ({
//     //     id: line.id,
//     //     data: data.map((point) => ({
//     //       x: point.x || '0',
//     //       y: line.value,
//     //     })),
//     //   })),
//     ];

//     setChartData(lineChartData);
//   }, [data, supportAndResistanceLines]);



    return (
        <Box>
            <Box className="backgrounddash" sx={{backgroundImage:`url(${backgroundLayoutWave})`,background:`url(${backgroundLayoutWave}) center center / cover no-repeat fixed`}}>
                <div className="backgrounddashoverlay">

                    <Box>
                        <MultipleSelectWithSearch
                            options={options}
                            placeholder="Select Index"
                            isMultiSelect={false}
                            onSelect={handleSelect}
                        />
                    </Box>

                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Box
                      sx={{
                        color: '#FFFFFF', // White text color
                        minHeight: 'fit-content',
                        padding: '20px',
                      }}
                    >
                      {/* Dashboard Header */}
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'dodgerblue' }}>
                        DASHBOARD
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                        Welcome to your dashboard
                      </Typography>
                        
                        {/* <MarketScoreCard subscriptmessage={subscriptmessage} myoption={options} SelectedOptions={SelectedOptions}/> */}
                        {/* <MarketScoredDatas myoption={options}/> */}

                        </Box>

                    </div>
                <Box>
                  
                </Box>

                
                </div>
            </Box>

        </Box>
    )
}

export default Dashboard