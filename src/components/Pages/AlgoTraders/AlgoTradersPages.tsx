import React, { useEffect, useState } from 'react'
import { TextField, Button, Box, dialogActionsClasses, SnackbarOrigin, Snackbar } from '@mui/material';
import axios from 'axios';
import { RootState } from '../../../redux/store';
import '../../../assets/css/AlgoTraders.css'

import { useDispatch, useSelector } from 'react-redux';
import MultipleSelectWithSearch from '../../../comman/MultipleSelectPlaceholder';
import '../../../assets/css/Dashboard.css'
import waveBackground_dark from '../../../assets/images/backgroundsvgs/bg-dark.svg';
import waveBackground_light from '../../../assets/images/backgroundsvgs/bg-light.svg';
import waveBackground_default from '../../../assets/images/Light_theme.jpg';
import { useNavigate } from 'react-router-dom';
import { fetchUserToken } from '../../../api/authapi';
import { setoverLaypersist, setRequestToken } from '../../../redux/authSlice';
// import { connectFlattradeWebSocket } from '../../../websocketClient';
import { DataObject, MarketCard } from '../../../comman/MarketCard';
import { LineBarWidgetchats } from '../../Pages/WidgetCharts/LineBarCharts/LineBarWidgetchats';
import { LineBardata1 } from '../../Pages/WidgetCharts/LineBarCharts/datas/LineBardata1';
import { ResponsiveLine } from '@nivo/line';
import MarketScoreCard from '../../../comman/MarketScoreCard';
import CalcTable from '../../../comman/ReusabelCompoents/CalcTable';
import UseColorScheme from '../../../comman/ReusabelCompoents/UseColorScheme';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';

import { useForm, Controller } from "react-hook-form";
import moment from 'moment';
import ToastNotification from '../../../comman/ReusabelCompoents/ToastNotification';
import OverlayBox from '../../../comman/ReusabelCompoents/OverlayBox';
import { useWebSocketMessages } from '../../../Webhooktypeprocess';


const AlgoTradersPages: React.FC = () => {

  const selectedDropdownValues = useSelector((state: RootState) => state.auth.selectedDropdownValues);
  const {overLaypersist} = useSelector((state: RootState) => state.auth);
  const selectedValue = selectedDropdownValues.map(option => option.value).join(', ');


  const [formValues, setFormValues] = useState({
    basePrice: "",
    resistance1: "",
    resistance2: "",
    support1: "",
    support2: "",
    amount: "",
    expiry: "",
    quantity: "",
  });

  const [errors, setErrors] = useState({
    basePrice: "",
    call: "",
    put: "",
    amount: "",
    expiry: "",
    quantity: "",
  });


  const [call, setCall] = useState<any>();
  const [put, setPut] = useState<any>();
  const [buttondisabledObject, sebuttondisabledObject] = useState<any>({isCalculated:false,showcalctable:false,issubmitform:true});
  const [tradingstatus, settradingstatus] = useState<any>();
  const [stopTrading,setstopTrading] = useState<boolean>(false);
  const webhookdatas = useWebSocketMessages();
  const webhookcontrol = webhookdatas.flat()

  const requestToken = useSelector((state: RootState) => state.auth.requestToken);
    const [SelectedOptions, setSelectedOptions] = useState<any>([])
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
      };
      
      const getselctedvalues = SelectedOptions?.map((item:any)=>item?.value.toString())
      const selectoptionvalue = Number(getselctedvalues); // Default token




  // Function to validate numeric input
  const validateNumericInput = (value: string) => {
    return /^\d*\.?\d*$/.test(value); // Allows numbers and a single decimal point
  };

  // Validation function
  const validateFields = () => {
    const newErrors: any = {};

    if (!formValues.basePrice || isNaN(Number(formValues.basePrice))) {
      newErrors.basePrice = "Base Price is required and must be a valid number.";
    }

    if (!call || isNaN(Number(call))) {
      newErrors.call = "Call value is required and must be a valid number.";
    }

    if (!put || isNaN(Number(put))) {
      newErrors.put = "Put value is required and must be a valid number.";
    }

    if (!formValues.amount || isNaN(Number(formValues.amount))) {
      newErrors.amount = "Amount is required and must be a valid number.";
    }

    if (!formValues.expiry) {
      newErrors.expiry = "Expiry date is required.";
    }

    if (!formValues.quantity || isNaN(Number(formValues.quantity))) {
      newErrors.quantity =
        "Quantity is required and must be a valid positive number.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // Calculation logic
  const handleCalculate = () => {

    if (!validateFields()) {
      return; // Stop calculation if validation fails
    }


    const calculatedResistance1 = Number(formValues.basePrice) + Number(call);
    const calculatedResistance2 = calculatedResistance1 + Number(put);
    const calculatedSupport1 = Number(formValues.basePrice) - Number(put);
    const calculatedSupport2 = calculatedSupport1 - Number(call);

    setFormValues((prevState) => ({
      ...prevState,
      resistance2: calculatedResistance2.toString(),
      resistance1: calculatedResistance1.toString(),
      support1: calculatedSupport1.toString(),
      support2: calculatedSupport2.toString(),
    }));

    sebuttondisabledObject((prev:any) =>({...prev,isCalculated:false,showcalctable:true,issubmitform:false}));
    
  };

  const payload = {
    basePrice: Number(formValues?.basePrice),
    resistance1: Number(formValues?.resistance1),
    resistance2: Number(formValues?.resistance2),
    support1: Number(formValues?.support1),
    support2: Number(formValues?.support2),
    token: Number(selectedDropdownValues?.map((item: any) => item?.value?.toString())),
    amount: Number(formValues?.amount),
    expiry: moment(formValues?.expiry).format('YYYY-MM-DD'),
    quantity: Number(formValues?.quantity)
  };

  const [disableTradingStatus, setdisableTradingStatus] = useState(true) 
  
  
  
    
   

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('This is a notification');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  // const handleShowToast = () => {
  //   setToastMessage('Your action was successful!');
  //   setToastSeverity('success');
  //   setToastOpen(true);
  // };

  const handleShowToast = (text:any,typestatus:'success' | 'error' | 'warning' | 'info',status:boolean) => {
    setToastMessage(text);
    setToastSeverity(typestatus);
    setToastOpen(true);
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  // API call on submt
  const handleSubmit = async () => {
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/variables/handleInvestmentVariables`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      settradingstatus(response.data)
      sebuttondisabledObject((prev:any) =>({...prev,isCalculated:false, showcalctable:false ,issubmitform:true}));
      setstopTrading(true);
      handleShowToast(response?.data?.message,
         response?.data?.status === false
        ? 'error'
        : response?.data?.status === true
        ? 'success'
        : 'error',true)

        const isOrderType = webhookcontrol.some((item: any) => item?.type === 'action');
        if (response?.data?.status == true) {
          // setOverlayLoading(true);
          dispatch(setoverLaypersist(true))
        } else {
          console.log('No matching type found.');
        }

    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  useEffect(()=>{
    setdisableTradingStatus(tradingstatus?.status === 
      false
        ? true
        : tradingstatus?.status === true
        ? false
        : true)
  },[disableTradingStatus])


  



  const handleStopTrading = async() =>{
    setstopTrading(false)
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/variables/stopTrading`,{token:Number(selectedDropdownValues?.map((item: any) => item?.value?.toString()))},
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      handleShowToast(response?.data?.message,'info',true)
      sebuttondisabledObject((prev:any) =>({...prev,isCalculated:false, showcalctable:false ,issubmitform:true }));
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  }



  const appKey = process.env.REACT_APP_FLATTRATE_APP_KEY;

    const dispatch = useDispatch<any>();
    const navigate = useNavigate();


    const colorScheme = UseColorScheme();

    const backgroundLayoutWave = colorScheme === 'dark'
    ? waveBackground_dark
    : colorScheme === 'light'
    ? waveBackground_light
    : waveBackground_default;
    
//     const [data, setData] = useState<any[]>([
//       {x: '0',y:  0}]);
//   const [chartData, setChartData] = useState<any[]>([
    
// ]);
  // const [subscriptmessage,setsubscriptmessage] = useState<any>()

    useEffect(() => {
        const getToken = async () => {
          try {
            const data = await fetchUserToken(`${process.env.REACT_APP_USER_TOKEN}`);
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
  //     ? connectFlattradeWebSocket(`${process.env.REACT_APP_USER_ID}`, requestToken, `${process.env.REACT_APP_USER_ID}`, `NSE|${getselctedvalues}`, handleLpValue)
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
  //         data: data?.map((point) => ({
  //           x: point?.x || '0',
  //           y: point?.y || 0
  //         }))
  //       }
  //     ]);
  //   }
  // }, [data]);


  const BasePriceLine = 180; // Just an example
  const Resistance2Line = 50;
  const Support2Line = 300;
  const Resistance1Line = 120;
  const Support1Line = 240;

  return (
    <Box>
      <OverlayBox textinfo={webhookdatas.map((data: any, index: number) =>data)}>
      <SnackbarProvider maxSnack={3}>
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


      {/* Base Price */}
      <TextField
        label="Base Price"
        value={formValues.basePrice}
        onChange={(e) => {
          const value = e.target.value;
          if (validateNumericInput(value)) {
            setFormValues((prevState) => ({
              ...prevState,
              basePrice: value,
            }));
            setErrors((prevState) => ({
              ...prevState,
              basePrice: "",
            }));
          } else {
            setErrors((prevState) => ({
              ...prevState,
              basePrice: "Base Price must be a valid number.",
            }));
          }
        }}
        error={!!errors.basePrice}
        helperText={errors.basePrice}
        sx={{
          m: 2,
          "& .MuiFormHelperText-root": {
            color: errors.basePrice ? "red" : "green", // Customize color based on error state
            fontWeight: "bold", // Optional: Add bold style
          },
          "& .MuiInputBase-root.Mui-error": {
            borderColor: "red", // Customize the error border color
          },
        }}
      />

      {/* Call */}
      <TextField
        label="Call"
        value={call}
        onChange={(e) => {
          const value = e.target.value;
          if (validateNumericInput(value)) {
            setCall(value);
            setErrors((prevState) => ({
              ...prevState,
              call: "",
            }));
          } else {
            setErrors((prevState) => ({
              ...prevState,
              call: "Call must be a valid number.",
            }));
          }
        }}
        error={!!errors.call}
        helperText={errors.call}
        sx={{ m: 2,
          "& .MuiFormHelperText-root": {
            color: errors.call ? "red" : "green", // Customize color based on error state
            fontWeight: "bold", // Optional: Add bold style
          },
          "& .MuiInputBase-root.Mui-error": {
            borderColor: "red", // Customize the error border color
          }, }}
      />

      {/* Put */}
      <TextField
        label="Put"
        value={put}
        onChange={(e) => {
          const value = e.target.value;
          if (validateNumericInput(value)) {
            setPut(value);
            setErrors((prevState) => ({
              ...prevState,
              put: "",
            }));
          } else {
            setErrors((prevState) => ({
              ...prevState,
              put: "Put must be a valid number.",
            }));
          }
        }}
        error={!!errors.put}
        helperText={errors.put}
        sx={{ m: 2,
          "& .MuiFormHelperText-root": {
            color: errors.put ? "red" : "green", // Customize color based on error state
            fontWeight: "bold", // Optional: Add bold style
          },
          "& .MuiInputBase-root.Mui-error": {
            borderColor: "red", // Customize the error border color
          }, }}
      />

      {/* Amount */}
      <TextField
        label="Amount"
        value={formValues.amount}
        onChange={(e) => {
          const value = e.target.value;
          if (validateNumericInput(value)) {
            setFormValues((prevState) => ({
              ...prevState,
              amount: value,
            }));
            setErrors((prevState) => ({
              ...prevState,
              amount: "",
            }));
          } else {
            setErrors((prevState) => ({
              ...prevState,
              amount: "Amount must be a valid number.",
            }));
          }
        }}
        error={!!errors.amount}
        helperText={errors.amount}
        sx={{ m: 2,
          "& .MuiFormHelperText-root": {
            color: errors.amount ? "red" : "green", // Customize color based on error state
            fontWeight: "bold", // Optional: Add bold style
          },
          "& .MuiInputBase-root.Mui-error": {
            borderColor: "red", // Customize the error border color
          }, }}
      />

      {/* Expiry Date */}
      <TextField
        label="Expiry"
        type="date"
        value={formValues.expiry}
        onChange={(e) =>
          setFormValues((prevState) => ({
            ...prevState,
            expiry: e.target.value,
          }))
        }
        error={!!errors.expiry}
        helperText={errors.expiry}
        sx={{ m: 2,
          "& .MuiFormHelperText-root": {
            color: errors.expiry ? "red" : "green", // Customize color based on error state
            fontWeight: "bold", // Optional: Add bold style
          },
          "& .MuiInputBase-root.Mui-error": {
            borderColor: "red", // Customize the error border color
          }, }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {/* Quantity */}
      <TextField
        label="Quantity"
        value={formValues.quantity}
        onChange={(e) => {
          const value = e.target.value;
          if (validateNumericInput(value)) {
            setFormValues((prevState) => ({
              ...prevState,
              quantity: value,
            }));
            setErrors((prevState) => ({
              ...prevState,
              quantity: "",
            }));
          } else {
            setErrors((prevState) => ({
              ...prevState,
              quantity: "Quantity must be a valid number.",
            }));
          }
        }}
        error={!!errors.quantity}
        helperText={errors.quantity}
        sx={{ m: 2,
          "& .MuiFormHelperText-root": {
            color: errors.quantity ? "red" : "green", // Customize color based on error state
            fontWeight: "bold", // Optional: Add bold style
          },
          "& .MuiInputBase-root.Mui-error": {
            borderColor: "red", // Customize the error border color
          }, }}
      />

      
      <Box sx={{ m: 2 }}>
        <Button
          variant="outlined"
          onClick={handleCalculate}
          disabled={buttondisabledObject?.isCalculated} // Disable after calculation
        >
          Calculate
        </Button>

        {buttondisabledObject?.showcalctable ? <Box sx={{padding:'10px'}}>
          <CalcTable dataTable = {payload}/>
        </Box> : null}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={buttondisabledObject?.issubmitform} // Enable only after calculate
          sx={{ ml: 2 }}
        >
          Submit
        </Button>

        {
          tradingstatus?.status == true && (<Button
            variant="contained"
            color="primary"
            // disabled={disableTradingStatus}
            onClick={handleStopTrading}
            sx={{ ml: 2 }}
          >
            Stop Trading
          </Button>
          )
        }
      </Box>
      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={handleCloseToast}
      />
    </Box>

        <Box>
    {/* {
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
        }   */}
        </Box>

    </div>
    </Box>
        
        </SnackbarProvider>
        </OverlayBox>
    </Box>
  );
};

export default AlgoTradersPages;


