import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AgFinancialCharts } from "ag-charts-react";
import { AgFinancialChartOptions } from "ag-charts-enterprise";
import "ag-charts-enterprise";
import { getData } from "../DataFiles/DataTrading";
import { Box, Button, IconButton, Menu, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { ScreenCapture } from 'react-screen-capture';
import { useWebSocketMessages } from "../../Webhooktypeprocess";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchchartapi } from "../../api/Service/CommanServiceapi";


// 'ag-default' | 'ag-default-dark' | 'ag-sheets' | 'ag-sheets-dark' | 'ag-polychroma' | 'ag-polychroma-dark' | 'ag-vivid' | 'ag-vivid-dark' | 'ag-material' | 'ag-material-dark' | 'ag-financial' | 'ag-financial-dark

const TradingViewChart = () => {
  
  const {selectedDropdownValues} = useSelector((state: RootState) => state.auth);

    // const webhookdatas = useWebSocketMessages();
    // const webhookcontrol = webhookdatas.flat()

    // const isData = webhookcontrol.find(
    //   (item: any) => item?.type === 'index'
    // )?.data;

    // console.log("is Data",isData)
    

    // Define possible values
  const intervalOptions = [1, 3, 5, 10, 15, 30, 60, 120];
  const daysOptions = [1, 5, 30, 60, 120];

  // State to manage selected values
  const [selectedInterval, setSelectedInterval] = useState<number | string>("");
  const [selectedDays, setSelectedDays] = useState<number | string>("");

    // State to store the transformed data
    const [storedData, setStoredData] = useState<any[]>([
      {
        date: new Date(), // Default to today's date
        volume: 0,
        open: 0,
        high: 0,
        low: 0,
        close: 0,
      }
    ]);

  // Handlers for dropdown changes
  const handleIntervalChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedInterval(event.target.value);
  };

  const handleDaysChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedDays(event.target.value);
  };


  // useEffect(() => {
  //   const fetchchartapifunction = async () => {
  //     const Obj = {
  //       indexToken: "26009",
  //       "interval": "5"
  //     };

  //     try {
  //       const response = await fetchchartapi(Obj);
  //       console.log("Full response:", response);
  //       console.log("response.data:", response?.data);

  //       const transformedData = Array.isArray(response?.data?.data)
  //         ? response?.data?.data?.map((item: any) => ({
  //             ...item,
  //             volume: 100, // Add the volume key with the value 100
  //           }))
  //         : []; // Handle non-array data by setting it to an empty array

  //       // Only update state if the new data is different from the current data
  //       if (JSON.stringify(transformedData) !== JSON.stringify(storedData)) {
  //         setStoredData(transformedData);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching chart data:", error);
  //       // Only set empty array if it's not already empty
  //       if (storedData.length > 0) {
  //         setStoredData([]); 
  //       }
  //     }
  //   };

  //   fetchchartapifunction();
  //   // Empty dependency array ensures it runs only on mount
  // }, []); // Do not include `storedData` here
  

  console.log("chart response store: ",storedData)
  


    const [options, setOptions] = useState<any>({
        data: storedData,
        title: { text: `${selectedDropdownValues?.map((item: any) => item?.label?.toString())}` },
        toolbar: true,
        rangeButtons: false,
        height:700 ,
         chartType:'candlestick',
        theme: 'ag-financial' ,
        footnote: {
          text: "1 Minute",
        },
        series: [
          {
            type: "candlestick",
            xKey: "date",
            xName: "Time",
            lowKey: "low",
            highKey: "high",
            openKey: "open",
            closeKey: "close",
            item: {
              up: {
                fill: "#ff0000",
                stroke: "#000",
                wick: {
                  strokeWidth: 2,
                },
              },
              down: {
                fill: "#089981",
                stroke: "#000",
                wick: {
                  strokeWidth: 2,
                },
              },
            },
          },
        ],
        axes: [
          {
            type: "ordinal-time",
            position: "bottom",
            label: {
              format: "%H:%M",
            },
          },
          {
            type: "number",
            position: "right",
            label: {
              formatter: ({ value }:any) => Number(value).toLocaleString(),
            },
            crosshair: {
              label: {
                format: ",f",
              },
            },
          },
        ],
        initialState: {
          
          annotations: [
            {
              type: "parallel-channel",
              start: {
                x: { __type: "date", value: new Date("2023-10-23").getTime() },
                y: 148.0,
              },
              end: {
                x: { __type: "date", value: new Date("2024-12-12").getTime() },
                y: 207.0,
              },
              height: 14,
            },
            {
              type: "horizontal-line",
              value: 131.0,
              stroke: "#089981",
              axisLabel: {
                fill: "#089981",
              },
              
            },
            {
              type: "horizontal-line",
              value: 125.0,
              stroke: "#a5a9ac",
              axisLabel: {
                fill: "#089981",
              },
              text: {
                label: "Support Level",
                position: "center",
                alignment: "right",
                color: "#089981",
              },
            },
            {
              type: "horizontal-line",
              value: 140.8,
              stroke: "#a5a9ac",
              axisLabel: {
                fill: "#F23645",
              },
            },
            {
              type: "horizontal-line",
              value: 120.8,
              stroke: "#a5a9ac",
              axisLabel: {
                fill: "#a5a9ac",
              },
              text: {
                label: "Resistance",
                position: "center",
                alignment: "left",
                color: "#a5a9ac",
              },
            },
            {
              type: "horizontal-line",
              text: {
                label: "Short-term Support",
                position: "top",
                alignment: "center",
                fontSize: 10,
                color: "#a5a9ac",
              },
              value: 131.03092783505156,
              axisLabel: {
                fill: "#a5a9ac",
              },
              stroke: "#a5a9ac",
              lineStyle: "dotted",
            },
            {
              type: "text",
              text: "Distribution",
              x: {
                __type: "date",
                value: "Thu Nov 28 2024 00:00:00 GMT+0000 (Greenwich Mean Time)",
              },
              y: 167.0103092783505,
            },
            {
              type: "comment",
              text: "Accumulation",
              x: {
                __type: "date",
                value: "Thu Nov 28 2024 00:00:00 GMT+0000 (Greenwich Mean Time)",
              },
              y: 131.7479612248038,
            },
            {
              type: "callout",
              color: "#040404",
              fill: "#6baaf3",
              fillOpacity: 0.6,
              stroke: "#2395ff",
              strokeOpacity: 1,
              strokeWidth: 2,
              text: "Markup",
              start: {
                x: {
                  __type: "date",
                  value: "Tue Nov 28 2024 00:00:00 GMT+0000 (Greenwich Mean Time)",
                },
                y: 173.2989690721649,
              },
              end: {
                x: {
                  __type: "date",
                  value: "Tue Nov 28 2024 01:00:00 GMT+0100 (British Summer Time)",
                },
                y: 167.11340206185565,
              },
            },
            {
              type: "line",
              start: {
                x: {
                  __type: "date",
                  value: "Tue Nov 28 2024 01:00:00 GMT+0100 (British Summer Time)",
                },
                y: 120.72164948453609,
              },
              end: {
                x: {
                  __type: "date",
                  value: "Thu Nov 28 2024 01:00:00 GMT+0100 (British Summer Time)",
                },
                y: 138.96907216494844,
              },
              extendEnd: true,
              strokeWidth: 2,
              lineStyle: "dashed",
            },
          ],
        },
      });

