import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Grid, Typography, Button, TextField, Select, MenuItem , Card, CardContent } from '@mui/material';
import DatePickerComponent from '../../../comman/ReusabelCompoents/DatePickerComponent';
import { RootState } from '../../../redux/store';
import { resetFilters, setOrders, updateFilters } from '../../../redux/OrderSlice';

const OrderPages = () => {
  const dispatch = useDispatch();
  const { orders, filters } = useSelector((state: RootState) => state?.orderSlice);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fetchOrders = async () => {
    if(startDate != null && endDate !=null){
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders?filters[createdAt][$gte]=${startDate?.toISOString()}&filters[createdAt][$lte]=${endDate?.toISOString()}`,
        {
          headers: { Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}` },
        }
      );
      const result = await response.json();
      dispatch(setOrders(result?.data));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }else{
    alert("Please the Start and End Date ! ")
  }
  };

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    dispatch(updateFilters({ [key]: value }));
  };

  const resetFiltersHandler = () => {
    setStartDate(null);
    setEndDate(null);
    dispatch(resetFilters());
  };

  const filteredOrders = orders?.filter((order:any) => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null) return true;
      if(value === "") return order
      return order[key as keyof typeof order] === value;
    });
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Pages
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <DatePickerComponent
          id="start-date"
          label="From Date : "
          placeholderdiplay ="From Date"
          format="dd/MM/yyyy"
          onChange={(date) => setStartDate(date)}
        />
        <DatePickerComponent
          id="end-date"
          label="To Date : "
          placeholderdiplay ="Last Date"
          format="dd/MM/yyyy"
          onChange={(date) => setEndDate(date)}
        />
        <Button variant="contained" onClick={fetchOrders} sx={{boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'}}>
          Fetch Orders
        </Button>
        <Button variant="outlined" onClick={resetFiltersHandler} sx={{boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'}}>
          Reset Filters
        </Button>
      </Box>

      <Box sx={{display:'flex', width:'fit-content', flexWrap:'wrap',gap:2, mb:2, mt:4, boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset' }}>
        <Select
          value={filters.index || ''}
          onChange={(e) => handleFilterChange('index', e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Indices</MenuItem>
          {orders.map((order:any) => (
            <MenuItem key={order.id} value={order.index}>
              {order.index}
            </MenuItem>
          ))}
        </Select>
        {/* <Select
          value={filters.orderType || ''}
          onChange={(e) => handleFilterChange('orderType', e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Order Types</MenuItem>
          {orders.map((order:any) => (
            <MenuItem key={order.id} value={order.orderType}>
              {order.orderType}
            </MenuItem>
          ))}
        </Select> */}
        {/* Add more filters similarly */}
      </Box>      

      <Box sx={{ padding: 2 , boxShadow:'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset'}}>
      
        <Grid container sx={{rowGap:'10px'}}>
        {orders?.length == 0 ? <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center',width:'full'}}><Box><h4>No Available Orders ! </h4></Box><Box><img style={{height:'250px',width:'250px'}} src={require('../../../assets/images/Loading_app.gif')}/></Box></Box>:null}
          {filteredOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} lg={12} key={order.id}>
              <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Index
                      </Typography>
                      <Typography variant="body1">{order.index}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                      Order Type
                      </Typography>
                      <Typography variant="body1">{order.orderType}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Contract Type
                      </Typography>
                      <Typography variant="body1">{order.contractType}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                      Contract Trading symbol
                      </Typography>
                      <Typography variant="body1">{order.contractTsym}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Lot Size
                      </Typography>
                      <Typography variant="body1">{order.lotSize}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        order Number
                      </Typography>
                      <Typography variant="body1">{order.norenordno ? order.norenordno : 'Pending...'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Order Status
                      </Typography>
                      <Typography variant="body1">{order.orderStatus ? order.orderStatus : 'Pending...'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Updated Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(order.updatedAt).toLocaleString()}
                      </Typography>
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