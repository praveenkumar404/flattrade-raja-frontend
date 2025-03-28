import React, { useEffect, useRef, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { AgFinancialCharts } from "ag-charts-react";
import { AgFinancialChartOptions } from "ag-charts-enterprise";
import "ag-charts-enterprise";
import { getData } from "../DataFiles/DataTrading";
import { Box, Button, IconButton, Menu, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { ScreenCapture } from 'react-screen-capture';
import { useWebSocketMessages } from "../../Webhooktypeprocess";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetchchartapi } from "../../api/Service/CommanServiceapi";
import { setTradingWatchlistPersist } from "../../redux/TradingWatchlistSlice";
import UseColorScheme from "./UseColorScheme";

const TradingViewChart = () => {

  const dispatch = useDispatch();
  const colorScheme = UseColorScheme();

    const backgroundLayoutWave = colorScheme === 'dark'
    ? '#192232' //#112e4d
    : colorScheme === 'light'
    ? '#fff'
    : '#fff';

    const backgroundChartLayoutWave = colorScheme === 'dark'
    ? 'ag-financial-dark'
    : colorScheme === 'light'
    ? 'ag-financial'
    : 'ag-financial';

    const ColorChartLayoutWave = colorScheme === 'dark'
    ? '#fff' //#112e4d
    : colorScheme === 'light'
    ? '#192232'
    : '#192232';
    
  const { selectedDropdownValues } = useSelector((state: RootState) => state.auth);
  const watchlistselectrow = useSelector((state: RootState) => state?.tradingWatchlist?.TradingWatchlistPersist);

  const intervalOptions = [1, 3, 5, 10, 15, 30, 60, 120];
  const daysOptions = [1, 5, 30, 60, 120];

  const [selectedInterval, setSelectedInterval] = useState<any>(1);
  const [selectedDays, setSelectedDays] = useState<number | string>("");
  const [storedData, setStoredData] = useState<any[]>([
    {
      date: new Date(),
      volume: 0,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
    }
  ]);

  const selectIndexoptions = [
    { id: 1, label: 'Nifty', value: 26000 },
    { id: 2, label: 'Banknifty', value: 26009 },
    { id: 3, label: 'Niftynxt50', value: 26013 },
    { id: 4, label: 'Finnifty', value: 26037 },
  ];

  
  const [SelectedOptionsIndex, setSelectedOptionsIndex] = useState<any>({ id: 2, label: 'Banknifty', value: 26009 });

  const handleIndexSelect = (event: SelectChangeEvent<any>) => {
    const selectedValue = event.target.value;
    const selectedOption = selectIndexoptions.find(option => option.value === selectedValue);
    if (selectedOption) {
      setSelectedOptionsIndex(selectedOption);
      dispatch(setTradingWatchlistPersist(SelectedOptionsIndex));
    }
  };

  const handleIntervalChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedInterval(event.target.value);
  };

  const handleDaysChange = (event: SelectChangeEvent<string | number>) => {
    setSelectedDays(event.target.value);
  };

  const highestHighValue = useMemo(() => {
    return Number(storedData.reduce((max, item) => (item.high > max ? item.high : max), 0));
  }, [storedData]);

  console.log("Higer Chert value from high : ",highestHighValue)

  const [options, setOptions] = useState<any>({
    data: storedData,
    title: { text: `${selectedDropdownValues?.map((item: any) => item?.label?.toString())}` },
    toolbar: true,
    rangeButtons: false,
    height: 700,
    chartType: 'candlestick',
    theme: backgroundChartLayoutWave,
    footnote: {
      text: "1 Minute",
    },
    navigator: true,
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
            stroke: "#ff0000",
            wick: {
              strokeWidth: 2,
            },
          },
          down: {
            fill: "#089981",
            stroke: "#089981",
            wick: {
              strokeWidth: 2,
            },
          },
        },
      },
    ],
    // axes: [
    //   {
    //     type: "ordinal-time",
    //     position: "bottom",
    //     label: {
    //       format: "%H:%M",
    //     },
    //   },
    //   {
    //     type: "number",
    //     position: "right",
    //     label: {
    //       formatter: ({ value }: any) => Number(value).toLocaleString(),
    //     },
    //     crosshair: {
    //       label: {
    //         format: ",f",
    //       },
    //     },
    //   },
    // ],

    axes: [
      {
        type: "time", // Change from "ordinal-time" to "time"
        position: "bottom",
        label: {
          format: "%H:%M:%S", // Format to show hours, minutes, and seconds
        },
        nice: true, // Automatically adjusts the time range
      },
      {
        type: "number",
        position: "right",
        label: {
          formatter: ({ value }: any) => Number(value).toLocaleString(),
        },
        crosshair: {
          label: {
            format: ",f",
          },
        },
      },
    ],
    
    initialState: {
      annotations: [],
    },
  });

