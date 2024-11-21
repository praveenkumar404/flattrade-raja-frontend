// UserProfile.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Chip, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setRequestToken } from '../../../redux/authSlice';
import { fetchUserToken } from '../../../api/authapi';

const Profilepage: React.FC = () => {

    const appKey = process.env.REACT_APP_FLATTRATE_APP_KEY;

    const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<any | null>(null);
  const requestToken = useSelector((state: RootState) => state.auth.requestToken); // Set your request token here


useEffect(() => {
    const getToken = async () => {
      try {
        const data = await l;
        dispatch(setRequestToken(data?.requestToken));
        console.log('log', data);
        if (data && !appKey) {
          console.error('App key is not defined');
        }
      } catch (error) {
        console.error('Error fetching request token', error);
      }
    };

    getToken();
  }, [dispatch, appKey]);


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('https://piconnect.flattrade.in/PiConnectTP/UserDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: `jData={"uid":"FT048819"}&jKey=${requestToken}`,
        });

        if (!response.ok) {
          throw new Error(`User Details error! status: ${response.status}`);
        }

        const userDetailsData = await response.json();
        setUserDetails(userDetailsData);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [requestToken]);

  if (!userDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5">User Profile</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Username:</Typography>
            <Typography>{userDetails.uname}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Email:</Typography>
            <Typography>{userDetails.email}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Mobile Number:</Typography>
            <Typography>{userDetails.m_num}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">User ID:</Typography>
            <Typography>{userDetails.uid}</Typography>
          </Grid>

          <Box sx={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',padding:'20px',columnGap:'30px'}}>
            <Box>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Access Type:</Typography>
            <Box>
              {userDetails.access_type.map((type:any) => (
                <Chip key={type} label={type} variant="outlined" />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Exchanges:</Typography>
            <Box>
              {userDetails.exarr.map((exch:any) => (
                <Chip key={exch} label={exch} variant="outlined" />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Products:</Typography>
            {userDetails.prarr.map((product:any) => (
              <Box key={product.prd} mb={1}>
                <Typography>
                  {product.prd} - {product.s_prdt_ali} (Exchanges: {product.exch.join(', ')})
                </Typography>
              </Box>
            ))}
          </Grid>
          </Box>

          <Box>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Order Types:</Typography>
            <Box>
              {userDetails.orarr.map((orderType:any) => (
                <Chip key={orderType} label={orderType} variant="outlined" />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Branch Name:</Typography>
            <Typography>{userDetails.brkname}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Status:</Typography>
            <Typography>{userDetails.stat}</Typography>
          </Grid>
          </Box>
          </Box>


        </Grid>
      </CardContent>
    </Card>
  );
};

export default Profilepage;

