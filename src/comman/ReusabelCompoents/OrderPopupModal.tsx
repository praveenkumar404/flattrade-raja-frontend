import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton, Button, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fontSize } from '@mui/system';

interface OrderPopupModalProps {
  open: boolean;
  onClose: () => void;
  data: {
    index: string;
    orderType: string;
    contractType: string;
    contractTsym: string;
    indexLtp: string;
    lotSize: number;
    price: number;
    contractLp: number;
    remarks: any;
    norenordno:any;
    realizedPL:any;
    updatedAt:any;
  } | null;
}

const OrderPopupModal: React.FC<OrderPopupModalProps> = ({ open, onClose, data }) => {
  const [showMore, setShowMore] = useState(false);

  if (!data) return null;

  const { index, orderType, contractType, contractTsym, indexLtp, lotSize, price, contractLp, remarks, updatedAt, norenordno, realizedPL } = data;

  // Define label-value pairs for easy rendering
  const rows = [
    { label: 'Order Type', value: orderType ? orderType : 'N/A' },
    { label: 'Index', value: index ? index : 'N/A'},
    { label: 'Contract Type', value: contractType ? contractType : 'N/A' },
    { label: 'Price', value: `₹${price ? price : 'N/A'}` },
    { label: 'Date', value: `${new Date(updatedAt).toLocaleDateString('en-US')} - ${new Date(updatedAt).toLocaleTimeString('en-US')}`},
    { label: 'Index LTP', value: indexLtp ? indexLtp : 'N/A'},
    { label: 'Lot Size', value: lotSize ? lotSize : 'N/A' },
    { label: 'Contract LP', value: `₹${contractLp ? contractLp : 'N/A'}` },
    { label: 'Order No', value: `${norenordno ? norenordno : 'N/A'}` },
    { label: 'Profit / Loss', value: `${realizedPL ? realizedPL : 'N/A'}` }
  ];

  // Determine the rows to display
  const visibleRows = showMore ? rows : rows.slice(0, 5);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: '#cf4624',
        }}
      >
        <Box>
            <Box sx={{display:'flex',columnGap:'10px'}}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#E0E0E0' }}>
                {contractTsym}
                </Typography>
                <Box sx={{display:'flex',alignItems:'center',padding:'2px 8px', borderRadius:'5px', fontSize:'12px', bgcolor:'#fff', color:'#000',width:'fit-content'}}>
                {index}
                </Box>
            </Box>

        <Typography sx={{padding:'2px 8px', borderRadius:'5px', fontSize:'12px', bgcolor:'#fff', color:'#000',width:'fit-content'}}>
            {orderType}
        </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: '#FFFFFF',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ paddingTop: '10px' }}>
          {visibleRows.map((row, index) => (
            <Box key={index} display="flex" justifyContent="space-between">
              <Typography sx={{ fontWeight: 'bold' }}>{row.label}:</Typography>
              <Typography>{row.value}</Typography>
            </Box>
          ))}
          {rows.length > 5 && (
            <Button
              onClick={() => setShowMore((prev) => !prev)}
              sx={{ marginTop: 2 }}
            >
              {showMore ? 'Show Less Details' : 'Show More Details'}
            </Button>
          )}
        </Box>
        <Divider/>
        <Box sx={{padding:2}}>
            Remarks : {remarks ? remarks : 'N/A'}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrderPopupModal;