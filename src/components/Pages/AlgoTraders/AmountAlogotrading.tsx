import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { amountpostTradeData } from "../../../api/Service/CommanServiceapi";
import MultipleSelectWithSearch from "../../../comman/MultipleSelectPlaceholder";
import ToastNotification from "../../../comman/ReusabelCompoents/ToastNotification";

interface TradeFormData {
  entry: number;
  target: number;
  stopLoss: number;
  expiry: string;
}

const AmountAlogotrading: React.FC = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TradeFormData>();

  const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('This is a notification');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

    const handleShowToast = (text:any,typestatus:'success' | 'error' | 'warning' | 'info',status:boolean) => {
        setToastMessage(text);
        setToastSeverity(typestatus);
        setToastOpen(true);
      };

    //   const handleSendClick = async () => {
    //     navigate('/seller')
    //   };
    //  const [btnchoice,setbtnchoice] = useState({
    //     sendbtn: {
    //       showbtn: false,
    //       btnlabelname: 'Sell',
    //     //   btnonClick: handleSendClick,
    //     }
    //   });

      const handleCloseToast = () => {
        setToastOpen(false);
      };
  
  const options = [
    { id: 1, label: 'Nifty', value: 26000 },
    { id: 2, label: 'Banknifty', value: 26009 },
    { id: 3, label: 'Niftynxt50', value: 26013 },
    { id: 4, label: 'Finnifty', value: 26037 },
  ];

    const [SelectedOptionsList, setSelectedOptionsList] = useState<any>([])
    
  const handleSelect = (selectedOptions: { id: number; label: string; value: string }[]) => {
    setSelectedOptionsList(selectedOptions)
  };

  const onSubmit = async (data: TradeFormData) => {
    console.log("sumision amount index : ",SelectedOptionsList)
    if (SelectedOptionsList.length === 0) {
        // alert("Please select an index before submitting.");
        handleShowToast('Please select an index before submitting.','error',true)
        return;
      }
    
      const payload = {
        ...data,
        indexToken: SelectedOptionsList[0]?.value.toString(),
      };

    try {
      const response = await amountpostTradeData(payload);
      console.log("Response:", response);
    //   alert("Trade request submitted successfully!");
    handleShowToast('Trade request submitted successfully!','success',true)
      reset();
    } catch (error) {
    //   alert("Failed to submit trade request.");
    handleShowToast('No matching indexToken found in the data.','error',true)
    }
  };



  return (
    <Box 
      sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <Typography variant="h5" sx={{ mb: 2, textAlign: "center", fontFamily:'cursive', fontWeight:'bold', color:'green' }}>
        Post Amount Trading
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>

        <Box sx={{display:'flex', justifyContent:'center'}}>
            <MultipleSelectWithSearch
                options={options}
                placeholder="Select Index"
                isMultiSelect={false}
                onSelect={handleSelect}
                reloadonchange={false}
              />
              </Box>

        <Controller
          name="entry"
          control={control}
          defaultValue={216}
          rules={{ required: "Entry is required", min: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Entry"
              type="number"
              fullWidth
              error={!!errors.entry}
              helperText={errors.entry?.message}
              margin="normal"
            />
          )}
        />

        <Controller
          name="target"
          control={control}
          defaultValue={275}
          rules={{ required: "Target is required", min: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Target"
              type="number"
              fullWidth
              error={!!errors.target}
              helperText={errors.target?.message}
              margin="normal"
            />
          )}
        />

        {/* <Controller
          name="expiry"
          control={control}
          
          rules={{ required: "expiry is required", min: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Expiry Date"
              type="date"
              fullWidth
              error={!!errors.expiry}
              helperText={errors.expiry?.message}
              margin="normal"
            />
          )}
        /> */}

        <Controller
        name="expiry"
        control={control}
        defaultValue={new Date().toISOString().split("T")[0]} // Set default to today
        rules={{
            required: "Expiry is required",
            validate: (value) =>
            new Date(value) >= new Date() || "Expiry date must be in the future",
        }}
        render={({ field }) => (
            <TextField
            {...field}
            label="Expiry Date"
            type="date"
            fullWidth
            error={!!errors.expiry}
            helperText={errors.expiry?.message}
            margin="normal"
            InputLabelProps={{ shrink: true }} // Ensures label doesn't overlap
            />
        )}
        />


        <Controller
          name="stopLoss"
          control={control}
          defaultValue={205}
          rules={{ required: "Stop Loss is required", min: 1 }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Stop Loss"
              type="number"
              fullWidth
              error={!!errors.stopLoss}
              helperText={errors.stopLoss?.message}
              margin="normal"
            />
          )}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Start
        </Button>
      </form>

      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={handleCloseToast}
        // btnchoice={btnchoice}
      />
    </Box>
  );
};

export default AmountAlogotrading;
