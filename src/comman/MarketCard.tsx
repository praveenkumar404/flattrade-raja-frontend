import React from 'react';
import { Card, CardContent, Typography, Grid, styled } from '@mui/material';


// TypeScript interface to define the data structure
export interface DataObject {
  t: string;
  e: string;
  tk: string;
  c?: string;
  h?: string;
  l?: string;
  lp: string;
  pc: string;
  ts?: string;
}

interface Props {
  data: DataObject;
}

const stylecartmodify = {
    cartheading:{
        fontSize:'14px',
    },
    cartlabel:{
        fontSize:'12px',
    },
    cartlabelval:{
        fontSize:'10px',
    }
}

export const MarketCard: React.FC<Props> = ({ data }) => {
  // Function to decide which card to show based on the type field
  const renderCardContent = () => {
    switch (data.t) {
      case 'tk': // Subscription acknowledged
        return (
          <>
            <Typography variant="h6" sx={stylecartmodify?.cartheading} color="textPrimary" gutterBottom>
              Subscription acknowledged
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Market:</Typography>
                <Typography sx={stylecartmodify?.cartlabelval}>{data.ts}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Token:</Typography>
                <Typography sx={stylecartmodify?.cartlabelval}>{data.tk}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Last Price:</Typography>
                <Typography sx={stylecartmodify?.cartlabelval}>{data.lp}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Price Change:</Typography>
                <Typography sx={stylecartmodify?.cartlabelval}>{data.pc}</Typography>
              </Grid>
              {data.c && (
                <Grid item xs={6}>
                  <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Close Price:</Typography>
                  <Typography sx={stylecartmodify?.cartlabelval}>{data.c}</Typography>
                </Grid>
              )}
              {data.h && (
                <Grid item xs={6}>
                  <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>High Price:</Typography>
                  <Typography sx={stylecartmodify?.cartlabelval}>{data.h}</Typography>
                </Grid>
              )}
              {data.l && (
                <Grid item xs={6}>
                  <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Low Price:</Typography>
                  <Typography sx={stylecartmodify?.cartlabelval}>{data.l}</Typography>
                </Grid>
              )}
            </Grid>
          </>
        );
      case 'tf': // Received message
        return (
          <>
            <Typography variant="h6" sx={stylecartmodify?.cartheading} color="textPrimary" gutterBottom>
              Received message
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Exchange:</Typography>
                <Typography sx={stylecartmodify?.cartlabelval}>{data.e}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Last Price:</Typography>
                <Typography sx={stylecartmodify?.cartlabelval}>{data.lp}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Price Change:</Typography>
                <Typography sx={stylecartmodify?.cartlabelval}>{data.pc}</Typography>
              </Grid>
            </Grid>
          </>
        );
      case 'tf': // Touchline feed (assuming 'tf' represents both received and touchline feed)
        return (
          <>
            <Typography variant="h6" sx={stylecartmodify?.cartheading} color="textPrimary" gutterBottom>
              Touchline feed
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Exchange:</Typography>
                <Typography sx={stylecartmodify?.cartlabelval}>{data.e}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Last Price:</Typography>
                <Typography sx={stylecartmodify?.cartlabelval}>{data.lp}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Price Change:</Typography>
                <Typography sx={stylecartmodify?.cartlabelval}>{data.pc}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" sx={stylecartmodify?.cartlabel}>Token:</Typography>
                <Typography sx={stylecartmodify?.cartlabelval}>{data.tk}</Typography>
              </Grid>
            </Grid>
          </>
        );
      default:
        return <Typography variant="h6" sx={stylecartmodify?.cartheading}>Unknown Data Type</Typography>;
    }
  };

  return (
    <Card style={{ margin: '20px', maxWidth: 400, fontSize:'12px' }}>
      <CardContent>{renderCardContent()}</CardContent>
    </Card>
  );
};

