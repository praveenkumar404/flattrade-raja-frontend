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
          const data = await fetchUserToken('7b6abf23ba7e400fe9f46c86572038d8f8ddf47d962a39fc6458d3ed6e16549f4b3842f3115c4267caaca77388a298b74d494bd61fbe24b35194f7c69c3e7b72063efec09f305974c7e1cf219151436743d0af7d3b61913afb8a7517caf09fd0aa9af12f29558a600ab890eaacf9923c91874acfb8f0b45fae71fb08af55dc14');
          dispatch(setRequestToken(data?.requestToken));
          console.log('log', data);
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













// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button, CircularProgress, Alert, Box } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { setRequestToken } from '../redux/authSlice';

// const Login: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const navigate = useNavigate();

//   const handleLoginRedirect = async () => {

//     try {
//         const response = await axios.get('http://localhost:1337/api/authentications/', {
//           headers: {
//             'Authorization': `Bearer 647dc15d56e4a5bcea8526841aa5bb505299e3235270e8d43650c293504473728899e74eaa814cf42439eb5b1f9d4e29b22322c741c42441fa37bcebf44f3e85a2b7b34f310e4b7476b9005cc044862a5388571e1cc7e93426c1e7bf43308dfbe93fab05fe8beb7fa3bf04a6c2141fb78b219a3906a656d3a64a1425b809b36c`, // Token from .env file
//           },
//         });
//         const token = response.data?.data[0]?.requestToken;
  
//         if (token) {
//             dispatch(setRequestToken(token)); // Store token in Redux

//             const appKey = process.env.REACT_APP_FLATTRATE_APP_KEY;
//             if (!appKey) {
//             console.error('App key is not defined');
//             return;
//             }

//             const redirectUrl = `https://auth.flattrade.in/?app_key=${appKey}`;
//             window.location.href = redirectUrl; 
//           navigate('/dashboard'); 
//         }
//       } catch (error) {
//         console.error('Error fetching request token', error);
//       }
//   };

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const message = urlParams.get('message');
//     const code = urlParams.get('code');

//     // Check if the login message is "Login successful"
//     if (message && message.includes('Login successful')) {
//       navigate('/dashboard');  // Redirect to dashboard if login is successful
//     }
//   })

//   return (
//     <Box sx={{ padding: '20px', paddingX: '50px' }}>
//       <h1>Sign In to Flattrade</h1>

//         <Button variant="contained" onClick={handleLoginRedirect}>
//             'Sign In'
//         </Button>

//     </Box>
//   );
// };

// export default Login;











// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button, CircularProgress, Alert, Box } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { fetchToken } from '../redux/authSlice';
// import { RootState, AppDispatch } from '../redux/store';

// const Login: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { loading, error, token } = useSelector((state: RootState) => state.auth);

//   const handleLoginRedirect = async () => {
//     const appKey = process.env.REACT_APP_FLATTRATE_APP_KEY;
//     if (!appKey) {
//       console.error('App key is not defined');
//       return;
//     }

//     const redirectUrl = `https://auth.flattrade.in/?app_key=${appKey}`;
//     window.location.href = redirectUrl;  // Redirect to the Flattrade login page
//   };

//   // This simulates handling the token on success
//   React.useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get('code');
//     if (code) {
//       dispatch(fetchToken({ code, client: 'FT048819' }));
//     }
//   }, [dispatch]);

//   React.useEffect(() => {
//     if (token) {
//       navigate('/dashboard');
//     }
//   }, [token, navigate]);

//   return (
//     <Box sx={{ padding: '20px', paddingX: '50px' }}>
//       <h1>Sign In to Flattrade</h1>
//       <Button variant="contained" onClick={handleLoginRedirect} disabled={loading}>
//         {loading ? <CircularProgress size={24} /> : 'Sign In'}
//       </Button>
//       {error && <Alert severity="error">{error}</Alert>}
//     </Box>
//   );
// };

// export default Login;




















// // import React from 'react';
// // import { Button, Box } from '@mui/material';
// // import { useNavigate } from 'react-router-dom';

// // const Login: React.FC = () => {
// //   const navigate = useNavigate();

// // //   const handleLoginRedirect = () => {
// // //     const appKey = process.env.REACT_APP_FLATTRAGE_APP_KEY;
// // //     const flattradeLoginUrl = `https://auth.flattrade.in/?app_key=${appKey}`;
// // //     window.location.href = flattradeLoginUrl; // Redirect to Flattrade
// // //   };


// // const handleLoginRedirect = () => {
// //     const appKey = process.env.REACT_APP_FLATTRAGE_APP_KEY;
// //     console.log('App Key:', appKey); // Add this for debugging
  
// //     if (!appKey) {
// //       console.error('App key is missing!');
// //       return;
// //     }
  
// //     const flattradeLoginUrl = `https://auth.flattrade.in/?app_key=${appKey}`;
// //     window.location.href = flattradeLoginUrl;
// //   };
  

// //   return (
// //     <Box sx={{ padding: '20px', textAlign: 'center' }}>
// //       <h1>Sign in to Flattrade</h1>
// //       <Button variant="contained" onClick={handleLoginRedirect}>
// //         Sign In
// //       </Button>
// //     </Box>
// //   );
// // };

// // export default Login;




















// // src/components/Login.tsx
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button, TextField, CircularProgress, Alert, Box } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { RootState, AppDispatch } from '../redux/store'; // Import AppDispatch and RootState
// import { login } from '../redux/authSlice';

// const Login: React.FC = () => {
//   const [appKey, setAppKey] = useState('');
//   const dispatch = useDispatch<AppDispatch>(); // Type the dispatch function
//   const navigate = useNavigate();
//   const { loading, error, token } = useSelector((state: RootState) => state.auth);

//   const handleLogin = async () => {
//     if (appKey) {
//       try {
//         const action = await dispatch(login(appKey));
//         // Check if the request was successful
//         if (login.fulfilled.match(action)) {
//           navigate('/dashboard'); // Navigate to Dashboard on success
//         } else {
//           console.error('Login failed');
//         }
//       } catch (error) {
//         console.error('Error during login:', error);
//       }
//     }
//   };

//   return (
//     <Box sx={{padding:'20px',paddingX:'50px'}}>
//         <Box sx={{display:'flex',flexDirection:'column',rowGap:'20px'}}>
//             <TextField
//                 label="App Key"
//                 variant="outlined"
//                 value={appKey}
//                 onChange={(e) => setAppKey(e.target.value)}
//                 fullWidth
//             />
//             {loading && <CircularProgress />}
//             {error && <Alert severity="error">{error}</Alert>}
//             {/* Removed token check for success message since navigation occurs */}
//             <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleLogin}
//                 disabled={loading}
//             >
//                 Login
//             </Button>
//       </Box>
//     </Box>
//   );
// };

// export default Login;
