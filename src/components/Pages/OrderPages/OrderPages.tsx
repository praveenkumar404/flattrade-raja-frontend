import { Box, Card, CardContent, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DatePickerComponent from '../../../comman/ReusabelCompoents/DatePickerComponent';

// Define the structure of the order data
type Order = {
  id: number;
  documentId: string;
  uid: string;
  actid: string;
  exch: string;
  tysm: string;
  qty: number;
  prc: number;
  prd: string;
  trantype: string | null;
  prctyp: string;
  ret: string;
  orderDate: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
};

const OrderPages = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Function to handle date change from DatePickerComponent
  const handleDateChange = (value: Date | null, id: string) => {
    setSelectedDate(value);
    console.log(`Component: ${id}, Selected Value:`, value);
  };

  // Fetch API data on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://rajaapp.in//api/orders', {
          headers: {
            Authorization: 'Bearer 7b6abf23ba7e400fe9f46c86572038d8f8ddf47d962a39fc6458d3ed6e16549f4b3842f3115c4267caaca77388a298b74d494bd61fbe24b35194f7c69c3e7b72063efec09f305974c7e1cf219151436743d0af7d3b61913afb8a7517caf09fd0aa9af12f29558a600ab890eaacf9923c91874acfb8f0b45fae71fb08af55dc14', // Replace with your token
          },
        });
        const result = await response.json();
        const ordersData: Order[] = result.data;
        
        // Duplicate the orders data
        const duplicatedOrders = [...ordersData];
        
        setOrders(duplicatedOrders);
        setFilteredOrders(duplicatedOrders); // Initially display all orders
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [orders]);

  // Filter the orders based on the selected publishedAt date
  useEffect(() => {
    if (selectedDate) {
      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.publishedAt);
        return (
          orderDate.getFullYear() === selectedDate.getFullYear() &&
          orderDate.getMonth() === selectedDate.getMonth() &&
          orderDate.getDate() === selectedDate.getDate()
        );
      });
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders); // Reset filter if no date is selected
    }
  }, [selectedDate, orders]);

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h4">Order Pages</Typography>
      </Box>

      <Box mb={2}>
        {/* Date Picker for filtering orders */}
        <DatePickerComponent id="date-picker-1" format="dd/MM/yyyy" onChange={handleDateChange} />
      </Box>

      <Box>
        <Button onClick={() => setSelectedDate(null)}>Reset Filter</Button>
      </Box>

      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} lg={12} key={order.id}>
              <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Document ID</Typography>
                      <Typography variant="body1">{order.documentId}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">User ID</Typography>
                      <Typography variant="body1">{order.uid}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Exchange</Typography>
                      <Typography variant="body1">{order.exch}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Order Type</Typography>
                      <Typography variant="body1">{order.tysm}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Quantity</Typography>
                      <Typography variant="body1">{order.qty}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Price</Typography>
                      <Typography variant="body1">{order.prc}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Published At</Typography>
                      <Typography variant="body1">{new Date(order.publishedAt).toLocaleString()}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default OrderPages;















// import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
// // import moment from 'moment';
// import React, { useState } from 'react'
// import { Controller, useForm } from 'react-hook-form';
// import DatePickerComponent from '../../../comman/ReusabelCompoents/DatePickerComponent';

// type DataItem = {
//   id: number;
//   title: string;
//   description: string;
//   date: string;
//   status: string;
// };


// const OrderPages = () => {

//   const handleChange = (value: Date | null, id: string) => {
//     // Component: date-picker-1, Selected Value: Fri Aug 22 2014 21:11:00 GMT+0530 (India Standard Time)
//     console.log(`Component: ${id}, Selected Value:`, value);
//   };


//   const data: DataItem[] = [
//     { id: 1, title: 'Task 1', description: 'First task', date: '2024-11-06', status: 'Pending' },
//     { id: 2, title: 'Task 2', description: 'Second task', date: '2024-11-07', status: 'Completed' },
//     { id: 3, title: 'Task 3', description: 'Third task', date: '2024-11-08', status: 'In Progress' },
//     { id: 4, title: 'Task 4', description: 'Fourth task', date: '2024-11-09', status: 'Pending' },
//   ];

//   return (
//     <Box>

//         <Box>
//             Order Pages
//         </Box>

//         <Box>
//         <DatePickerComponent id="date-picker-1" format="MM/dd/yyyy" onChange={handleChange} />
//         </Box>

//         <Box sx={{ padding: 2 }}>
//       <Grid container spacing={2}>
//         {data.map((item) => (
//           <Grid item xs={12} sm={6} md={4} lg={12} key={item.id}>
//             <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
//               <CardContent>
//                 <Grid container spacing={1}>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="text.secondary">Title</Typography>
//                     <Typography variant="body1">{item.title}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="text.secondary">Description</Typography>
//                     <Typography variant="body1">{item.description}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="text.secondary">Date</Typography>
//                     <Typography variant="body1">{item.date}</Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="text.secondary">Status</Typography>
//                     <Typography variant="body1">{item.status}</Typography>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//     </Box>
//   )
// }

// export default OrderPages



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const OrderPages = () => {
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState('710f950d820c1bee1ea46a4f4fc1bd140776be2cad242c90700c37f8f42c1f63f1fda0af3f1cf37fd2d0656b29ae59d0c8e61ce4f25b5259363fb1bf8fac59b6f11bf01c490662fdd594084198e41e9654db5ec0d90edc1946f80c6dfaa416679284c0463193361eba932b98b2dea09ca46bb44dcb48eb957c828d1a86737e1d');
//   const [userDetails, setUserDetails] = useState<any>();
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchToken = async () => {
//       try {
//         const response = await axios.get('http://localhost:1337/api/authentications');
//         setToken(response.data.token);
//       } catch (error:any) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     const validateToken = async (token:any) => {
//       try {
//         const response = await axios.get('(link unavailable)', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUserDetails(response.data);
//         setLoading(false);
//       } catch (error:any) {
//         if (error.response.status === 401) {
//           // Token expired or invalid
//           window.location.href = '/login';
//         } else {
//           setError(error.message);
//           setLoading(false);
//         }
//       }
//     };

//     fetchToken().then(() => {
//       if (token) {
//         validateToken(token);
//       } else {
//         // No token returned from Strapi
//         window.location.href = '/login';
//       }
//     });
//   }, [token]);

//   if (loading) {
//     return (
//       <div>
//         <h2>Loading...</h2>
//         <div className="loading-animation">
//           {/* Your loading animation JSX here */}
//           <div className="spinner-border" role="status">
//             <span className="sr-only">Loading...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <h1>Welcome, {userDetails?.name}!</h1>
//       {/* Render dashboard JSX */}
//     </div>
//   );
// };

// export default OrderPages;
