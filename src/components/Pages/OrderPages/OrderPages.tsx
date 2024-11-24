import { Box, Card, CardContent, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DatePickerComponent from '../../../comman/ReusabelCompoents/DatePickerComponent';


interface Order {
  id: number;
  documentId: string;
  index: string;
  orderType: string;
  contractType: string;
  contractTsym: string;
  contractToken: string;
  indexLtp: string;
  lotSize: number;
  price: number;
  contractLp: number;
  norenordno: string | null;
  orderStatus: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};


const OrderPages = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date());

  const formatDateToISO = (date: Date): string => {
    return date.toISOString();
  };

  const handleStartDateChange = (value: Date | null, id: string) => {
    setSelectedStartDate(value);
    console.log(`Component: ${id}, Selected Start Value:`, value);
  };

  const handleEndDateChange = (value: Date | null, id: string) => {
    setSelectedEndDate(value);
    console.log(`Component: ${id}, Selected End Value:`, value);
  };

  const fetchOrders = async (startDate: string, endDate: string) => {
    console.log("check date formate --> Start : ", startDate, "  End : ",endDate)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/orders?filters[createdAt][$gte]=${encodeURIComponent(
          startDate
        )}&filters[createdAt][$lte]=${encodeURIComponent(endDate)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_USER_TOKEN}`, // Replace with your token
          },
        }
      );
      const result = await response.json();
      const ordersData: Order[] = result.data;
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    const startDate = formatDateToISO(new Date());
    const endDate = formatDateToISO(new Date(new Date().setHours(23, 59, 59)));
    console.log("check default date formate --> Start : ", startDate, "  End : ",endDate)
    fetchOrders(startDate, endDate);
  }, []);

  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const startDate = formatDateToISO(new Date(selectedStartDate.setHours(0, 0, 0)));
      const endDate = formatDateToISO(new Date(selectedEndDate.setHours(23, 59, 59)));
      fetchOrders(startDate, endDate);
    }
  }, [selectedStartDate, selectedEndDate]);

  const resetDatefield = () =>{
    setSelectedStartDate(null)
    setSelectedEndDate(null)
  }
  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h4">Order Pages</Typography>
      </Box>

      <Box mb={2} sx={{display:'flex',columnGap:'20px'}}>
          <DatePickerComponent id="date-picker-1" label="Start Date" format="dd/MM/yyyy" onChange={handleStartDateChange} />
          <DatePickerComponent id="date-picker-1" label="End Date" format="dd/MM/yyyy" onChange={handleEndDateChange} />
      </Box>

      <Box>
        <Button onClick={resetDatefield}>Reset Filter</Button>
      </Box>

      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} lg={12} key={order.id}>
              <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Document ID
                      </Typography>
                      <Typography variant="body1">{order.documentId}</Typography>
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
                        Quantity
                      </Typography>
                      <Typography variant="body1">{order.lotSize}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Price
                      </Typography>
                      <Typography variant="body1">{order.price}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Published At
                      </Typography>
                      <Typography variant="body1">
                        {new Date(order.publishedAt).toLocaleString()}
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