// // ====================================================================================================================================
  
//   const fetchchartapifunction = async () => {
//     const Obj = {
//       indexToken: `${watchlistselectrow?.value}`,
//       "interval": selectedInterval.toString()
//     };

//     try {
//       const response = await fetchchartapi(Obj);
//       const transformedData = Array.isArray(response?.data?.data)
//         ? response?.data?.data?.map((item: any) => ({
//             ...item,
//             date: new Date(item.date),
//             volume: 100,
//           }))
//         : [];

//       if (JSON.stringify(transformedData) !== JSON.stringify(storedData)) {
//         setStoredData(transformedData);
//       }
//     } catch (error) {
//       console.error("Error fetching chart data:", error);
//       if (storedData.length > 0) {
//         setStoredData([]);
//       }
//     }
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       fetchchartapifunction();
//     }, selectedInterval * 60000); // Convert minutes to milliseconds

//     // Clear the interval when the component unmounts or when the selected interval changes
//     return () => clearInterval(intervalId);
//   }, [selectedInterval]);

//   useEffect(() => {
//     setOptions((prev: any) => ({
//       ...prev,
//       data: storedData,
//     }));
//   }, [storedData]);

//   // console.log("chart store : ", storedData);

// //   ===================================================================================================================================

  useEffect(() => {

    const mydash = (dashValue: number) => { // Corrected parameter type
      return {
        type: "horizontal-line",
        text: {
          // label: "Dashh",
          position: "top",
          alignment: "center",
          fontSize: 10,
          color: "#a5a9ac",
        },
        value: Number(highestHighValue - dashValue), // Use dashValue
        axisLabel: {
          fill: "#a5a9ac",
        },
        stroke: "#a5a9ac",
        lineStyle: "dotted",
      };
    };

    if (storedData && storedData.length > 0) {
      setOptions((prev: any) => ({
        ...prev,
        theme: backgroundChartLayoutWave,
        initialState: {
          annotations: [
            {
              type: "parallel-channel",
              start: {
                x: { __type: "date", value: new Date("2023-10-23").getTime() },
                y: Number(highestHighValue - 148.0),
              },
              end: {
                x: { __type: "date", value: new Date("2024-12-12").getTime() },
                y: Number(highestHighValue - 207.0),
              },
              height: 14,
            },
            mydash(10),
            {
              type: "horizontal-line",
              value: Number(highestHighValue - 20.8),
              stroke: "#089981",
              axisLabel: {
                fill: "#089981",
              },
              text: {
                label: "Resistance 1",
                position: "center",
                alignment: "left",
                color: "#089981",
              },
            },
            mydash(30),
            mydash(80),
            {
              type: "horizontal-line",
              value: Number(highestHighValue - 90.8),
              stroke: "#089981",
              axisLabel: {
                fill: "#089981",
              },
              text: {
                label: "Resistance 2",
                position: "center",
                alignment: "left",
                color: "#089981",
              },
            },
            mydash(100),
            mydash(155),
            {
              type: "horizontal-line",
              value: Number(highestHighValue - 165.8),
              stroke: "#52007A",
              axisLabel: {
                fill: "#52007A",
              },
              text: {
                label: "Base price",
                position: "center",
                alignment: "right",
                color: "#52007A",
              },
            },
            mydash(175),
            mydash(240),
            {
              type: "horizontal-line",
              value: Number(highestHighValue - 250.03092783505156),
              stroke: "#ff0000",
              axisLabel: {
                fill: "#ff0000",
              },
              text: {
                label: "Support 1",
                position: "center",
                alignment: "left",
                color: "#ff0000",
              },
            },
            mydash(260),
            mydash(310),
            {
              type: "horizontal-line",
              value: Number(highestHighValue - 320.8),
              stroke: "#ff0000",
              axisLabel: {
                fill: "#ff0000",
              },
              text: {
                label: "Support 2",
                position: "center",
                alignment: "left",
                color: "#ff0000",
              },
            },
            mydash(330),
            {
              type: "text",
              text: "Distribution",
              x: {
                __type: "date",
                value: "Thu Dec 30 2025 00:00:00 GMT+0000 (Greenwich Mean Time)",
              },
              y: Number(highestHighValue - 217.0103092783505),
            },
            {
              type: "comment",
              text: "Accumulation",
              x: {
                __type: "date",
                value: "Thu Dec 30 2025 00:00:00 GMT+0000 (Greenwich Mean Time)",
              },
              y: Number(highestHighValue - 231.7479612248038),
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
                  value: "Thu Dec 30 2025 00:00:00 GMT+0000 (Greenwich Mean Time)",
                },
                y: Number(highestHighValue - 243.2989690721649),
              },
              end: {
                x: {
                  __type: "date",
                  value: "Thu Dec 30 2025 01:00:00 GMT+0100 (British Summer Time)",
                },
                y: Number(highestHighValue - 267.11340206185565),
              },
            },
            {
              type: "line",
              start: {
                x: {
                  __type: "date",
                  value: "Thu Dec 30 2025 01:00:00 GMT+0100 (British Summer Time)",
                },
                y: Number(highestHighValue - 120.72164948453609),
              },
              end: {
                x: {
                  __type: "date",
                  value: "Thu Dec 30 2025 01:00:00 GMT+0100 (British Summer Time)",
                },
                y: Number(highestHighValue - 138.96907216494844),
              },
              extendEnd: true,
              strokeWidth: 2,
              lineStyle: "dashed",
            },
          ],
        },


        axes: prev.axes.map((axis: any) =>
          axis.type === "time"
            ? {
                ...axis,
                domain: [
                  new Date(storedData[0]?.date || new Date()),
                  new Date(storedData[storedData.length - 1]?.date || new Date()),
                ],
              }
            : axis
        ),
        

        // tooltip: {
        //   renderer: (params: any) => {
        //     if (!params.datum) {
        //       return '';
        //     }
    
        //     const { datum } = params;
        //     const date = new Date(datum.date).toLocaleString();
        //     const open = datum.open.toFixed(2);
        //     const high = datum.high.toFixed(2);
        //     const low = datum.low.toFixed(2);
        //     const close = datum.close.toFixed(2);
        //     const volume = datum.volume;
    
        //     return(
        //       <div style={{}}>
        //         <div><strong>Date:</strong> ${date}</div>
        //         <div><strong>Open:</strong> ${open}</div>
        //         <div><strong>High:</strong> ${high}</div>
        //         <div><strong>Low:</strong> ${low}</div>
        //         <div><strong>Close:</strong> ${close}</div>
        //         <div><strong>Volume:</strong> ${volume}</div>
        //       </div>
        //     );
        //   },
        // }
      }));
    }
  }, [storedData, highestHighValue, backgroundLayoutWave, backgroundChartLayoutWave]);

  const chartRef = useRef<HTMLDivElement>(null);
  const [tooltipData, setTooltipData] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const chartContainer = chartRef.current;

    const handleMouseMove = (event: MouseEvent) => {
      if (!chartContainer || !options.axes) return;

      const rect = chartContainer.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const xAxis = options.axes.find((axis: any) => axis.position === "bottom");
      if (!xAxis) return;

      const dateRange = xAxis.niceDomain;
      if (!dateRange || !dateRange[0] || !dateRange[1]) return;

      const chartWidth = rect.width;
      const timeRange = dateRange[1].getTime() - dateRange[0].getTime();
      const mouseDate = new Date(dateRange[0].getTime() + (mouseX / chartWidth) * timeRange);

      let closestDataPoint = null;
      let minDistance = Infinity;

      storedData.forEach((dataPoint) => {
        const distance = Math.abs(dataPoint.date.getTime() - mouseDate.getTime());
        if (distance < minDistance) {
          minDistance = distance;
          closestDataPoint = dataPoint;
        }
      });

      if (closestDataPoint) {
        setTooltipData(closestDataPoint);
        setTooltipPosition({ x: event.clientX, y: event.clientY });
      } else {
        setTooltipData(null);
      }
    };

    if (chartContainer) {
      chartContainer.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (chartContainer) {
        chartContainer.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [options, storedData]);


  return (
    <div style={{ width: '65%', backgroundColor: backgroundLayoutWave }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", padding: '5px' ,paddingTop:'10px'}}>

      <FormControl size="small" sx={{ minWidth: 120, "& .MuiSelect-root": { height: 30 } }}>
          <InputLabel id="index-label" sx={{ fontSize: '12px' }}>Index</InputLabel>
          <Select
            labelId="index-label"
            value={watchlistselectrow.value}
            onChange={handleIndexSelect}
            label="Index"
            sx={{ fontSize: '8px' }}
          >
            {selectIndexoptions.map((sioitem) => (
              <MenuItem key={sioitem.id} value={sioitem.value} sx={{ fontSize: '12px' }}>
                {sioitem.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120, "& .MuiSelect-root": { height: 30 } }}>
          <InputLabel id="interval-label" sx={{ fontSize: '12px' }}>Interval</InputLabel>
          <Select
            labelId="interval-label"
            value={selectedInterval}
            onChange={handleIntervalChange}
            label="Interval"
            sx={{ fontSize: '8px' }}
          >
            {intervalOptions.map((interval) => (
              <MenuItem key={interval} value={interval} sx={{ fontSize: '12px' }}>
                {interval}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120, "& .MuiSelect-root": { height: 30 } }}>
          <InputLabel id="days-label" sx={{ fontSize: '12px' }}>Days</InputLabel>
          <Select
            labelId="interval-label"
            value={selectedDays}
            onChange={handleDaysChange}
            label="Interval"
            sx={{ fontSize: '8px' }}
          >
            {daysOptions.map((days) => (
              <MenuItem key={days} value={days} sx={{ fontSize: '12px' }}>
                {days}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', rowGap: '10px', columnGap: '30px' }}>
        <Box>
          <AgFinancialCharts style={{ height: 700 }} options={options as any} />
        </Box>

        <Box>
        {tooltipData && (
        <div
          style={{
            position: "absolute",
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
            background: "white",
            padding: "10px",
            border: "1px solid #ccc",
            zIndex: 3000,
          }}
        >
          <div><strong>Date:</strong> {new Date(tooltipData.date).toLocaleString()}</div>
          <div><strong>Open:</strong> {tooltipData.open.toFixed(2)}</div>
          <div><strong>High:</strong> {tooltipData.high.toFixed(2)}</div>
          <div><strong>Low:</strong> {tooltipData.low.toFixed(2)}</div>
          <div><strong>Close:</strong> {tooltipData.close.toFixed(2)}</div>
          <div><strong>Volume:</strong> {tooltipData.volume}</div>
        </div>
      )}
        </Box>
      </Box>
    </div>
  );
};

export default TradingViewChart;















// import React, { useEffect, useRef, useState } from "react";
// import { createRoot } from "react-dom/client";
// import { AgFinancialCharts } from "ag-charts-react";
// import { AgFinancialChartOptions } from "ag-charts-enterprise";
// import "ag-charts-enterprise";
// import { getData } from "../DataFiles/DataTrading";
// import { Box, Button, IconButton, Menu, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
// import { ScreenCapture } from 'react-screen-capture';
// import { useWebSocketMessages } from "../../Webhooktypeprocess";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import { fetchchartapi } from "../../api/Service/CommanServiceapi";


// // 'ag-default' | 'ag-default-dark' | 'ag-sheets' | 'ag-sheets-dark' | 'ag-polychroma' | 'ag-polychroma-dark' | 'ag-vivid' | 'ag-vivid-dark' | 'ag-material' | 'ag-material-dark' | 'ag-financial' | 'ag-financial-dark

// const TradingViewChart = () => {
  
//   const {selectedDropdownValues} = useSelector((state: RootState) => state.auth);

//     // Define possible values
//   const intervalOptions = [1, 3, 5, 10, 15, 30, 60, 120];
//   const daysOptions = [1, 5, 30, 60, 120];

//   // State to manage selected values
//   const [selectedInterval, setSelectedInterval] = useState<number | string>("");
//   const [selectedDays, setSelectedDays] = useState<number | string>("");

//     // State to store the transformed data
//     const [storedData, setStoredData] = useState<any[]>([
//       {
//         date: new Date(), // Default to today's date
//         volume: 0,
//         open: 0,
//         high: 0,
//         low: 0,
//         close: 0,
//       }
//     ]);

//   // Handlers for dropdown changes
//   const handleIntervalChange = (event: SelectChangeEvent<string | number>) => {
//     setSelectedInterval(event.target.value);
//   };

//   const handleDaysChange = (event: SelectChangeEvent<string | number>) => {
//     setSelectedDays(event.target.value);
//   };
  
//   const highestHighValue = Number(storedData.reduce((max, item) => (item.high > max ? item.high : max), 0));
//   console.log("Highest High Value:", highestHighValue);
  

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
//                 y: highestHighValue - 148.0,
//               },
//               end: {
//                 x: { __type: "date", value: new Date("2024-12-12").getTime() },
//                 y: highestHighValue - 207.0,
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
//               value: highestHighValue - 125.0,
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
//               value: highestHighValue - 140.8,
//               stroke: "#a5a9ac",
//               axisLabel: {
//                 fill: "#F23645",
//               },
//             },
//             {
//               type: "horizontal-line",
//               value: highestHighValue - 120.8,
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
//               value: highestHighValue - 131.03092783505156,
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
//                 value: "Thu Dec 30 2025 00:00:00 GMT+0000 (Greenwich Mean Time)",
//               },
//               y: highestHighValue - 167.0103092783505,
//             },
//             {
//               type: "comment",
//               text: "Accumulation",
//               x: {
//                 __type: "date",
//                 value: "Thu Dec 30 2025 00:00:00 GMT+0000 (Greenwich Mean Time)",
//               },
//               y: highestHighValue - 131.7479612248038,
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
//                   value: "Thu Dec 30 2025 00:00:00 GMT+0000 (Greenwich Mean Time)",
//                 },
//                 y: highestHighValue - 173.2989690721649,
//               },
//               end: {
//                 x: {
//                   __type: "date",
//                   value: "Thu Dec 30 2025 01:00:00 GMT+0100 (British Summer Time)",
//                 },
//                 y: highestHighValue - 167.11340206185565,
//               },
//             },
//             {
//               type: "line",
//               start: {
//                 x: {
//                   __type: "date",
//                   value: "Thu Dec 30 2025 01:00:00 GMT+0100 (British Summer Time)",
//                 },
//                 y: highestHighValue - 120.72164948453609,
//               },
//               end: {
//                 x: {
//                   __type: "date",
//                   value: "Thu Dec 30 2025 01:00:00 GMT+0100 (British Summer Time)",
//                 },
//                 y: highestHighValue - 138.96907216494844,
//               },
//               extendEnd: true,
//               strokeWidth: 2,
//               lineStyle: "dashed",
//             },
//           ],
//         },
//       });

// // useEffect(() => {

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
//             date: new Date(item.date),
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

//   useEffect(()=>{
//   fetchchartapifunction();

//   setOptions((prev:any) => ({
//     ...prev,
//     data: storedData,
//   }));
// }, [storedData]);

// console.log("chart store : ",storedData)



// useEffect(()=>{

// },[selectedDropdownValues])



      
//   return (
//     <div style={{width:'65%',backgroundColor:'#fff'}}>
//       <div style={{ display: "flex", gap: "1rem", alignItems: "center" , padding:'5px'}}>

//       <FormControl size="small" sx={{ minWidth: 120, "& .MuiSelect-root": {
//             height: 30,
//           }, }}>
//         <InputLabel id="interval-label" sx={{fontSize:'12px'}}>Interval</InputLabel>
//         <Select
//           labelId="interval-label"
//           value={selectedInterval}
//           onChange={handleIntervalChange}
//           label="Interval"
//           sx={{fontSize:'8px'}}
//         >
//           {intervalOptions.map((interval) => (
//             <MenuItem key={interval} value={interval} sx={{fontSize:'12px'}}>
//               {interval}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <FormControl size="small" sx={{ minWidth: 120, "& .MuiSelect-root": {
//             height: 30,
//           }, }}>
//         <InputLabel id="days-label" sx={{fontSize:'12px'}}>Days</InputLabel>
//         <Select
//           labelId="interval-label"
//           value={selectedDays}
//           onChange={handleDaysChange}
//           label="Interval"
//           sx={{fontSize:'8px'}}
//         >
//           {daysOptions.map((days) => (
//             <MenuItem key={days} value={days} sx={{fontSize:'12px'}}>
//               {days}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </div>
//         <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center', rowGap:'10px',columnGap:'30px'}}>
//         <Box>
//             <AgFinancialCharts style={{height:700}} options={options as any} />
//         </Box>
//       </Box>
//     </div>
//   )
// }

// export default TradingViewChart


























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