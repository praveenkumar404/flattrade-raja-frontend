import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  Pagination,
} from '@mui/material';
import { styled } from '@mui/material';
import DatePickerComponent from '../../../comman/ReusabelCompoents/DatePickerComponent';
import { RootState } from '../../../redux/store';
import { resetFilters, setOrders, updateFilters } from '../../../redux/OrderSlice';
import moment from 'moment';
import OrderPopupModal from '../../../comman/ReusabelCompoents/OrderPopupModal';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const OrderPages = () => {
  const dispatch = useDispatch();
  const { orders, filters } = useSelector((state: RootState) => state?.orderSlice);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize,setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = async (currentPage?: number) => {
    console.log('page number : ',currentPage)
    const hasDateRange = startDate && endDate;

    const apiUrl = hasDateRange
      ? `${process.env.REACT_APP_API_URL}/purges?sort[updatedAt]=desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters\[orderDate\]\[$gte\]=${moment(startDate).format(
      'YYYY-MM-DD'
    )}T00:00:00&filters\[orderDate\]\[$lte\]=${moment(endDate).format('YYYY-MM-DD')}T23:59:59`
      : `${process.env.REACT_APP_API_URL}/orders?sort[updatedAt]=desc&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`;

    try {
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}` },
      });
      const result = await response.json();
      setTotalPages(result?.meta?.pagination?.pageCount);
      setPageSize(result?.meta?.pagination?.pageSize)
      dispatch(setOrders(result?.data));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (!startDate && !endDate) {
      fetchOrders(page);
    }
  }, [startDate, endDate, page]);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    dispatch(updateFilters({ [key]: value }));
  };

  const resetFiltersHandler = () => {
    setStartDate(null);
    setEndDate(null);
    dispatch(resetFilters());
  };

  const filteredOrders = orders?.filter((order: any) =>
    Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null) return true;
      if (value === '') return order;
      return order[key as keyof typeof order] === value;
    })
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleRowClick = (order: any) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Pages
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <DatePickerComponent
          id="start-date"
          label="From Date:"
          placeholderdiplay="From Date"
          format="dd/MM/yyyy"
          onChange={(date) => setStartDate(date)}
        />
        <DatePickerComponent
          id="end-date"
          label="To Date:"
          placeholderdiplay="To Date"
          format="dd/MM/yyyy"
          onChange={(date) => setEndDate(date)}
        />
        <Button variant="contained" onClick={() => fetchOrders()}>  {/* Corrected function call */}
          Fetch Orders
        </Button>
        <Button variant="outlined" onClick={resetFiltersHandler}>
          Reset Filters
        </Button>
      </Box>

      <Box mb={2}>
        <Select
          value={filters?.index || ''}
          onChange={(e) => handleFilterChange('index', e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Indices</MenuItem>
          {orders
            ?.filter((order: any, index: number, self: any[]) =>
              index === self.findIndex((o: any) => o.index === order.index)
            )
            .map((order: any) => (
              <MenuItem key={order?.id} value={order?.index}>
                {order?.index}
              </MenuItem>
            ))}
        </Select>
      </Box>

      <Box>
        <OrderPopupModal open={modalOpen} onClose={handleCloseModal} data={selectedOrder} />
      </Box>

      {filteredOrders?.length > 0 ? (
        <Box>
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Order Type</StyledTableCell>
                  <StyledTableCell>Contract Type</StyledTableCell>
                  <StyledTableCell>Contract Trading Symbol</StyledTableCell>
                  <StyledTableCell>Order Status</StyledTableCell>
                  <StyledTableCell>Price</StyledTableCell>
                  <StyledTableCell>Contract LP</StyledTableCell>
                  <StyledTableCell>Realized PL</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders
                  // ?.slice()
                  // ?.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  ?.map((orderitem: any) => (
                    <StyledTableRow key={orderitem?.id} onClick={() => handleRowClick(orderitem)}>
                      <StyledTableCell>{`${new Date(orderitem?.updatedAt).toLocaleDateString()} - ${new Date(orderitem?.updatedAt).toLocaleTimeString()}`}</StyledTableCell>
                      <StyledTableCell>{orderitem?.orderType}</StyledTableCell>
                      <StyledTableCell>{orderitem?.contractType}</StyledTableCell>
                      <StyledTableCell>{orderitem?.contractTsym}</StyledTableCell>
                      <StyledTableCell>{orderitem?.orderStatus || 'Pending...'}</StyledTableCell>
                      <StyledTableCell>{orderitem?.price || 'Pending...'}</StyledTableCell>
                      <StyledTableCell>{orderitem?.contractLp || 'Pending...'}</StyledTableCell>
                      <StyledTableCell>{orderitem?.realizedPL}</StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: 'full',
          }}
        >
          <Box>
            <h4>No Available Orders !</h4>
          </Box>
          <Box>
            <img
              style={{ height: '250px', width: '250px' }}
              src={require('../../../assets/images/Loading_app.gif')}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OrderPages;


















// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   tableCellClasses,
//   Pagination,
// } from '@mui/material';
// import { styled } from '@mui/material';
// import DatePickerComponent from '../../../comman/ReusabelCompoents/DatePickerComponent';
// import { RootState } from '../../../redux/store';
// import { resetFilters, setOrders, updateFilters } from '../../../redux/OrderSlice';
// import moment from 'moment';


// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   '&:last-child td, &:last-child th': {
//     border: 0,
//   },
// }));

// const OrderPages = () => {
//   const dispatch = useDispatch();
//   const { orders, filters } = useSelector((state: RootState) => state?.orderSlice);
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(25); // Fixed page size
//   const [totalPages, setTotalPages] = useState(0);


//   const fetchOrders = async () => {
//     const hasDateRange = startDate && endDate;

//     const apiUrl = hasDateRange
//       ? `${process.env.REACT_APP_API_URL}/purges?filters[orderDate][$gte]=${moment(startDate).format(
//           'YYYY-MM-DD'
//         )}T00:00:00&filters[orderDate][$lte]=${moment(endDate).format('YYYY-MM-DD')}T23:59:59`
//       : `${process.env.REACT_APP_API_URL}/orders`;

//     try {
//       const response = await fetch(apiUrl, {
//         headers: { Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}` },
//         // body: JSON.stringify({
//         //   page: currentPage,
//         //   pageSize,
//         // }),
//       });
//       const result = await response.json();
//       setTotalPages(result.meta.pagination.pageCount);
//       dispatch(setOrders(result?.data));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   // Fetch default orders when no dates are selected
//   useEffect(() => {
//     if (!startDate && !endDate) {
//       fetchOrders();
//     }
//   }, [startDate, endDate]);

//   // useEffect(() => {
//   //   if (!startDate && !endDate) {
//   //   fetchOrders(page);
//   //   }
//   // }, [startDate, endDate, page]);




//   const handleFilterChange = (key: keyof typeof filters, value: any) => {
//     dispatch(updateFilters({ [key]: value }));
//   };

//   const resetFiltersHandler = () => {
//     setStartDate(null);
//     setEndDate(null);
//     dispatch(resetFilters());
//   };

//   const filteredOrders = orders?.filter((order: any) =>
//     Object.entries(filters).every(([key, value]) => {
//       if (value === undefined || value === null) return true;
//       if (value === '') return order;
//       return order[key as keyof typeof order] === value;
//     })
//   );

//   const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
//     setPage(value);
//   };
  
//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Order Pages
//       </Typography>

//       <Box display="flex" gap={2} mb={2}>
//         <DatePickerComponent
//           id="start-date"
//           label="From Date:"
//           placeholderdiplay="From Date"
//           format="dd/MM/yyyy"
//           onChange={(date) => setStartDate(date)}
//         />
//         <DatePickerComponent
//           id="end-date"
//           label="To Date:"
//           placeholderdiplay="To Date"
//           format="dd/MM/yyyy"
//           onChange={(date) => setEndDate(date)}
//         />
//         <Button variant="contained" onClick={fetchOrders}>
//           Fetch Orders
//         </Button>
//         <Button variant="outlined" onClick={resetFiltersHandler}>
//           Reset Filters
//         </Button>
//       </Box>

//       <Box mb={2}>
//       <Select
//         value={filters?.index || ''}
//         onChange={(e) => handleFilterChange('index', e.target.value)}
//         displayEmpty
//       >
//         <MenuItem value="">All Indices</MenuItem>
//         {orders
//           ?.filter((order: any, index: number, self: any[]) =>
//             index === self.findIndex((o: any) => o.index === order.index) // Remove duplicates
//           )
//           .map((order: any) => (
//             <MenuItem key={order?.id} value={order?.index}>
//               {order?.index}
//             </MenuItem>
//           ))}
//       </Select>
//     </Box>

//       {filteredOrders?.length > 0 ? (
//         <Box>
//         <Box>
//         <TableContainer component={Paper}>
//           <Table aria-label="customized table">
//             <TableHead>
//               <TableRow>
//                 <StyledTableCell>Date</StyledTableCell>
//                 <StyledTableCell>Order Type</StyledTableCell>
//                 <StyledTableCell>Contract Type</StyledTableCell>
//                 <StyledTableCell>Contract Trading Symbol</StyledTableCell>
//                 <StyledTableCell>Order Status</StyledTableCell>
//                 <StyledTableCell>Price</StyledTableCell>
//                 <StyledTableCell>Contract LP</StyledTableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredOrders?.slice() // Create a shallow copy to avoid modifying the source data
//                 ?.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) // Sort by updatedAt in descending order
//                 ?.map((order: any) => (
//                 <StyledTableRow key={order?.id}>
//                   <StyledTableCell>{`${new Date(order?.updatedAt).toLocaleDateString()} - ${new Date(order?.updatedAt).toLocaleTimeString()}`}</StyledTableCell>
//                   <StyledTableCell>{order?.orderType}</StyledTableCell>
//                   <StyledTableCell>{order?.contractType}</StyledTableCell>
//                   <StyledTableCell>{order?.contractTsym}</StyledTableCell>
//                   <StyledTableCell>{order?.orderStatus || 'Pending...'}</StyledTableCell>
//                   <StyledTableCell>{order?.price || 'Pending...'}</StyledTableCell>
//                   <StyledTableCell>{order?.contractLp || 'Pending...'}</StyledTableCell>
//                 </StyledTableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         </Box>

//         <Box mt={2} display="flex" justifyContent="center">
//         <Pagination
//           count={totalPages}
//           page={page}
//           onChange={handlePageChange}
//           color="primary"
//         />
//       </Box>
//         </Box>
//       ) : (
//         <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center',width:'full'}}>
//           <Box>
//             <h4>No Available Orders ! </h4>
//             </Box>
//             <Box>
//               <img style={{height:'250px',width:'250px'}} src={require('../../../assets/images/Loading_app.gif')}/>
//               </Box>
//               </Box>
//       )}
//     </Box>
//   );
// };

// export default OrderPages;















// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Box, Grid, Typography, Button, TextField, Select, MenuItem , Card, CardContent } from '@mui/material';
// import DatePickerComponent from '../../../comman/ReusabelCompoents/DatePickerComponent';
// import { RootState } from '../../../redux/store';
// import { resetFilters, setOrders, updateFilters } from '../../../redux/OrderSlice';
// import moment from 'moment';

// const OrderPages = () => {
//   const dispatch = useDispatch();
//   const { orders, filters } = useSelector((state: RootState) => state?.orderSlice);
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);

//   const fetchOrders = async () => {
//     console.log("datinggg : ", startDate, endDate)
//     if(startDate != null && endDate !=null){
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/orders?filters[createdAt][$gte]=${moment(startDate).format("YYYY-MM-DD")}T00:00:00&filters[createdAt][$lte]=${moment(endDate).format("YYYY-MM-DD")}T23:59:59`,
//         {
//           headers: { Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}` },
//         }
//       );
//       const result = await response.json();
//       dispatch(setOrders(result?.data));
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     }
//   }else{
//     alert("Please the Start and End Date ! ")
//   }
//   };

//   const handleFilterChange = (key: keyof typeof filters, value: any) => {
//     dispatch(updateFilters({ [key]: value }));
//   };

//   const resetFiltersHandler = () => {
//     setStartDate(null);
//     setEndDate(null);
//     dispatch(resetFilters());
//   };

//   const filteredOrders = orders?.filter((order:any) => {
//     return Object.entries(filters).every(([key, value]) => {
//       if (value === undefined || value === null) return true;
//       if(value === "") return order
//       return order[key as keyof typeof order] === value;
//     });
//   });

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         Order Pages
//       </Typography>

//       <Box display="flex" gap={2} mb={2}>
//         <DatePickerComponent
//           id="start-date"
//           label="From Date : "
//           placeholderdiplay ="From Date"
//           format="dd/MM/yyyy"
//           onChange={(date) => setStartDate(date)}
//         />
//         <DatePickerComponent
//           id="end-date"
//           label="To Date : "
//           placeholderdiplay ="Last Date"
//           format="dd/MM/yyyy"
//           onChange={(date) => setEndDate(date)}
//         />
//         <Button variant="contained" onClick={fetchOrders} sx={{boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'}}>
//           Fetch Orders
//         </Button>
//         <Button variant="outlined" onClick={resetFiltersHandler} sx={{boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'}}>
//           Reset Filters
//         </Button>
//       </Box>

//       <Box sx={{display:'flex', width:'fit-content', flexWrap:'wrap',gap:2, mb:2, mt:4, boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}>
//         <Select
//           value={filters?.index || ''}
//           onChange={(e) => handleFilterChange('index', e.target.value)}
//           displayEmpty
//         >
//           <MenuItem value="">All Indices</MenuItem>
//           {orders?.map((order:any) => (
//             <MenuItem key={order?.id} value={order?.index}>
//               {order?.index}
//             </MenuItem>
//           ))}
//         </Select>
//       </Box>      

//       <Box sx={{ padding: 2 , boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'}}>
      
//         <Grid container sx={{rowGap:'10px'}}>
//         {orders?.length == 0 ? <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center',width:'full'}}><Box><h4>No Available Orders ! </h4></Box><Box><img style={{height:'250px',width:'250px'}} src={require('../../../assets/images/Loading_app.gif')}/></Box></Box>:null}
//           {filteredOrders.map((order) => (
//             <Grid item xs={12} sm={6} md={4} lg={12} key={order.id}>
//               <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
//                 <CardContent>
//                   <Grid container spacing={1}>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="subtitle2" color="text.secondary">
//                       Order Type
//                       </Typography>
//                       <Typography variant="body1">{order.orderType}</Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Contract Type
//                       </Typography>
//                       <Typography variant="body1">{order.contractType}</Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="subtitle2" color="text.secondary">
//                       Contract Trading symbol
//                       </Typography>
//                       <Typography variant="body1">{order.contractTsym}</Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Order Status
//                       </Typography>
//                       <Typography variant="body1">{order.orderStatus ? order.orderStatus : 'Pending...'}</Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Price
//                       </Typography>
//                       <Typography variant="body1">{order?.price ? order?.price : 'Pending...'}</Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                       <Typography variant="subtitle2" color="text.secondary">
//                         Contract LP
//                       </Typography>
//                       <Typography variant="body1">{order?.contractLp ? order?.contractLp : 'Pending...'}</Typography>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//         </Box>
//     </Box>
//   );
// };

// export default OrderPages;