import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Backdrop, Button } from "@mui/material";

interface OverlayBoxProps {
  loading: boolean;
  textinfo?: any;
  children: React.ReactNode;
  setOverlayLoading: (value: boolean) => void;
}

const OverlayBox: React.FC<OverlayBoxProps> = ({ loading, textinfo, children, setOverlayLoading }) => {
  const [currentMessage, setCurrentMessage] = useState("Loading...");

  useEffect(() => {
    if (loading) {
      setCurrentMessage("Loading...");
      const firstTimer = setTimeout(() => {
        setCurrentMessage("Application is running and monitoring the market for Algotrading...");
      }, 2000); // 2 seconds for the first message

      const secondTimer = setTimeout(() => {
        if (textinfo) {
          setCurrentMessage(textinfo?.map((item:any)=>item?.message ? item?.message :'Not Found Message !'));
        }
      }, 4000); // 4 seconds for the second message

      return () => {
        clearTimeout(firstTimer);
        clearTimeout(secondTimer);
      }; // Cleanup timers
    }
  }, [loading, textinfo]);

  return (
    <Box position="relative" width="100%" height="100%">
      {/* Content Box */}
      <Box
        sx={{
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        {children}
      </Box>

      {/* Overlay */}
      {loading && (
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
          open={loading}
        >
          <CircularProgress color="inherit" />
          <Typography variant="body1" sx={{ marginTop: 2, textAlign: "center" }}>
            {currentMessage}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOverlayLoading(false)}
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
