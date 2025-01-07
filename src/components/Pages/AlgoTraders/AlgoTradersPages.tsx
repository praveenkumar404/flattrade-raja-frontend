import React, { useEffect, useState } from 'react'
import { TextField, Button, Box, dialogActionsClasses, SnackbarOrigin, Snackbar, Table, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
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
import { addObjectByIdToSelectedDropdownspreat, selectedRemoveIdDropdownspreatobject, setoverLaypersist, setRequestToken } from '../../../redux/authSlice';
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
import TradingViewChart from '../../../comman/ReusabelCompoents/TradingViewChart';
import { resetFormValues, setFormValues } from '../../../redux/FormSlice';
import { fetchPosition, fetchpostplaceholder } from '../../../api/Service/CommanServiceapi';

const formlabelstyle = {width:"5rem",fontWeight:'bold',fontSize:'14px',color:'gray'}

const AlgoTradersPages: React.FC = () => {

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const selectedDropdownValues = useSelector((state: RootState) => state.auth.selectedDropdownValues);
  const {overLaypersist} = useSelector((state: RootState) => state.auth);

  const formValues = useSelector((state: RootState) => state.formValues.formValues);

  const [errors, setErrors] = useState({
    basePrice: "",
    call: "",
    put: "",
    amount: "",
    expiry: "",
    quantity: "",
  });


  const [buttondisabledObject, sebuttondisabledObject] = useState<any>({isCalculated:false,showcalctable:false,issubmitform:true});
  const [tradingstatus, settradingstatus] = useState<any>();
  const [stopTrading,setstopTrading] = useState<boolean>(false);
  const webhookdatas = useWebSocketMessages();
  const webhookcontrol = webhookdatas.flat()
  const isTypeindexload = webhookcontrol.find(
    (item: any) => item?.type === 'variable' || item?.type === 'order'
  )?.type;

  const requestToken = useSelector((state: RootState) => state?.auth?.requestToken);
  const selectedOptionSPreaddata = useSelector((state: RootState) => state?.auth?.selectedDropdownspreatobject);
  // console.log("seletinghjk : ", selectedOptionSPreaddata)
    const [SelectedOptionsList, setSelectedOptionsList] = useState<any>([])
    const options = [
        { id: 1, label: 'Nifty', value: 26000 },
        { id: 2, label: 'Banknifty', value: 26009 },
        { id: 3, label: 'Niftynxt50', value: 26013 },
        { id: 4, label: 'Finnifty', value: 26037 },
      ];

      const handleSelect = (selectedOptions: { id: number; label: string; value: string }[]) => {
        setSelectedOptionsList(selectedOptions)
      };
      
      const datadeclare = () =>{
        return options
      }

      // console.log("Selected option:", SelectedOptionsList);

      const [formfillchecked, setformfillchecked] = React.useState('notfilledlist');

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setformfillchecked(event.target.value);
      };

  

      
  
  const handleSendClick = async () => {
    navigate('/seller')
  };

  const [btnchoice,setbtnchoice] = useState({
    sendbtn: {
      showbtn: false,
      btnlabelname: 'Sell',
      btnonClick: handleSendClick,
    }
  });

  


  

  


  const [disableTradingStatus, setdisableTradingStatus] = useState(true) 
  
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('This is a notification');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');


  useEffect(()=>{
    setdisableTradingStatus(tradingstatus?.status === 
      false
        ? true
        : tradingstatus?.status === true
        ? false
        : true)
  },[disableTradingStatus])


  const appKey = process.env.REACT_APP_FLATTRATE_APP_KEY;


    const colorScheme = UseColorScheme();

    const backgroundLayoutWave = colorScheme === 'dark'
    ? waveBackground_dark
    : colorScheme === 'light'
    ? waveBackground_light
    : waveBackground_default;
 
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

  
      // const handleShowToast = (text:any,typestatus:'success' | 'error' | 'warning' | 'info',status:boolean) => {
      //   setToastMessage(text);
      //   setToastSeverity(typestatus);
      //   setToastOpen(true);
      // };

      const handleCloseToast = () => {
        setToastOpen(false);
      };

  

  return (
    <Box>
      <Box className="backgrounddash" sx={{backgroundImage:`url(${backgroundLayoutWave})`,background:`url(${backgroundLayoutWave}) center center / cover no-repeat fixed`}}>
         <div className="backgrounddashoverlay">
        
        <Box>
          <Box>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group" sx={{paddingTop:'10px'}}>Algodrading Form</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={formfillchecked}
              onChange={handleChange}
            >
              <FormControlLabel value="notfilledlist" control={<Radio />} label="New Form" />
              <FormControlLabel value="filledlist" control={<Radio />} label="Already Applied" />
            </RadioGroup>
          </FormControl>
          </Box>
          
        
        </Box>

        {formfillchecked == 'filledlist' ? <Box>
          <Box>
          <Box>
        <MultipleSelectWithSearch
        options={selectedOptionSPreaddata}
        placeholder="Select Flattrate"
        isMultiSelect={false}
        onSelect={handleSelect}
      />
        </Box>
        {selectedOptionSPreaddata?.filter((itemfilter:any)=>itemfilter?.id == selectedDropdownValues?.map((item: any) => item?.id))?.map((selecteditem:any)=>{
          return(<>
            <Box>
              <ApplyAlgoradingApp selectedbasedapply={selecteditem} buttondisabledObject={buttondisabledObject} sebuttondisabledObject={sebuttondisabledObject} tradingstatus={tradingstatus} settradingstatus={settradingstatus} stopTrading={stopTrading} setstopTrading={setstopTrading} toastOpen={toastOpen} setToastOpen={setToastOpen} toastMessage={toastMessage} setToastMessage={setToastMessage} toastSeverity={toastSeverity} setToastSeverity={setToastSeverity}/>
            </Box>
          </>)
        }) }
        </Box>
        </Box> : <Box>
        <Box>
        <MultipleSelectWithSearch
        options={options}
        placeholder="Select Flattrate"
        isMultiSelect={false}
        onSelect={handleSelect}
      />
        </Box>
        {selectedOptionSPreaddata?.filter((itemfilter: any) =>
          selectedDropdownValues?.some((item: any) => item?.id !== itemfilter?.id)
        ) ? <Box>
        <ApplyAlgoradingApp buttondisabledObject={buttondisabledObject} sebuttondisabledObject={sebuttondisabledObject} tradingstatus={tradingstatus} settradingstatus={settradingstatus} stopTrading={stopTrading} setstopTrading={setstopTrading} toastOpen={toastOpen} setToastOpen={setToastOpen} toastMessage={toastMessage} setToastMessage={setToastMessage} toastSeverity={toastSeverity} setToastSeverity={setToastSeverity}/>
       </Box>:null}</Box>}

        {/* {selectedOptionSPreaddata?.filter((itemfilter:any)=>itemfilter?.id == selectedDropdownValues?.map((item: any) => item?.id))?.map((selecteditem:any)=>{
          return(<>
            <Box>
              <ApplyAlgoradingApp/>
            </Box>
          </>)
        })} */}
      
        </div>

        <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={handleCloseToast}
        btnchoice={btnchoice}
      />
    </Box>
    </Box>
  );
};



const ApplyAlgoradingApp = ({selectedbasedapply, buttondisabledObject, sebuttondisabledObject, tradingstatus, settradingstatus, stopTrading, setstopTrading, toastOpen, setToastOpen, toastMessage, setToastMessage, toastSeverity, setToastSeverity}:
  {selectedbasedapply?:any, buttondisabledObject:any, sebuttondisabledObject:any, tradingstatus:any, settradingstatus:any, stopTrading :any, setstopTrading:any, toastOpen:any, setToastOpen:any, toastMessage:any, setToastMessage:any, toastSeverity:any, setToastSeverity:any}) =>{
    
  const options = [
    { id: 1, label: 'Nifty', value: 26000 },
    { id: 2, label: 'Banknifty', value: 26009 },
    { id: 3, label: 'Niftynxt50', value: 26013 },
    { id: 4, label: 'Finnifty', value: 26037 },
  ];

  const selectedDropdownValues = useSelector((state: RootState) => state.auth.selectedDropdownValues);
  
  const selectedOptionSPreaddata = useSelector((state: RootState) => state?.auth?.selectedDropdownspreatobject);
  const DynamicComponent = (selectedbasedapply !== undefined || options?.some((item:any)=>item?.id == selectedbasedapply?.id )) ? OverlayBox : Box;
  const findallowapplyindex = selectedOptionSPreaddata?.some((itemfilter: any) =>itemfilter?.id == selectedDropdownValues?.[0]?.id)
  const formValues = useSelector((state: RootState) => state.formValues.formValues);
  const dispatch = useDispatch<any>();
const navigate = useNavigate();

const {overLaypersist} = useSelector((state: RootState) => state.auth);

const [errors, setErrors] = useState({
  basePrice: "",
  call: "",
  put: "",
  amount: "",
  expiry: "",
  quantity: "",
});


const webhookdatas = useWebSocketMessages();
const webhookcontrol = webhookdatas.flat()
const isTypeindexload = webhookcontrol.find(
  (item: any) => item?.type === 'variable' || item?.type === 'order'
)?.type;

const [SelectedOptionsList, setSelectedOptionsList] = useState<any>([])


// Validation function
const validateFields = () => {
  const newErrors: any = {};

  if (!formValues.basePrice || isNaN(Number(formValues.basePrice))) {
    newErrors.basePrice = "Base Price is required and must be a valid number.";
  }

  if (!formValues.call || isNaN(Number(formValues.call))) {
    newErrors.call = "Call value is required and must be a valid number.";
  }

  if (!formValues.put || isNaN(Number(formValues.put))) {
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

// Function to validate numeric input
const validateNumericInput = (value: string) => {
  return /^\d*\.?\d*$/.test(value); // Allows numbers and a single decimal point
};


const handleSendClick = async () => {
  navigate('/seller')
};

const handleShowToast = (text:any,typestatus:'success' | 'error' | 'warning' | 'info',status:boolean) => {
  setToastMessage(text);
  setToastSeverity(typestatus);
  setToastOpen(true);
};


const [btnchoice,setbtnchoice] = useState({
  sendbtn: {
    showbtn: false,
    btnlabelname: 'Sell',
    btnonClick: handleSendClick,
  }
});

  const handlePosition = async () => {
    if (!validateFields()) {
      return; // Stop calculation if validation fails
    }

    try {
      const data = await fetchPosition();
  
      // console.log("Fetched position data: ", data?.data);

  
      // Compare indexToken from payload with the fetched data
      const payloadIndexToken = payload?.indexToken
  
      const matchedObject = data?.data?.find((item: any) => item?.indexToken === payloadIndexToken);
  
      if (!matchedObject) {
        console.log("No matching indexToken found in the data.");
        handleShowToast('No matching indexToken found in the data.','error',true)
        return;
      }
  
      // Check if any of the specified fields are null
      
      const { id, documentId, index, indexToken, contractType, contractToken, tsym, lotSize, createdAt, updatedAt, publishedAt } = matchedObject;
      // handleCalculate(matchedObject)

      if (!contractType || !contractToken || !tsym || !lotSize) {
        handleShowToast('Please Click the next sumbit your Form !','success',true)
        setbtnchoice({sendbtn: {
          showbtn: false,
          btnlabelname: 'Sell',
          btnonClick: handleSendClick,
        }})
        handleCalculate()
        sebuttondisabledObject((prev:any) =>({...prev,isCalculated:false,showcalctable:true,issubmitform:false}));
      } else {
        // console.log("Matched object:", matchedObject);
        handleShowToast(`Open position available now. Please sell before proceeding...`,'error',true)
        setbtnchoice({sendbtn: {
          showbtn:true,
          btnlabelname: 'Sell',
          btnonClick: handleSendClick,
        }})
        sebuttondisabledObject((prev:any) =>({...prev,isCalculated:false,showcalctable:false,issubmitform:true}));
      }
    } catch (error) {
      console.error("Error fetching position data:", error);
    }
  };
  

  // Calculation logic
  const handleCalculate = () => {
     const calculatedResistance1 = Number(formValues.basePrice) + Number(formValues.call);
    const calculatedResistance2 = calculatedResistance1 + Number(formValues.put);
    const calculatedSupport1 = Number(formValues.basePrice) - Number(formValues.put);
    const calculatedSupport2 = calculatedSupport1 - Number(formValues.call);

    dispatch(
      setFormValues({
        resistance2: calculatedResistance2.toString(),
        resistance1: calculatedResistance1.toString(),
        support1: calculatedSupport1.toString(),
        support2: calculatedSupport2.toString(),
      })
    );
    
  };

  const payload = {
    basePrice: Number(formValues?.basePrice),
    resistance1: Number(formValues?.resistance1),
    resistance2: Number(formValues?.resistance2),
    support1: Number(formValues?.support1),
    support2: Number(formValues?.support2),
    indexToken: selectedDropdownValues?.map((item: any) => item?.value?.toString()).join(''),
    amount: Number(formValues?.amount),
    expiry: moment(formValues?.expiry).format('YYYY-MM-DD'),
    quantity: Number(formValues?.quantity)
  };

  // API call on submt
  // console.log("itemss : ", findallowapplyindex)
  const handleSubmit = async () => {
    // dispatch(setoverLaypersist(true))
    
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
        // if (response?.data?.status == true) {
        //   // setOverlayLoading(true);
        //   dispatch(setoverLaypersist(true))
        // } else {
        //   console.log('No matching type found.');
        // }

        if(findallowapplyindex){
          setTimeout(()=>{
            handleShowToast(`Already ${selectedDropdownValues?.[0]?.label} is declared this. Choose any another Index...`,'error',true)
          },5000)
        }
        else{
          if(response?.data?.status){
          dispatch(addObjectByIdToSelectedDropdownspreat(selectedDropdownValues?.[0]));
          dispatch(setoverLaypersist())
          }
        }

    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  const handleStopTrading = async() =>{
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/variables/stopTrading`,{indexToken:Number(selectedDropdownValues?.map((item: any) => item?.value?.toString())).toString()},
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      handleShowToast(response?.data?.message,'info',true)
      sebuttondisabledObject((prev:any) =>({...prev,isCalculated:false, showcalctable:false ,issubmitform:true }));
      dispatch(selectedRemoveIdDropdownspreatobject(selectedDropdownValues?.[0]))
      setstopTrading(false)
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  }
  const ResetFormstate = () =>{
    dispatch(resetFormValues())
    sebuttondisabledObject((prev:any) =>({...prev,isCalculated:false,showcalctable:false,issubmitform:false}));
  }

  // console.log("overLaypersist : ",selectedOptionSPreaddata)

  return(
    <DynamicComponent>
    <SnackbarProvider maxSnack={3}>
    {(selectedbasedapply) ?<Box>{JSON?.stringify(selectedbasedapply)}</Box>:null}
  <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { m: '10px', width: '600px' },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent:'center'
    }}
    noValidate
    autoComplete="off"
  >

    {/* Base Price */}
    <Box sx={{display:'flex',flexWrap:'wrap', columnGap:'15px',justifyContent:'center',alignItems:'center'}}>
      <Box sx={formlabelstyle}>Base Price</Box>
    <TextField
      // label="Base Price"
      value={formValues.basePrice}
      size='small'
      onChange={(e) => {
        const value = e.target.value;
        if (validateNumericInput(value)) {
          dispatch(
            setFormValues({
              basePrice: value, // Update only the changed field
            })
          )
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
    </Box>

    {/* Call */}
    <Box sx={{display:'flex',flexWrap:'wrap', columnGap:'15px',justifyContent:'center',alignItems:'center'}}>
      <Box sx={formlabelstyle}>Call</Box>
    <TextField
      // label="Call"
      value={formValues.call}
      size='small'
      onChange={(e) => {
        const value = e.target.value;
        if (validateNumericInput(value)) {
          dispatch(
            setFormValues({
              call: value, // Update only the changed field
            })
          )
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
    </Box>

    {/* Put */}
    <Box sx={{display:'flex',flexWrap:'wrap', columnGap:'15px',justifyContent:'center',alignItems:'center'}}>
      <Box sx={formlabelstyle}>Put</Box>
    <TextField
      // label="Put"
      value={formValues.put}
      size='small'
      onChange={(e) => {
        const value = e.target.value;
        if (validateNumericInput(value)) {
          dispatch(
            setFormValues({
              put: value, // Update only the changed field
            })
          )
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
    </Box>

    {/* Amount */}
    <Box sx={{display:'flex',flexWrap:'wrap', columnGap:'15px',justifyContent:'center',alignItems:'center'}}>
      <Box sx={formlabelstyle}>Amount</Box>
    <TextField
      // label="Amount"
      value={formValues.amount}
      size='small'
      onChange={(e) => {
        const value = e.target.value;
        if (validateNumericInput(value)) {
          dispatch(
            setFormValues({
              amount: value, // Update only the changed field
            })
          )
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
    </Box>

    {/* Expiry Date */}
    <Box sx={{display:'flex',flexWrap:'wrap', columnGap:'15px',justifyContent:'center',alignItems:'center'}}>
      <Box sx={formlabelstyle}>Expiry</Box>
    <TextField
      // label="Expiry"
      type="date"
      value={formValues.expiry}
      size='small'
      onChange={(e) =>
        dispatch(
          setFormValues({
            expiry: e.target.value, // Update only the changed field
          })
        )
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
    </Box>

    {/* Quantity */}
    <Box sx={{display:'flex',flexWrap:'wrap', columnGap:'15px',justifyContent:'center',alignItems:'center'}}>
      <Box sx={formlabelstyle}>Quantity</Box>
    <TextField
      // label="Quantity"
      value={formValues.quantity}
      size='small'
      onChange={(e) => {
        const value = e.target.value;
        if (validateNumericInput(value)) {
          dispatch(
            setFormValues({
              quantity: value, // Update only the changed field
            })
          )
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
    </Box>

    
    <Box sx={{ m: 2 }}>
      <Box sx={{display:'flex',flexWrap:'wrap', columnGap:3}}>
      <Button
        variant="outlined"
        onClick={handlePosition}
        disabled={buttondisabledObject?.isCalculated} // Disable after calculation
      >
        Calculate
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={buttondisabledObject?.issubmitform} // Enable only after calculate
        sx={{ ml: 2 }}
      >
        Submit
      </Button>

      {/* {
        tradingstatus?.status == true && ( */}
        <Button
          variant="contained"
          color="primary"
          // disabled={disableTradingStatus}
          onClick={handleStopTrading}
          sx={{ ml: 2 }}
        >
          Stop Trading
        </Button>
        {/* )
      } */}

    <Button variant="outlined" color="error" onClick={ResetFormstate}>Reset</Button>
    </Box>
    {buttondisabledObject?.showcalctable ? <Box sx={{padding:'10px'}}>
        <CalcTable dataTable = {payload}/>
      </Box> : null}
    </Box>
  </Box>     
      </SnackbarProvider>
      </DynamicComponent>
  )
}



export default AlgoTradersPages;


