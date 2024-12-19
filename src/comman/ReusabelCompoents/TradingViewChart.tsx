import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AgFinancialCharts } from "ag-charts-react";
import { AgFinancialChartOptions } from "ag-charts-enterprise";
import "ag-charts-enterprise";
import { getData } from "../DataFiles/DataTrading";
import { Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { ScreenCapture } from 'react-screen-capture';
import { useWebSocketMessages } from "../../Webhooktypeprocess";


// 'ag-default' | 'ag-default-dark' | 'ag-sheets' | 'ag-sheets-dark' | 'ag-polychroma' | 'ag-polychroma-dark' | 'ag-vivid' | 'ag-vivid-dark' | 'ag-material' | 'ag-material-dark' | 'ag-financial' | 'ag-financial-dark

const TradingViewChart = () => {

    const webhookdatas = useWebSocketMessages();
    const webhookcontrol = webhookdatas.flat()

    const isData = webhookcontrol.find(
      (item: any) => item?.type === 'index'
    )?.data;

    console.log("is Data",isData)

    // webhook response
    // {
    //     "type": "index",
    //     "data": {
    //         "t": "tf",
    //         "e": "NSE",
    //         "tk": "26013",
    //         "lp": "70432.20",
    //         "pc": "0.25"
    //     },
    //     "status": true
    // }


    const [options, setOptions] = useState<any>({
        data: getData(),
        title: { text: "NIFTY" },
        toolbar: true,
        rangeButtons: false,
        // container:'' ,
        // width:  ,
        height:500 ,
        // minWidth: ,
        // minHeight: ,
         chartType:'candlestick',
        theme: 'ag-financial' ,
        // subtitle: {
        //   text: "Candlestick Patterns",
        // },
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
    
      // const clearAnnotations = () => {
      //   setOptions((prevOptions) => ({
      //     ...prevOptions,
      //     initialState: {
      //       ...prevOptions.initialState,
      //       annotations: [],
      //     },
      //   }));
      // };
    
    
      // const changeChartType = (type: string) => {
      //   setOptions((prevOptions:any) => ({
      //     ...prevOptions,
      //     chartType: type,
      //   }));
      // };


console.log("dataing",getData())
      
  return (
    <div>
        <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center', rowGap:'10px',columnGap:'30px'}}>

        {/* <Box>
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <Button variant="contained" color="primary"  onClick={() => changeChartType("candlestick")}>Candlestick</Button>
            <Button variant="contained" color="primary"  onClick={() => changeChartType("line")}>Line</Button>
            <Button variant="contained" color="primary"  onClick={() => changeChartType("area")}>Area</Button>
            <Button variant="contained" color="primary"  onClick={clearAnnotations}>Clear All</Button>
          </div>
        </Box> */}
        <Box sx={{marginTop:'40px'}}>
            <AgFinancialCharts style={{height:400}} options={options as any} />
            
      </Box>
      </Box>
    </div>
  )
}

export default TradingViewChart