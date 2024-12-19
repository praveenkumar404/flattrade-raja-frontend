import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Backdrop, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectedRemoveIdDropdownspreatobject, setoverLaypersist } from "../../redux/authSlice";
import axios from "axios";
import { useWebSocketMessages } from "../../Webhooktypeprocess";

interface OverlayBoxProps {
  // loading: boolean;
  selectedbasedapply?:any
  children: React.ReactNode;
  // setOverlayLoading: (value: boolean) => void;
}

const OverlayBox: React.FC<OverlayBoxProps> = ({ children }) => {
  const [currentMessage, setCurrentMessage] = useState("Loading...");
  const dispatch = useDispatch<any>();
  const {overLaypersist} = useSelector((state: RootState) => state.auth);
  const {selectedDropdownspreatobject} = useSelector((state: RootState) => state?.auth);
  const {selectedDropdownValues} = useSelector((state: RootState) => state.auth);

  const webhookdatas = useWebSocketMessages();
  const webhookcontrol = webhookdatas.flat()
  console.log("Fetch webhookdatas",webhookdatas)
  const isType = webhookcontrol.find(
    (item: any) => item?.type === 'variable' || item?.type === 'order'
  )?.type;

  const isTypeMessage = webhookcontrol.find(
    (item: any) => item?.type === 'variable' || item?.type === 'order'
  )?.message;

  const isTypewithMessagewithstatus = webhookcontrol.find(
    (item: any) => item?.type === 'variable' || item?.type === 'order'
  );
  console.log("valsing : ", isTypeMessage)

//   {
//     "type": "variable",
//     "message": "Flattrade WebSocket connection closed. Attempting reconnect...",
//     "status": false
// }

  useEffect(() => {
    if (overLaypersist) {
      setCurrentMessage("Loading...");
      const firstTimer = setTimeout(() => {
        setCurrentMessage("Application is running and monitoring the market for Algotrading...");
      }, 2000);
        
      setCurrentMessage(isTypeMessage ? isTypeMessage :'Not Found Message !');

      return () => {
        clearTimeout(firstTimer);
      };
    }     
  }, [overLaypersist, webhookdatas]);

  const stoptradingprocess  = async () =>{
    // dispatch(setoverLaypersist())
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/variables/stopTrading`,{indexToken:Number(selectedDropdownValues?.map((item: any) => item?.value?.toString()))},
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        dispatch(selectedRemoveIdDropdownspreatobject(selectedDropdownValues?.[0]))

        setTimeout(()=>{
          window?.location?.reload()
        },5000)
      } catch (error) {
        console.error('Error submitting data:', error);
      }
  }

  
  return (
    <Box position="relative" width="100%" height="100%">
      {overLaypersist && overLaypersist?.filter((itemfilter: any) =>selectedDropdownspreatobject?.some((item: any) => item?.id === itemfilter?.id))?.map((item: any,index: number)=>{
        const overlaystyle = {
          opacity: item?.persist ? 0.5 : 1,
          pointerEvents: item?.persist ? "none" : "auto",
        }
        return(
        <>
        {index == 0 ?
      <Box
        sx={overlaystyle}
      >
        {children}
      </Box>:null}
      
      
        <Backdrop
        sx={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            color: "#000",
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(1px)", // Add blur effect to the backdrop
          }}
          open={item?.persist}
        >
          <Box sx={{height:'10rem'}}>
          {currentMessage =='Not Found Message !' ? <Box>
            <Typography variant="h5" sx={{ marginTop: 2, textAlign: "center" , color:'dodgerblue'}}>
              Processing
            </Typography>

            <img src={require(`../../assets/images/Loading_app.gif`)} style={{height:'200px',width:'200px'}}/>
          </Box>:<>
          <Typography variant="h5" sx={{ marginTop: 2, textAlign: "center" , color:'dodgerblue'}}>
            {isType == 'variable' ? `Status`:isType == 'order' ? 'Order Update': null}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2, textAlign: "center", color:`${(isTypewithMessagewithstatus?.type=='order' && isTypewithMessagewithstatus?.status == true) ? 'green':'dodgerblue'}` }}>
            {currentMessage}
          </Typography>
          </>}
          </Box>

          <Button
            variant="contained"
            onClick={stoptradingprocess}
            sx={{ marginTop: 2 }}
          >
            Stop Trading {selectedDropdownValues?.[0]?.label}
          </Button>
          
        </Backdrop>
        </>
        )})}
    </Box>
  );
};

export default OverlayBox;
