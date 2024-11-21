import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import MultipleSelectWithSearch from '../comman/MultipleSelectPlaceholder';
import '../assets/css/Dashboard.css'
import waveBackground_dark from '../assets/images/wave-haikei_dark.svg';
import waveBackground_light from '../assets/images/wave-haikei_light.svg';
import waveBackground_default from '../assets/images/wave-haikei_light.svg';
import { useNavigate } from 'react-router-dom';
import { fetchUserToken } from '../api/authapi';
import { setRequestToken } from '../redux/authSlice';
import { connectFlattradeWebSocket } from '../websocketClient';
import { DataObject, MarketCard } from '../comman/MarketCard';
import { LineBarWidgetchats } from './Pages/WidgetCharts/LineBarCharts/LineBarWidgetchats';
import { LineBardata1 } from './Pages/WidgetCharts/LineBarCharts/datas/LineBardata1';
import { ResponsiveLine } from '@nivo/line';
import MarketScoreCard from '../comman/MarketScoreCard';
// import { bgwaveidentify } from '../comman/mythems';

const Dashboard = () => {
    const appKey = process.env.REACT_APP_FLATTRATE_APP_KEY;

    const dispatch = useDispatch<any>();
    const navigate = useNavigate();

    const requestToken = useSelector((state: RootState) => state.auth.requestToken);
    const [SelectedOptions, setSelectedOptions] = useState<any>([])

    const [bgwaveidentify, setbgwaveidentify] = useState<string | null>(null);

    useEffect(() => {
        const getToken = async () => {
          try {
            const data = await ;
            dispatch(setRequestToken(data?.requestToken));
            console.log('log', data);
            if (data && !appKey) {
              console.error('App key is not defined');
            }
          } catch (error) {
            console.error('Error fetching request token', error);
          }
        };
    
        getToken();
      }, [dispatch, appKey]);
      

    useEffect(() => {
        // Initial retrieval of the 'toolpad-mode' value from localStorage
        const mode = localStorage.getItem('toolpad-mode');
        if (mode) {
          setbgwaveidentify(mode);
        } else {
          setbgwaveidentify('default');
        }

      }, []);

  const backgroundLayoutWave = bgwaveidentify === 'dark'
    ? waveBackground_dark
    : bgwaveidentify === 'light'
    ? waveBackground_light
    : waveBackground_default;
    
    console.log('wave :',bgwaveidentify)
    const options = [
        { id: 1, label: 'Nifty', value: 26000 },
        { id: 2, label: 'Banknifty', value: 26009 },
        { id: 3, label: 'Niftynxt50', value: 26013 },
        { id: 4, label: 'Finnifty', value: 26037 },
        { id: 5, label: 'NiftyMind Select', value: 26014 },
    ];

    const handleSelect = (selectedOptions: { id: number; label: string; value: string }[]) => {
        // Log the selected objects to the console
        setSelectedOptions(selectedOptions)
        console.log('Selected options:', selectedOptions);
    };
      

    const [data, setData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([
    {x: '0',y:  0}
  ]);
  const [subscriptmessage,setsubscriptmessage] = useState<any>()
  const [supportAndResistanceLines, setSupportAndResistanceLines] = useState<any[]>([
    { id: 'Base Price', value: 75500 },
    { id: 'Support 1', value: 30000 },
    { id: 'Support 2', value: 60500 },
    { id: 'Resistance 1', value: 82000 },
    { id: 'Resistance 2', value: 40500 },
  ]);

  const getselctedvalues = SelectedOptions?.map((item: any) => item?.value.toString())

  useEffect(() => {
    const handleLpValue = (message: any) => {
      setsubscriptmessage(message);
      const timestamp = new Date().toLocaleTimeString();
      setData((prevData) => {
        const newData = [...prevData, { x: timestamp, y: message.lp }];
        return newData.slice(-80); // Keep only the last 80 points
      });
    };
  
    const ws = SelectedOptions?.length > 0
      ? connectFlattradeWebSocket('FT048819', requestToken, 'FT048819', `NSE|${getselctedvalues}`, handleLpValue)
      : null;
  
    return () => {
      if (ws) {
        ws.close(); // Clean up WebSocket connection on unmount
      }
    };
  }, [SelectedOptions, requestToken]);



  useEffect(() => {
    if (data.length) {
      console.log('Updating chart data with:', data);
      setChartData([
        {
          id: 'Live Price',
          data: data.map((point) => ({
            x: point?.x || '0',
            y: point?.y || 0
          }))
        }
      ]);
    }
  }, [data]);


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
//     const ws = SelectedOptions?.length > 0 ? connectFlattradeWebSocket('FT048819', requestToken, 'FT048819', `NSE|${getselctedvalues}`, handleLpValue) : null;

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

                        <MarketScoreCard subscriptmessage={subscriptmessage} myoption={options} SelectedOptions={SelectedOptions}/>
                    </div>
                <Box>
                </Box>

                
                </div>
            </Box>

        </Box>
    )
}

export default Dashboard









// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store';

// const Dashboard: React.FC = () => {
//   // State to store the API responses
//   const [authResponse, setAuthResponse] = useState<any>(null);
//   const [userDetails, setUserDetails] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const requestToken = useSelector((state: RootState) => state.auth.requestToken);
//   useEffect(() => {
//     // Fetching authentication data from API
//     const fetchAuthData = async () => {
//       try {
//         const response = await fetch('http://localhost:1337/api/authentications', {
//           method: 'GET',
//           headers: {
//             'Authorization': 'Bearer 647dc15d56e4a5bcea8526841aa5bb505299e3235270e8d43650c293504473728899e74eaa814cf42439eb5b1f9d4e29b22322c741c42441fa37bcebf44f3e85a2b7b34f310e4b7476b9005cc044862a5388571e1cc7e93426c1e7bf43308dfbe93fab05fe8beb7fa3bf04a6c2141fb78b219a3906a656d3a64a1425b809b36c',
//           },
//         });

//         // Check if response is OK
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json(); // Parse JSON response
//         setAuthResponse(data); // Store response data in state

//         // Extract `documentId` (assumed as `uid`) and `requestToken` (assumed as `jKey`)
//         const documentId = data?.data[0]?.documentId;
//         const requestToken = data?.data[0]?.requestToken;

//         if (documentId && requestToken) {
//           // Now, fetch user details using documentId and requestToken
//           const userDetailResponse = await fetch('https://piconnect.flattrade.in/PiConnectTP/UserDetails', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: `jData={"uid":"${`FT048819`}"}&jKey=${requestToken}`
//           });

//           // Check if user detail response is OK
//           if (!userDetailResponse.ok) {
//             throw new Error(`User Details error! status: ${userDetailResponse.status}`);
//           }

//           const userDetailsData = await userDetailResponse.json();
//           setUserDetails(userDetailsData); // Store user details response in state
//         } else {
//           throw new Error('Missing documentId or requestToken from authentication response');
//         }

//         setLoading(false); // Set loading to false
//       } catch (error: any) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchAuthData(); // Call the async function when the component mounts
//   }, []); // Empty dependency array means this runs once when the component mounts

//   // Loading and error handling
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   // Display the API responses in JSX
//   return (
//     <div>
//         <div style={{color:'green'}}>{requestToken}</div>
//       <h2>Authentication Response:</h2>
//       <pre>{JSON.stringify(authResponse, null, 2)}</pre>

//       <h2>User Details:</h2>
//       {userDetails ? (
//         <pre>{JSON.stringify(userDetails, null, 2)}</pre>
//       ) : (
//         <p>No user details available</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
