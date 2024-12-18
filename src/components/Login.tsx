import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setRequestToken } from '../redux/authSlice';
import { RootState } from '../redux/store';
import { fetchUserToken } from '../api/authapi';

const Login: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const requestToken = useSelector((state: RootState) => state.auth.requestToken);
  const appKey = process.env.REACT_APP_FLATTRATE_APP_KEY;
  
  const handleLoginRedirect = async () => {
    
    const getToken = async () => {
        try {
          const data = await fetchUserToken();
          dispatch(setRequestToken(data?.requestToken));
          if (data && !appKey) {
            console.error('App key is not defined');
          }
          else{
            const redirectUrl = `https://auth.flattrade.in/?app_key=${appKey}`;
            window.location.href = redirectUrl;
          }
        } catch (error) {
          console.error('Error fetching request token', error);
        }
      };
      
      getToken()

    // try {
    //   const response = await axios.get('http://localhost:1337/api/authentications/', {
    //     headers: {
    //       Authorization: `Bearer 710f950d820c1bee1ea46a4f4fc1bd140776be2cad242c90700c37f8f42c1f63f1fda0af3f1cf37fd2d0656b29ae59d0c8e61ce4f25b5259363fb1bf8fac59b6f11bf01c490662fdd594084198e41e9654db5ec0d90edc1946f80c6dfaa416679284c0463193361eba932b98b2dea09ca46bb44dcb48eb957c828d1a86737e1d`,
    //     //   Authorization: `Bearer ${process.env.REACT_USER_TOKEN}`,
    //     },
    //   });

    //   const token = response.data?.data[0]?.requestToken;
    //   dispatch(setRequestToken(token)); // Store token in Redux
    //   console.log('log',token)

    //   if (token) {
    //     const redirectUrl = `https://auth.flattrade.in/?app_key=${appKey}`;
    //   window.location.href = redirectUrl; // Perform external redirect
    //     if (!appKey) {
    //       console.error('App key is not defined');
    //       return;
    //     }
    //   }
    // } catch (error) {
    //   console.error('Error fetching request token', error);
    // }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    if (message && message.includes('Login successful')) {
      navigate('/dashboard');
    }
  }, [navigate, requestToken]);

  return (
    <Box sx={{display:'flex',flexwrap:'wrap', justifyContent:'center', alignItems:'center', alignContent:'center',height:'700px'}}>
    <Box sx={{paddingX:'30px', borderRight:'1px solid lightgrey'}}><img src='https://flattrade.s3.ap-south-1.amazonaws.com/walllogo.svg' style={{height:'120px',width:'200px'}}/></Box>
    <Box sx={{display:'flex',flexDirection:'column',rowGap:'10px',paddingX:'30px'}}>
      <Box sx={{fontSize: '1rem !important',fontWeight: '400',lineHeight: '1.5rem',letterSpacing: '.03125em !important',fontFamily: 'Roboto, sans-serif !important'}}>Integrated dashboard application for your FLATTRADE Account</Box>
      <Button sx={{width:'fit-content'}} variant="contained" onClick={handleLoginRedirect}>
        Sign In
      </Button>
    </Box>
    </Box>
  );
};

export default Login;