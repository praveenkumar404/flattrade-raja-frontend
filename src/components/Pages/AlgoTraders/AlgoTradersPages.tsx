import React, { useEffect, useState } from 'react'
import { TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { RootState } from '../../../redux/store';
import '../../../assets/css/AlgoTraders.css'

import { useDispatch, useSelector } from 'react-redux';
import MultipleSelectWithSearch from '../../../comman/MultipleSelectPlaceholder';
import '../../../assets/css/Dashboard.css'
import waveBackground_dark from '../../../assets/images/wave-haikei_dark.svg';
import waveBackground_light from '../../../assets/images/wave-haikei_light.svg';
import waveBackground_default from '../../../assets/images/wave-haikei_light.svg';
import { useNavigate } from 'react-router-dom';
import { fetchUserToken } from '../../../api/authapi';
import { setRequestToken } from '../../../redux/authSlice';
import { connectFlattradeWebSocket } from '../../../websocketClient';
import { DataObject, MarketCard } from '../../../comman/MarketCard';
import { LineBarWidgetchats } from '../../Pages/WidgetCharts/LineBarCharts/LineBarWidgetchats';
import { LineBardata1 } from '../../Pages/WidgetCharts/LineBarCharts/datas/LineBardata1';
import { ResponsiveLine } from '@nivo/line';
import MarketScoreCard from '../../../comman/MarketScoreCard';
import CalcTable from '../../../comman/ReusabelCompoents/CalcTable';
import UseColorScheme from '../../../comman/ReusabelCompoents/UseColorScheme';

import { useForm, Controller } from "react-hook-form";


const AlgoTradersPages: React.FC = () => {
  // Form state
  // const [basePrice, setBasePrice] = useState<any>();

  const selectedDropdownValues = useSelector((state: RootState) => state.auth.selectedDropdownValues);
  const selectedValue = selectedDropdownValues.map(option => option.value).join(', ');

  const [formValues, setFormValues] = useState({
    basePrice: 0,
    resistance1: 0,
    resistance2: 0,
    support1: 0,
    support2: 0,
    selectoptionvalue: 0,
    amount: 0,
  });
  const [call, setCall] = useState<any>();
  const [put, setPut] = useState<any>();
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  const requestToken = useSelector((state: RootState) => state.auth.requestToken);
    const [SelectedOptions, setSelectedOptions] = useState<any>([])
    const options = [
        { id: 1, label: 'Nifty', value: 26000 },
        { id: 2, label: 'Banknifty', value: 26009 },
        { id: 3, label: 'Niftynxt50', value: 26013 },
        { id: 4, label: 'Finnifty', value: 26037 },
        { id: 5, label: 'NiftyMind Select', value: 26074 },
      ];

      const handleSelect = (selectedOptions: { id: number; label: string; value: string }[]) => {
        // Log the selected objects to the console
        setSelectedOptions(selectedOptions)
        console.log('Selected options:', selectedOptions);
      };
      
      const getselctedvalues = SelectedOptions?.map((item:any)=>item?.value.toString())
      const selectoptionvalue = Number(getselctedvalues); // Default token

  // Calculation logic
  const handleCalculate = () => {

    const calculatedResistance1 = formValues?.basePrice + call;
    const calculatedResistance2 = calculatedResistance1 + put;
    const calculatedSupport1 = formValues.basePrice - put;
    const calculatedSupport2 = calculatedSupport1 - call;


    setFormValues((prevState) => ({
      ...prevState,
      resistance2: calculatedResistance2,
      resistance1: calculatedResistance1,
      support1: calculatedSupport1,
      support2: calculatedSupport2,
    }));

    setIsCalculated(true); // Enable the submit button
  };

  const payload = {
    basePrice: formValues?.basePrice,
    resistance1: formValues?.resistance1,
    resistance2: formValues?.resistance2,
    support1: formValues?.support1,
    support2: formValues?.support2,
    token: selectoptionvalue,
    amount: formValues?.amount,
  };

  // API call on submit
  const handleSubmit = async () => {
    
    

    console.log('payloadalgo',payload)
    try {
      const response = await axios.post(
        'https://srv640728.hstgr.cloud/api/variables/handleInvestmentVariables',
        payload,
        {
          headers: {
            Authorization: 'Bearer 7b6abf23ba7e400fe9f46c86572038d8f8ddf47d962a39fc6458d3ed6e16549f4b3842f3115c4267caaca77388a298b74d494bd61fbe24b35194f7c69c3e7b72063efec09f305974c7e1cf219151436743d0af7d3b61913afb8a7517caf09fd0aa9af12f29558a600ab890eaacf9923c91874acfb8f0b45fae71fb08af55dc14',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data); // Handle the response
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };



  const appKey = process.env.REACT_APP_FLATTRATE_APP_KEY;

    const dispatch = useDispatch<any>();
    const navigate = useNavigate();


    const colorScheme = UseColorScheme();
    console.log('wave :',colorScheme)

    const backgroundLayoutWave = colorScheme === 'dark'
    ? waveBackground_dark
    : colorScheme === 'light'
    ? waveBackground_light
    : waveBackground_default;
    
    
    

    const [data, setData] = useState<any[]>([
      {x: '0',y:  0}]);
  const [chartData, setChartData] = useState<any[]>([
    
]);
  const [subscriptmessage,setsubscriptmessage] = useState<any>()

    useEffect(() => {
        const getToken = async () => {
          try {
            const data = await fetchUserToken('7b6abf23ba7e400fe9f46c86572038d8f8ddf47d962a39fc6458d3ed6e16549f4b3842f3115c4267caaca77388a298b74d494bd61fbe24b35194f7c69c3e7b72063efec09f305974c7e1cf219151436743d0af7d3b61913afb8a7517caf09fd0aa9af12f29558a600ab890eaacf9923c91874acfb8f0b45fae71fb08af55dc14');
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
          data: data?.map((point) => ({
            x: point?.x || '0',
            y: point?.y || 0
          }))
        }
      ]);
    }
  }, [data]);


  const BasePriceLine = 180; // Just an example
  const Resistance2Line = 50;
  const Support2Line = 300;
  const Resistance1Line = 120;
  const Support1Line = 240;

  return (
    <Box>
      <Box className="backgrounddash" sx={{backgroundImage:`url(${backgroundLayoutWave})`,background:`url(${backgroundLayoutWave}) center center / cover no-repeat fixed`}}>
         <div className="backgrounddashoverlay">
        <Box>
        <MultipleSelectWithSearch
        options={options}
        placeholder="Select Flattrate"
        isMultiSelect={false}
        onSelect={handleSelect}
      />
        </Box>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: '30px', width: '600px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        label="Base Price"
        type="number"
        value={formValues.basePrice}
        // onChange={(e) => setBasePrice(Number(e.target.value))}
        onChange={(e) => setFormValues((prevState) => ({
          ...prevState,
          basePrice: Number(e.target.value),
        }))}
      />
      <TextField
        label="Call"
        type="number"
        value={call}
        onChange={(e) => setCall(Number(e.target.value))}
      />
      <TextField
        label="Put"
        type="number"
        value={put}
        onChange={(e) => setPut(Number(e.target.value))}
      />
      <TextField
        label="Amount"
        type="number"
        // value={amount}
        // onChange={(e) => setAmount(Number(e.target.value))}
        value={formValues.amount}
          onChange={(e) => setFormValues((prevState) => ({
            ...prevState,
            amount: Number(e.target.value),
          }))}
      />
      
      <Box sx={{ m: 2 }}>
        <Button
          variant="outlined"
          onClick={handleCalculate}
          // disabled={isCalculated} // Disable after calculation
        >
          Calculate
        </Button>

        {isCalculated ? <Box sx={{padding:'10px'}}>
          <CalcTable dataTable = {payload}/>
        </Box> : null}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!isCalculated} // Enable only after calculate
          sx={{ ml: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Box>

    {
          options.some((item) => item.value === Number(selectedValue)) ? 
          <Box className="backgrounddash customdesign">
          <div style={{ height: '600px',backgroundColor:'white' ,padding:'20px'}}>
          <ResponsiveLine
            data={chartData}
            margin={{ top: 80, right: 50, bottom: 80, left: 140 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -59,
              legend: 'Time',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Algotraders Points',
              legendOffset: -120,
              legendPosition: 'middle'
            }}
            colors={'#4f2da3'}
            pointSize={9}
            // pointColor={{ theme: 'background' }}
            pointColor={"dodgerblue"}
            pointBorderWidth={3}
            pointBorderColor={{ from: 'serieColor' }}
            // pointLabel={e=>e.id == "Live Price" ? e.data.x+": "+e.data.y:''}
            // pointLabel={point => point.serieId === "Live Price" ? `${point.x}: ${point.y}` : ''}
            // onClick={handlePointMouseEnter}
            pointLabelYOffset={-12}
            useMesh={true}
            enableGridX={false}
            enablePointLabel={true}
            enableGridY={true}
            legends={[
              {
                anchor: 'top-left',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 0,
                itemsSpacing: 15,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
    
            // Custom layer for rendering the average line
            layers={[
                'grid'
                , 'markers'
                , 'axes'
                , 'areas'
                , 'crosshair'
                , 'lines'
                , 'slices'
                , 'points'
                , 'mesh'
                , 'legends',
                // Add average line layer
                () => (
                    <g>
                    {/* Norway Average Line */}
                    <line
                      x1="0"
                      x2="85%"
                      y1={BasePriceLine-10}
                      y2={BasePriceLine-10}
                      stroke="black"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />
                    <line
                      x1="0"
                      x2="85%"
                      y1={BasePriceLine}
                      y2={BasePriceLine}
                      stroke="blue"
                      strokeWidth={2}
                      // strokeDasharray="5,5"
                    />
                    <text x="-115" y={BasePriceLine - 5} fill="blue" fontSize="8">
                      Base Price : {formValues?.basePrice}
                    </text>

                    <line
                      x1="0"
                      x2="85%"
                      y1={BasePriceLine+10}
                      y2={BasePriceLine+10}
                      stroke="black"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />
    
                    {/* Germany Average Line */}
                    <line
                      x1="0"
                      x2="85%"
                      y1={Resistance2Line-10}
                      y2={Resistance2Line-10}
                      stroke="black"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />
                    <line
                      x1="0"
                      x2="85%"
                      y1={Resistance2Line}
                      y2={Resistance2Line}
                      stroke="green"
                      strokeWidth={2}
                      // strokeDasharray="5,5"
                    />
                    <text x="-115" y={Resistance2Line - 5} fill="green" fontSize="8">
                      Resistance 2 : {formValues?.resistance2}
                    </text>
                    <line
                      x1="0"
                      x2="85%"
                      y1={Resistance2Line+10}
                      y2={Resistance2Line+10}
                      stroke="black"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />

                    {/* US Average Line */}
                    <line
                      x1="0"
                      x2="85%"
                      y1={Resistance1Line-10}
                      y2={Resistance1Line-10}
                      stroke="black"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />
                    <line
                      x1="0"
                      x2="85%"
                      y1={Resistance1Line}
                      y2={Resistance1Line}
                      stroke="green"
                      strokeWidth={2}
                      // strokeDasharray="5,5"
                    />
                    <text x="-115" y={Resistance1Line - 5} fill="green" fontSize="8">
                    Resistance 1 : {formValues?.resistance1}
                    </text>
                    <line
                      x1="0"
                      x2="85%"
                      y1={Resistance1Line+10}
                      y2={Resistance1Line+10}
                      stroke="black"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />
    
                    {/* France Average Line */}
                    <line
                      x1="0"
                      x2="85%"
                      y1={Support2Line-10}
                      y2={Support2Line-10}
                      stroke="black"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />
                    <line
                      x1="0"
                      x2="85%"
                      y1={Support2Line}
                      y2={Support2Line}
                      stroke="red"
                      strokeWidth={2}
                      // strokeDasharray="5,5"
                    />
                    <text x="-115" y={Support2Line - 5} fill="red" fontSize="8">
                      Support 2 : {formValues?.support2}
                    </text>
                    <line
                      x1="0"
                      x2="85%"
                      y1={Support2Line+10}
                      y2={Support2Line+10}
                      stroke="black"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />
                    
                    <line
                      x1="0"
                      x2="85%"
                      y1={Support1Line-10}
                      y2={Support1Line-10}
                      stroke="black"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />
                    <line
                      x1="0"
                      x2="85%"
                      y1={Support1Line}
                      y2={Support1Line}
                      stroke="red"
                      strokeWidth={2}
                      // strokeDasharray="5,5"
                    />
                    <text x="-115" y={Support1Line - 5} fill="red" fontSize="8">
                      Support 1 : {formValues?.support1}
                    </text>
                    <line
                      x1="0"
                      x2="85%"
                      y1={Support1Line+10}
                      y2={Support1Line+10}
                      stroke="black"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                    />
                  </g>
                ),
              ]}
    
          />
        </div>
        </Box>
        :null
        }  
        
    </div>
    </Box>
        
        
    </Box>
  );
};

export default AlgoTradersPages;









// // import { bgwaveidentify } from '../comman/mythems';

// const AlgoTradersPages = () => {
//     const appKey = process.env.REACT_APP_FLATTRATE_APP_KEY;

//     const dispatch = useDispatch<any>();
//     const navigate = useNavigate();

//     const requestToken = useSelector((state: RootState) => state.auth.requestToken);
//     const [SelectedOptions, setSelectedOptions] = useState<any>([])

//     const [bgwaveidentify, setbgwaveidentify] = useState<string | null>(null);

//     useEffect(() => {
//         const getToken = async () => {
//           try {
//             const data = await fetchUserToken('710f950d820c1bee1ea46a4f4fc1bd140776be2cad242c90700c37f8f42c1f63f1fda0af3f1cf37fd2d0656b29ae59d0c8e61ce4f25b5259363fb1bf8fac59b6f11bf01c490662fdd594084198e41e9654db5ec0d90edc1946f80c6dfaa416679284c0463193361eba932b98b2dea09ca46bb44dcb48eb957c828d1a86737e1d');
//             dispatch(setRequestToken(data?.requestToken));
//             console.log('log', data);
//             if (data && !appKey) {
//               console.error('App key is not defined');
//             }
//           } catch (error) {
//             console.error('Error fetching request token', error);
//           }
//         };
    
//         getToken();
//       }, [dispatch, appKey]);
      

//     useEffect(() => {
//         // Initial retrieval of the 'toolpad-mode' value from localStorage
//         const mode = localStorage.getItem('toolpad-mode');
//         if (mode) {
//           setbgwaveidentify(mode);
//         } else {
//           setbgwaveidentify('default');
//         }

//       }, []);

//   const backgroundLayoutWave = bgwaveidentify === 'dark'
//     ? waveBackground_dark
//     : bgwaveidentify === 'light'
//     ? waveBackground_light
//     : waveBackground_default;
    
//     console.log('wave :',bgwaveidentify)
//     const options = [
//         { id: 1, label: 'Nifty', value: 26000 },
//         { id: 2, label: 'Banknifty', value: 26009 },
//         { id: 3, label: 'Niftynxt50', value: 26013 },
//         { id: 4, label: 'Finnifty', value: 26037 },
//         { id: 5, label: 'NiftyMind Select', value: 26074 },
//     ];

//     const handleSelect = (selectedOptions: { id: number; label: string; value: string }[]) => {
//         // Log the selected objects to the console
//         setSelectedOptions(selectedOptions)
//         console.log('Selected options:', selectedOptions);
//     };

    
//     const subscriptionData: DataObject = {
//         t: 'tk',
//         e: 'NSE',
//         tk: '26009',
//         lp: '51526.10',
//         pc: '0.56',
//         ts: 'Nifty Bank',
//         c: '51239.00',
//         h: '51781.55',
//         l: '51201.85',
//       };
      
//       const receivedMessageData: DataObject = {
//         t: 'tf',
//         e: 'NSE',
//         tk: '26013',
//         lp: '70807.35',
//         pc: '-0.11',
//       };
      
//       const touchlineFeedData: DataObject = {
//         t: 'tf',
//         e: 'NSE',
//         tk: '26013',
//         lp: '70807.35',
//         pc: '-0.11',
//       };


//       const [marketData, setMarketData] = useState<any>({
//         supcription_acknowledge:{},
//         recieved_message:{},
//         touchline_feed:{}
//       });

//       useEffect(()=>{
//         console.log('msss',marketData)
//       },[])

      

//     const [data, setData] = useState<any[]>([]);
//   const [chartData, setChartData] = useState<any[]>([]);
//   const [subscriptmessage,setsubscriptmessage] = useState<any>()
//   const [selectedPoint, setSelectedPoint] = useState<{ x: string; y: number } | null>(null); 
//   const [supportAndResistanceLines, setSupportAndResistanceLines] = useState<any[]>([
//     { id: 'Base Price', value: 75500 },
//     { id: 'Support 1', value: 30000 },
//     { id: 'Support 2', value: 60500 },
//     { id: 'Resistance 1', value: 82000 },
//     { id: 'Resistance 2', value: 40500 },
//   ]);

//   const getselctedvalues = SelectedOptions?.map((item: any) => item?.value.toString())
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
//         ws.close(); // Clean up WebSocket connection on unmount
//       }
//     };
//   }, []);

//   // Update the chart data format when data changes
//   useEffect(() => {

//     // setChartData([
//     //     {
//     //       id: 'Live Price',
//     //       data: data
//     //     }
//     //   ]);
//     // setChartData([
//     //   {
//     //     id: 'Live Price',
//     //     data: data.length ? data : [{ x: '0', y: 0 }]   // Ensure chartData has valid default data
//     //   }
//     // ]);

//     if (data.length) {
//       setChartData([
//         {
//           id: 'Live Price',
//           data: data.map((point) => ({
//             x: point?.x || '0',  // Default x to '0' if undefined
//             y: point?.y || 0     // Default y to 0 if undefined
//           }))
//         }
//       ]);
//     }
//   }, [data]);


// // useEffect(() => {
// //     const lineChartData = [
// //       {
// //         id: 'Live Price',
// //         data: data.map((point) => ({
// //           x: point.x || '0',
// //           y: point.y || 0,
// //         })),
// //       },
// //     //   ...supportAndResistanceLines.map((line) => ({
// //     //     id: line.id,
// //     //     data: data.map((point) => ({
// //     //       x: point.x || '0',
// //     //       y: line.value,
// //     //     })),
// //     //   })),
// //     ];

// //     setChartData(lineChartData);
// //   }, [data, supportAndResistanceLines]);

//   const handlePointMouseEnter = (point: any) => {
//     console.log('Point hovered:', point);
//     // You can update state or perform any action you want here
//   };


//   const BasePriceLine = 180; // Just an example
//   const Resistance2Line = 200;
//   const Support2Line = 250;
//   const Resistance1Line = 50;
//   const Support1Line = 333;


//     return (
//         <Box>
//             {/* <Box>
//                 <div style={{ color: 'green' }}>{requestToken}</div>
//             </Box> */}
//             <Box className="backgrounddash" sx={{backgroundImage:`url(${backgroundLayoutWave})`,background:`url(${backgroundLayoutWave}) center center / cover no-repeat fixed`}}>
//                 <div className="backgrounddashoverlay">
//                     <Box>
//                         <MultipleSelectWithSearch
//                             options={options}
//                             placeholder="Select Index"
//                             isMultiSelect={false}
//                             onSelect={handleSelect}
//                         />
//                     </Box>

//                     <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
//                         {/* <MarketCard data={subscriptionData} />
//                         <MarketCard data={receivedMessageData} />
//                         <MarketCard data={touchlineFeedData} /> */}

//                         <MarketScoreCard subscriptmessage={subscriptmessage} SelectedOptions={SelectedOptions}/>
//                     </div>
//                 <Box>

// <div>
    
// </div>
//     <div style={{ height: '500px',backgroundColor:'white' ,padding:'20px'}}>
//       <ResponsiveLine
//         data={chartData}
//         margin={{ top: 50, right: 50, bottom: 50, left: 120 }}
//         xScale={{ type: 'point' }}
//         yScale={{
//           type: 'linear',
//           min: 'auto',
//           max: 'auto',
//           stacked: false,
//           reverse: false
//         }}
//         axisBottom={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: 'Time',
//           legendOffset: 36,
//           legendPosition: 'middle'
//         }}
//         axisLeft={{
//           tickSize: 5,
//           tickPadding: 5,
//           tickRotation: 0,
//           legend: 'Live Price',
//           legendOffset: -40,
//           legendPosition: 'middle'
//         }}
//         colors={{ scheme: 'category10' }}
//         pointSize={5}
//         pointColor={{ theme: 'background' }}
//         pointBorderWidth={4}
//         pointBorderColor={{ from: 'serieColor' }}
//         // pointLabel={e=>e.id == "Live Price" ? e.data.x+": "+e.data.y:''}
//         // pointLabel={point => point.serieId === "Live Price" ? `${point.x}: ${point.y}` : ''}
//         // onClick={handlePointMouseEnter}
//         pointLabelYOffset={-12}
//         useMesh={true}
//         enableGridX={false}
//         enablePointLabel={true}
//         enableGridY={true}
//         legends={[
//           {
//             anchor: 'top-left',
//             direction: 'row',
//             justify: false,
//             translateX: 0,
//             translateY: -50,
//             itemsSpacing: 15,
//             itemDirection: 'left-to-right',
//             itemWidth: 80,
//             itemHeight: 20,
//             itemOpacity: 0.75,
//             symbolSize: 12,
//             symbolShape: 'circle',
//             symbolBorderColor: 'rgba(0, 0, 0, .5)',
//             effects: [
//               {
//                 on: 'hover',
//                 style: {
//                   itemBackground: 'rgba(0, 0, 0, .03)',
//                   itemOpacity: 1
//                 }
//               }
//             ]
//           }
//         ]}

//         // Custom layer for rendering the average line
//         layers={[
//             'grid'
//             , 'markers'
//             , 'axes'
//             , 'areas'
//             , 'crosshair'
//             , 'lines'
//             , 'slices'
//             , 'points'
//             , 'mesh'
//             , 'legends',
//             // Add average line layer
//             () => (
//                 <g>
//                 {/* Norway Average Line */}
//                 <line
//                   x1="0"
//                   x2="85%"
//                   y1={BasePriceLine}
//                   y2={BasePriceLine}
//                   stroke="blue"
//                   strokeWidth={2}
//                   strokeDasharray="5,5"
//                 />
//                 <text x="-115" y={BasePriceLine - 5} fill="blue" fontSize="8">
//                   Base Price : {75987}
//                 </text>

//                 {/* Germany Average Line */}
//                 <line
//                   x1="0"
//                   x2="85%"
//                   y1={Resistance2Line}
//                   y2={Resistance2Line}
//                   stroke="#ff00ff"
//                   strokeWidth={2}
//                   strokeDasharray="5,5"
//                 />
//                 <text x="-115" y={Resistance2Line - 5} fill="#ff00ff" fontSize="8">
//                   Resistance 2 : {60987}
//                 </text>

//                 {/* US Average Line */}
//                 <line
//                   x1="0"
//                   x2="85%"
//                   y1={Resistance1Line}
//                   y2={Resistance1Line}
//                   stroke="green"
//                   strokeWidth={2}
//                   strokeDasharray="5,5"
//                 />
//                 <text x="-115" y={Resistance1Line - 5} fill="green" fontSize="8">
//                 Resistance 1 : {74376}
//                 </text>

//                 {/* France Average Line */}
                
//                 <line
//                   x1="0"
//                   x2="85%"
//                   y1={Support2Line}
//                   y2={Support2Line}
//                   stroke="red"
//                   strokeWidth={2}
//                   strokeDasharray="5,5"
//                 />
//                 <text x="-115" y={Support2Line - 5} fill="red" fontSize="8">
//                   Support 2 : {50980}
//                 </text>
                
//                 <line
//                   x1="0"
//                   x2="85%"
//                   y1={Support1Line}
//                   y2={Support1Line}
//                   stroke="red"
//                   strokeWidth={2}
//                   strokeDasharray="5,5"
//                 />
//                 <text x="-115" y={Support1Line - 5} fill="red" fontSize="8">
//                   Support 1 : {50980}
//                 </text>
//               </g>
//             ),
//           ]}

//       />
//     </div>

//                 </Box>

                
//                 </div>
//             </Box>

//         </Box>
//     )
// }

// export default AlgoTradersPages
