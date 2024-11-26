import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Backdrop, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setoverLaypersist } from "../../redux/authSlice";
import axios from "axios";

interface OverlayBoxProps {
  // loading: boolean;
  textinfo?: any;
  children: React.ReactNode;
  // setOverlayLoading: (value: boolean) => void;
}

const OverlayBox: React.FC<OverlayBoxProps> = ({ textinfo, children }) => {
  const [currentMessage, setCurrentMessage] = useState("Loading...");
  const dispatch = useDispatch<any>();
  const {overLaypersist} = useSelector((state: RootState) => state.auth);
  const {selectedDropdownValues} = useSelector((state: RootState) => state.auth);
  console.log("Fetch textinfo",textinfo)
  useEffect(() => {
    if (overLaypersist) {
      setCurrentMessage("Loading...");
      const firstTimer = setTimeout(() => {
        setCurrentMessage("Application is running and monitoring the market for Algotrading...");
      }, 2000); // 2 seconds for the first message

      const secondTimer = setTimeout(() => {
        if (textinfo) {
          setCurrentMessage(textinfo?.map((item:any)=>item?.message ? item?.message :'Not Found Message !'));
        }
      },40000); // 4 seconds for the second message

      return () => {
        clearTimeout(firstTimer);
        clearTimeout(secondTimer);
      }; // Cleanup timers
    }
  }, [overLaypersist, textinfo]);

  const stoptradingprocess  = async () =>{
    dispatch(setoverLaypersist(false))
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
      } catch (error) {
        console.error('Error submitting data:', error);
      }
  }

  return (
    <Box position="relative" width="100%" height="100%">
      {/* Content Box */}
      <Box
        sx={{
          opacity: overLaypersist ? 0.5 : 1,
          pointerEvents: overLaypersist ? "none" : "auto",
        }}
      >
        {children}
      </Box>

      {/* Overlay */}
      {overLaypersist && (
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
          open={overLaypersist}
        >
          {/* <CircularProgress color="inherit" /> */}
          <Typography variant="body1" sx={{ marginTop: 2, textAlign: "center" }}>
            {currentMessage}
          </Typography>
          <Button
            variant="contained"
            onClick={stoptradingprocess}
            sx={{ marginTop: 2 }}
          >
            Stop Loading
          </Button>
        </Backdrop>
      )}
    </Box>
  );
};

export default OverlayBox;