useEffect(() => {

  // const fetchchartapifunction = async () => {
  //   const Obj = {
  //     indexToken: "26009",
  //     "interval": "5"
  //   };

  //   try {
  //     const response = await fetchchartapi(Obj);
  //     console.log("Full response:", response);
  //     console.log("response.data:", response?.data);

  //     const transformedData = Array.isArray(response?.data?.data)
  //       ? response?.data?.data?.map((item: any) => ({
  //           ...item,
  //           volume: 100, // Add the volume key with the value 100
  //         }))
  //       : []; // Handle non-array data by setting it to an empty array

  //     // Only update state if the new data is different from the current data
  //     if (JSON.stringify(transformedData) !== JSON.stringify(storedData)) {
  //       setStoredData(transformedData);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching chart data:", error);
  //     // Only set empty array if it's not already empty
  //     if (storedData.length > 0) {
  //       setStoredData([]); 
  //     }
  //   }
  // };

  // fetchchartapifunction();


  setOptions((prev:any) => ({
    ...prev,
    data: storedData,
  }));
}, [storedData]);

useEffect(()=>{

},[selectedDropdownValues])
      
  return (
    <div style={{width:'65%',backgroundColor:'#fff'}}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" , padding:'5px'}}>

      <FormControl size="small" sx={{ minWidth: 120, "& .MuiSelect-root": {
            height: 30,
          }, }}>
        <InputLabel id="interval-label" sx={{fontSize:'12px'}}>Interval</InputLabel>
        <Select
          labelId="interval-label"
          value={selectedInterval}
          onChange={handleIntervalChange}
          label="Interval"
          sx={{fontSize:'8px'}}
        >
          {intervalOptions.map((interval) => (
            <MenuItem key={interval} value={interval} sx={{fontSize:'12px'}}>
              {interval}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120, "& .MuiSelect-root": {
            height: 30,
          }, }}>
        <InputLabel id="days-label" sx={{fontSize:'12px'}}>Days</InputLabel>
        <Select
          labelId="interval-label"
          value={selectedDays}
          onChange={handleDaysChange}
          label="Interval"
          sx={{fontSize:'8px'}}
        >
          {daysOptions.map((days) => (
            <MenuItem key={days} value={days} sx={{fontSize:'12px'}}>
              {days}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
        <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center', rowGap:'10px',columnGap:'30px'}}>
        <Box>
            <AgFinancialCharts style={{height:700}} options={options as any} />
        </Box>
      </Box>
    </div>
  )
}

export default TradingViewChart


























// import React, { useEffect, useRef, useState } from "react";
// import { createRoot } from "react-dom/client";
// import { AgFinancialCharts } from "ag-charts-react";
// import { AgFinancialChartOptions } from "ag-charts-enterprise";
// import "ag-charts-enterprise";
// import { getData } from "../DataFiles/DataTrading";
// import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
// import { ScreenCapture } from 'react-screen-capture';
// import { useWebSocketMessages } from "../../Webhooktypeprocess";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";


// // 'ag-default' | 'ag-default-dark' | 'ag-sheets' | 'ag-sheets-dark' | 'ag-polychroma' | 'ag-polychroma-dark' | 'ag-vivid' | 'ag-vivid-dark' | 'ag-material' | 'ag-material-dark' | 'ag-financial' | 'ag-financial-dark

// const TradingViewChart = () => {
  
//   const {selectedDropdownValues} = useSelector((state: RootState) => state.auth);

//     const webhookdatas = useWebSocketMessages();
//     const webhookcontrol = webhookdatas.flat()

//     const isData = webhookcontrol.find(
//       (item: any) => item?.type === 'index'
//     )?.data;

//     console.log("is Data",isData)
    


//     // State to store the transformed data
//   const [storedData, setStoredData] = useState<any[]>([
//     {
//       date: new Date(), // Default to today's date
//       volume: 0,
//       open: 0,
//       high: 0,
//       low: 0,
//       close: 0,
//     }
//   ]);

//   // Process and update data
//   useEffect(() => {
//     if (isData) {
//       // Transform incoming data into the required format
//       const newData = {
//         date: new Date(isData.date), // Convert string to Date
//         volume: parseInt(isData.volume, 10),
//         open: parseFloat(isData.open),
//         high: parseFloat(isData.high),
//         low: parseFloat(isData.low),
//         close: parseFloat(isData.close),
//       };

//       // Add the new data and ensure only the latest 40 entries are stored
//       setStoredData((prev) => {
//         const updatedData = [...prev, newData];
//         return updatedData.slice(-40); // Keep only the last 40 entries
//       });
//     }
//   }, [isData]);

//     const [options, setOptions] = useState<any>({
//         data: storedData,
//         title: { text: `${selectedDropdownValues?.map((item: any) => item?.label?.toString())}` },
//         toolbar: true,
//         rangeButtons: false,
//         height:700 ,
//          chartType:'candlestick',
//         theme: 'ag-financial' ,
//         footnote: {
//           text: "1 Minute",
//         },
//         series: [
//           {
//             type: "candlestick",
//             xKey: "date",
//             xName: "Time",
//             lowKey: "low",
//             highKey: "high",
//             openKey: "open",
//             closeKey: "close",
//             item: {
//               up: {
//                 fill: "#ff0000",
//                 stroke: "#000",
//                 wick: {
//                   strokeWidth: 2,
//                 },
//               },
//               down: {
//                 fill: "#089981",
//                 stroke: "#000",
//                 wick: {
//                   strokeWidth: 2,
//                 },
//               },
//             },
//           },
//         ],
//         axes: [
//           {
//             type: "ordinal-time",
//             position: "bottom",
//             label: {
//               format: "%H:%M",
//             },
//           },
//           {
//             type: "number",
//             position: "right",
//             label: {
//               formatter: ({ value }:any) => Number(value).toLocaleString(),
//             },
//             crosshair: {
//               label: {
//                 format: ",f",
//               },
//             },
//           },
//         ],
//         initialState: {
          
//           annotations: [
//             {
//               type: "parallel-channel",
//               start: {
//                 x: { __type: "date", value: new Date("2023-10-23").getTime() },
//                 y: 148.0,
//               },
//               end: {
//                 x: { __type: "date", value: new Date("2024-12-12").getTime() },
//                 y: 207.0,
//               },
//               height: 14,
//             },
//             {
//               type: "horizontal-line",
//               value: 131.0,
//               stroke: "#089981",
//               axisLabel: {
//                 fill: "#089981",
//               },
              
//             },
//             {
//               type: "horizontal-line",
//               value: 125.0,
//               stroke: "#a5a9ac",
//               axisLabel: {
//                 fill: "#089981",
//               },
//               text: {
//                 label: "Support Level",
//                 position: "center",
//                 alignment: "right",
//                 color: "#089981",
//               },
//             },
//             {
//               type: "horizontal-line",
//               value: 140.8,
//               stroke: "#a5a9ac",
//               axisLabel: {
//                 fill: "#F23645",
//               },
//             },
//             {
//               type: "horizontal-line",
//               value: 120.8,
//               stroke: "#a5a9ac",
//               axisLabel: {
//                 fill: "#a5a9ac",
//               },
//               text: {
//                 label: "Resistance",
//                 position: "center",
//                 alignment: "left",
//                 color: "#a5a9ac",
//               },
//             },
//             {
//               type: "horizontal-line",
//               text: {
//                 label: "Short-term Support",
//                 position: "top",
//                 alignment: "center",
//                 fontSize: 10,
//                 color: "#a5a9ac",
//               },
//               value: 131.03092783505156,
//               axisLabel: {
//                 fill: "#a5a9ac",
//               },
//               stroke: "#a5a9ac",
//               lineStyle: "dotted",
//             },
//             {
//               type: "text",
//               text: "Distribution",
//               x: {
//                 __type: "date",
//                 value: "Thu Nov 28 2024 00:00:00 GMT+0000 (Greenwich Mean Time)",
//               },
//               y: 167.0103092783505,
//             },
//             {
//               type: "comment",
//               text: "Accumulation",
//               x: {
//                 __type: "date",
//                 value: "Thu Nov 28 2024 00:00:00 GMT+0000 (Greenwich Mean Time)",
//               },
//               y: 131.7479612248038,
//             },
//             {
//               type: "callout",
//               color: "#040404",
//               fill: "#6baaf3",
//               fillOpacity: 0.6,
//               stroke: "#2395ff",
//               strokeOpacity: 1,
//               strokeWidth: 2,
//               text: "Markup",
//               start: {
//                 x: {
//                   __type: "date",
//                   value: "Tue Nov 28 2024 00:00:00 GMT+0000 (Greenwich Mean Time)",
//                 },
//                 y: 173.2989690721649,
//               },
//               end: {
//                 x: {
//                   __type: "date",
//                   value: "Tue Nov 28 2024 01:00:00 GMT+0100 (British Summer Time)",
//                 },
//                 y: 167.11340206185565,
//               },
//             },
//             {
//               type: "line",
//               start: {
//                 x: {
//                   __type: "date",
//                   value: "Tue Nov 28 2024 01:00:00 GMT+0100 (British Summer Time)",
//                 },
//                 y: 120.72164948453609,
//               },
//               end: {
//                 x: {
//                   __type: "date",
//                   value: "Thu Nov 28 2024 01:00:00 GMT+0100 (British Summer Time)",
//                 },
//                 y: 138.96907216494844,
//               },
//               extendEnd: true,
//               strokeWidth: 2,
//               lineStyle: "dashed",
//             },
//           ],
//         },
//       });


// // console.log("dataing",getData())


// // Update options when storedData changes
// useEffect(() => {
//   setOptions((prev:any) => ({
//     ...prev,
//     data: storedData,
//   }));
// }, [storedData]);

// useEffect(()=>{

// },[selectedDropdownValues])
      
//   return (
//     <div style={{width:'65%'}}>
//         <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center', rowGap:'10px',columnGap:'30px'}}>
//         <Box>
//             <AgFinancialCharts style={{height:700}} options={options as any} />
//       </Box>
//       </Box>
//     </div>
//   )
// }

// export default TradingViewChart