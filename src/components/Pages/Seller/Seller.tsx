import React, { useEffect, useState } from "react";
import { fetchPosition, fetchpostplaceholder } from "../../../api/Service/CommanServiceapi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import { useWebSocketMessages } from "../../../Webhooktypeprocess";
import ToastNotification from "../../../comman/ReusabelCompoents/ToastNotification";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { fetchPositionsThunk, setPositionsPersist } from "../../../redux/SellerSlice";
import { UseMyAppDispatch, UseMyAppSelector } from "../../../redux/UseMyAppDispatch";

// Define custom styles for TableContainer
const ResponsiveTableContainer = styled(TableContainer)(({ theme }) => ({
  overflowX: "auto",
  maxWidth: "100%",
  [theme.breakpoints.up("lg")]: {
    maxWidth: "100%",
    width: "100%",
  },
  [theme.breakpoints.down("lg")]: {
    maxWidth: "100%",
    width: "100%",
  },
}));

// Create custom MUI theme
const theme = createTheme({
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          height: "40px", // Set row height
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "5px", // Set cell padding
          fontSize: "12px", // Adjust font size
        },
      },
    },
  },
});

interface PositionData {
  id: number;
  index: string;
  indexToken: string;
  contractType: string | null | number;
  contractToken: string | null | number;
  tsym: string | null | number;
  lotSize: string | null | number;
  quantity:any;
  updatedAt:any;
}




const Seller = () => {
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [hasOrderReloaded, setHasOrderReloaded] = useState(false); // Tracks if API has been reloaded
  const [previousPositions, setPreviousPositions] = useState<PositionData[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PositionData | null>(null);

  // Single state for previous LP and realizedPL
  const [previousData, setPreviousData] = useState({
    lp: null,
    realizedPL: null,
  });



  const dispatch = UseMyAppDispatch();
  const persistedPositions = useSelector(
    (state: RootState) => state.seller.positionsPersist
  );
  const { positionsPersist, loading, error } = UseMyAppSelector((state) => state.seller);



  const webhookdatas = useWebSocketMessages();
  const webhookcontrol = webhookdatas.flat();
  const isTypeindexload = webhookcontrol.find(
    (item: any) => item?.type === "index"
  )?.data;

  const isTypePositionload = webhookcontrol.find(
    (item: any) => item?.type === "position"
  )?.data;

  const isTypeOrderload = webhookcontrol.find(
    (item: any) => item?.type === "order"
  );

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('This is a notification');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const handleShowToast = (text:any,typestatus:'success' | 'error' | 'warning' | 'info',status:boolean) => {
    setToastMessage(text);
    setToastSeverity(typestatus);
    setToastOpen(true);
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  console.log("isTypePositionload : ", isTypePositionload)

  const fetchData = async () => {
    try {
      const response = await fetchPosition(); // Replace with your actual API call function
      if (response?.data) {
        const validData = response.data.filter(
          (item: any) =>
            item.contractType &&
            item.contractToken &&
            item.tsym &&
            item.lotSize
        );
        
        console.log("responsediii : ",response)
        setPositions(validData); // Ensure `setPositions` is a state setter

        // Compare with the previous state
      // if (JSON.stringify(validData) !== JSON.stringify(previousPositions) || performance?.navigation?.type === 1) {
      //   setPositions(validData); // Update the positions state
      //   setPreviousPositions(validData); // Store the previous response
      // }
      //   setPositions([...validData,{
      //     "id": 16,
      //     "documentId": "xzb1jlccnqxl8lx2qevptdth",
      //     "index": "NIFTY",
      //     "indexToken": "26000",
      //     "contractType": "44.8",
      //     "contractToken": "24",
      //     "tsym": "86",
      //     "lotSize": "23",
      //     "createdAt": "2024-12-05T07:15:42.295Z",
      //     "updatedAt": "2025-02-04T03:57:13.193Z",
      //     "publishedAt": "2025-01-20T16:26:40.803Z",
      //     "price": 50,
      //     "quantity": 1
      // }]);
      }
    } catch (error) {
      console.error("Error fetching position data:", error);
    }
  };

  useEffect(() => {
    if ((isTypeOrderload && !hasOrderReloaded) || performance?.navigation?.type === 1) {
      fetchData();
      setHasOrderReloaded(true); // Mark as reloaded to prevent further calls
    }
  }, [isTypeOrderload, hasOrderReloaded, positions]);

  useEffect(() => {
    if (isTypePositionload) {
      fetchData(); // Call API if position changes
    }
  }, [isTypePositionload]); // Re-run only when position data changes
  
  

  const handleOpen = (item: PositionData) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };

  const handleConfirm = async () => {
    if (selectedItem) {
      const placeholderpayload = {
        contractType: `${selectedItem.contractType}`,
        lp: `${isTypeindexload?.lp}`,
        index: `${selectedItem.index}`,
        indexToken: `${selectedItem?.indexToken}`,
        quantity: selectedItem?.quantity,
      };

      try {
        if(selectedItem.contractType && isTypeindexload?.lp && selectedItem.index && selectedItem.indexToken){
        await fetchpostplaceholder(placeholderpayload);
        fetchData();
        }else{handleShowToast(`Error : Not loading Progress run application 9:00 - 3.30`,'error',true)}
      } catch (error) {
        console.error("Error in fetchpostplaceholder:", error);
        handleShowToast(`Error : ${error}`,'error',true)
      } finally {
        handleClose();
      }
    }
  };

  dispatch(setPositionsPersist(positions)); // Save to Redux store

  useEffect(() => {
    if (isTypePositionload?.lp !== undefined || isTypePositionload?.realizedPL !== undefined) {
      setPreviousData((prev) => ({
        lp: isTypePositionload?.lp !== undefined ? isTypePositionload.lp : prev.lp,
        realizedPL: isTypePositionload?.realizedPL !== undefined ? isTypePositionload.realizedPL : prev.realizedPL,
      }));

      dispatch(setPositionsPersist(positions)); // Save to Redux store
    }
  }, [isTypePositionload]);

  
  return (
    <ThemeProvider theme={theme}>
        <ToastNotification
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={handleCloseToast}
      />
      <Box sx={{ overflowX: "auto"}}>
      <Paper elevation={3}>
            <Typography
              variant="h6"
              component="div"
              style={{ padding: "12px 16px", fontWeight: 600}}
            >
              Portfolio
            </Typography>
        <ResponsiveTableContainer>
          
            {positionsPersist.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", color: "#777",fontSize:'8px' }}>Date</TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#777",fontSize:'8px' }}>Index</TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#777",fontSize:'8px' }}>Contract Type</TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#777",fontSize:'8px' }}>Lot Size</TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#777",fontSize:'8px' }}>Tysm</TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#777",fontSize:'8px' }}>LP</TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#777",fontSize:'8px' }}>RealizedPL</TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#777",fontSize:'8px' }}>Send</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positionsPersist?.slice() // Create a shallow copy to avoid modifying the source data
                ?.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) // Sort by updatedAt in descending order
                ?.map((item) => {
                  const islotsizePositive = parseFloat(item?.lotSize?.toString() || "0") > 0;
                  const istsymPositive = parseFloat(item?.tsym?.toString() || "0") > 0;
                  const isPositionMatch = item?.contractToken === isTypePositionload?.token;
                  return (
                    <TableRow key={item.id} >
                      <TableCell sx={{fontSize:'8px'}}>{`${new Date(item?.updatedAt).toLocaleDateString()} - ${new Date(item?.updatedAt).toLocaleTimeString()}`}</TableCell>
                      <TableCell style={{ fontWeight: 500,fontSize:'8px' }}>
                        {item?.index}
                      </TableCell>
                      <TableCell style={{ fontWeight: 500 }}>
                        <Button size="small" variant="outlined" color={item?.contractType == "BUY" ? "success" : "error"} sx={{fontSize:'8px',fontWeight:'600'}}>{item?.contractType}</Button>
                      </TableCell>
                      <TableCell style={{ color: islotsizePositive ? "green" : "red", fontWeight: 500, fontSize:'8px'}}>
                        {item?.lotSize}
                      </TableCell>
                      <TableCell style={{ color: istsymPositive ? "green" : "red", fontWeight: 500, fontSize:'8px' }}>
                        {item?.tsym}
                      </TableCell>

                      <TableCell style={{ fontWeight: 500, fontSize: '8px' }}>
                            {isPositionMatch ? (isTypePositionload?.lp !== undefined ? isTypePositionload?.lp : previousData.lp) : previousData.lp}
                          </TableCell>
                          <TableCell style={{ fontWeight: 500, color: (isTypePositionload?.realizedPL !== undefined ? isTypePositionload?.realizedPL : previousData.realizedPL) < 0 ? "red" : "green", fontSize: '8px' }}>
                            {isPositionMatch ? (isTypePositionload?.realizedPL !== undefined ? isTypePositionload?.realizedPL : previousData.realizedPL) : previousData.realizedPL}
                          </TableCell>
                      <TableCell>
                        <Box onClick={() => handleOpen(item)}>
                          <SendIcon sx={{ color: "#1e90fe", cursor: "pointer" }} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            ):(
              <Box sx={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center',width:'full'}}>
            <Box>
              <h4>No Available Orders ! </h4>
              </Box>
              <Box>
                <img style={{height:'250px',width:'250px'}} src={require('../../../assets/images/Loading_app.gif')}/>
                </Box>
                </Box>
            )}
        </ResponsiveTableContainer>
        </Paper>

        {open && (
        <Box
        >
          <DialogTitle id="confirm-dialog-title">Confirm Action</DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-dialog-description">
                Do you want to sell <span style={{color:"green"}}>{selectedItem?.tsym}</span> now?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Seller;
















// import React, { useEffect, useState } from "react";
// import { fetchPosition, fetchpostplaceholder } from "../../../api/Service/CommanServiceapi";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import { createTheme, styled } from "@mui/system";
// import SendIcon from "@mui/icons-material/Send";
// import { useWebSocketMessages } from "../../../Webhooktypeprocess";

// const ResponsiveTableContainer = styled(TableContainer)(({ theme }) => ({
//   overflowX: "auto",
//   maxWidth: "100%",
//   [theme.breakpoints.up("lg")]: {
//     maxWidth: "50%",
//     width: "100%",
//   },
//   [theme.breakpoints.down("lg")]: {
//     maxWidth: "100%",
//     width: "100%",
//   }
// }));

// const theme = createTheme({
//     components: {
//       MuiTableRow: {
//         styleOverrides: {
//           root: {
//             height: '40px', // Set row height
//           },
//         },
//       },
//       MuiTableCell: {
//         styleOverrides: {
//           root: {
//             padding: '8px', // Set cell padding
//             fontSize: '0.875rem', // Adjust font size
//           },
//         },
//       },
//     },
//   });



// interface PositionData {
//   id: number;
//   index: string;
//   indexToken: string;
//   contractType: string | null | number;
//   contractToken: string | null | number;
//   tsym: string | null | number;
//   lotSize: string | null | number;
// }

// const Seller = () => {
//   const [positions, setPositions] = useState<PositionData[]>([]);
//   const [open, setOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<PositionData | null>(null);

//   const webhookdatas = useWebSocketMessages();
//   const webhookcontrol = webhookdatas.flat();
//   const isTypeindexload = webhookcontrol.find(
//     (item: any) => item?.type === "variable" || item?.type === "order"
//   )?.type;

//   useEffect(() => {
//     const handlePosition = async () => {
//       try {
//         const response = await fetchPosition();
//         if (response?.data) {
//           const validData = response.data.filter(
//             (item: PositionData) =>
//               item.contractType &&
//               item.contractToken &&
//               item.tsym &&
//               item.lotSize
//           );
//           setPositions([...validData,
//             {
//                 "id": 42,
//                 "documentId": "xzb1jlccnqxl8lx2qevptdth",
//                 "index": "NIFTY",
//                 "indexToken": "26000",
//                 "contractType": 9,
//                 "contractToken": 2.4,
//                 "tsym": 3.4,
//                 "lotSize": -5,
//                 "createdAt": "2024-12-05T12:45:01.497Z",
//                 "updatedAt": "2024-12-13T03:54:45.953Z",
//                 "publishedAt": "2024-12-13T03:54:45.942Z"
//             },
//             {
//                 "id": 17,
//                 "documentId": "m4q7tnerinpqun7tcb3ejmek",
//                 "index": "FINNIFTY",
//                 "indexToken": "26037",
//                 "contractType": -3,
//                 "contractToken": 0,
//                 "tsym": 1.5,
//                 "lotSize": 7,
//                 "createdAt": "2024-12-05T12:45:15.771Z",
//                 "updatedAt": "2024-12-05T12:45:15.771Z",
//                 "publishedAt": "2024-12-05T12:45:15.765Z"
//             },
//             {
//                 "id": 18,
//                 "documentId": "t3q1uu0a3c3hejvv0lmxkhw7",
//                 "index": "MIDCPNIFTY",
//                 "indexToken": "26014",
//                 "contractType": 15,
//                 "contractToken": -4.2,
//                 "tsym": 0,
//                 "lotSize": -12,
//                 "createdAt": "2024-12-05T12:45:30.310Z",
//                 "updatedAt": "2024-12-05T12:45:30.310Z",
//                 "publishedAt": "2024-12-05T12:45:30.303Z"
//             },
//             {
//                 "id": 19,
//                 "documentId": "b1l2ujcscxiiu6lzl5w16q7p",
//                 "index": "BANKNIFTY",
//                 "indexToken": "26009",
//                 "contractType": 8,
//                 "contractToken": 3.3,
//                 "tsym": -6.5,
//                 "lotSize": 5,
//                 "createdAt": "2024-12-05T12:45:42.295Z",
//                 "updatedAt": "2024-12-05T12:45:42.295Z",
//                 "publishedAt": "2024-12-05T12:45:42.290Z"
//             },
//             {
//                 "id": 20,
//                 "documentId": "fjdkyj6ibchfttx1fwcw1yz6",
//                 "index": "NIFTYNXT50",
//                 "indexToken": "26013",
//                 "contractType": -2,
//                 "contractToken": 4.7,
//                 "tsym": 6.1,
//                 "lotSize": 0,
//                 "createdAt": "2024-12-05T12:45:59.525Z",
//                 "updatedAt": "2024-12-05T12:45:59.525Z",
//                 "publishedAt": "2024-12-05T12:45:59.517Z"
//             }
//         ]
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching position data:", error);
//       }
//     };
//     handlePosition();
//   }, []);

//   const handleOpen = (item: PositionData) => {
//     setSelectedItem(item);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedItem(null);
//   };

//   const handleConfirm = async () => {
//     if (selectedItem) {
//       const placeholderpayload = {
//         contractType: `${selectedItem.contractType}`,
//         lp: `${isTypeindexload?.lp}`,
//         index: `${selectedItem.index}`,
//         indexToken: `${selectedItem.indexToken}`,
//         quantity: 1,
//       };

//       try {
//         await fetchpostplaceholder(placeholderpayload);
//         console.log("API call successful with payload:", placeholderpayload);
//       } catch (error) {
//         console.error("Error in fetchpostplaceholder:", error);
//       } finally {
//         handleClose();
//       }
//     }
//   };

//   return (
//     <Box sx={{ width: "100%", overflowX: "auto", margin: "16px 0" }}>
//       <ResponsiveTableContainer theme={theme}
//       >
//         <Paper elevation={3}>
//         <Typography
//           variant="h6"
//           component="div"
//           style={{ padding: "12px 16px", fontWeight: 600, color: "#555" }}
//         >
//           Positions Table
//         </Typography>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell style={{ fontWeight: "bold", color: "#777" }}>Index</TableCell>
//               <TableCell style={{ fontWeight: "bold", color: "#777" }}>Index Token</TableCell>
//               <TableCell style={{ fontWeight: "bold", color: "#777" }}>Lot Size</TableCell>
//               <TableCell style={{ fontWeight: "bold", color: "#777" }}>Tysm</TableCell>
//               <TableCell style={{ fontWeight: "bold", color: "#777" }}>Send</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {positions.map((item) =>{ 
//                 const islotsizePositive = parseFloat(item?.lotSize?.toString() || "0") > 0;
//                 const istsymPositive = parseFloat(item?.tsym?.toString() || "0") > 0;
//                 return (
//               <TableRow key={item.id}>
//                 <TableCell>
//                   <Box display="flex" alignItems="center">
//                     <Typography variant="body1" style={{ fontWeight: 500 }}>
//                       {item.index || "N/A"}
//                     </Typography>
//                   </Box>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body1">{item.indexToken || "N/A"}</Typography>
//                 </TableCell>
//                 <TableCell style={{ color: islotsizePositive ? "green" : "red", fontWeight: 500 }}>
//                   {item?.lotSize}
//                 </TableCell>
//                 <TableCell style={{ color: istsymPositive ? "green" : "red", fontWeight: 500 }}>
//                   {item?.tsym}%
//                 </TableCell>
//                 <TableCell>
//                   <Box onClick={() => handleOpen(item)}>
//                     <SendIcon sx={{ color: "rgb(128, 175, 233)", cursor: "pointer" }} />
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             )})}
//           </TableBody>
//         </Table>
//         </Paper>
//       </ResponsiveTableContainer>

//       {/* Confirmation Dialog */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="confirm-dialog-title"
//         aria-describedby="confirm-dialog-description"
//       >
//         <DialogTitle id="confirm-dialog-title">Confirm Action</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="confirm-dialog-description">
//             Are you sure you want to proceed with this action?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleConfirm} color="primary" autoFocus>
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Seller;


















// import React, { useEffect, useState } from "react";
// import { fetchPosition, fetchpostplaceholder } from "../../../api/Service/CommanServiceapi";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from "@mui/material";
// import { styled } from '@mui/system';
// import SendIcon from '@mui/icons-material/Send';
// import { useWebSocketMessages } from "../../../Webhooktypeprocess";


// const ResponsiveTableContainer = styled(TableContainer)(({ theme }) => ({
//     overflowX: 'auto',
//     maxWidth: '100%',
//     [theme.breakpoints.down('sm')]: {
//       maxWidth: '600px',
//       width: '100%',
//     },
//   }));

// interface PositionData {
//   id: number;
//   index: string;
//   indexToken: string;
//   contractType: string | null | number;
//   contractToken: string | null | number;
//   tsym: string | null | number;
//   lotSize: string | null | number;
// }

// const Seller = () => {
//   const [positions, setPositions] = useState<PositionData[]>([]);

//   const webhookdatas = useWebSocketMessages();
//   const webhookcontrol = webhookdatas.flat()
//   const isTypeindexload = webhookcontrol.find(
//     (item: any) => item?.type === 'variable' || item?.type === 'order'
//   )?.type;



//   const generateRandomPercentage = () => {
//     const change = (Math.random() * 2 - 1).toFixed(4);
//     const percentage = ((parseFloat(change) / 100) * 100).toFixed(2);
//     return { change, percentage };
//   };

//   useEffect(() => {
//     const handlePosition = async () => {
//       try {
//         const response = await fetchPosition();
//         console.log("Fetched position data: ", response?.data);
//         if (response?.data) {
//           // Filter out incomplete/missing values
//           const validData = response.data.filter(
//             (item: PositionData) =>
//               item.contractType &&
//               item.contractToken &&
//               item.tsym &&
//               item.lotSize
//           );
//           setPositions([...validData,
//             {
//             "id": 42,
//             "documentId": "xzb1jlccnqxl8lx2qevptdth",
//             "index": "NIFTY",
//             "indexToken": "26000",
//             "contractType": 9,
//             "contractToken": 2.4,
//             "tsym": 3.4,
//             "lotSize": -5,
//             "createdAt": "2024-12-05T12:45:01.497Z",
//             "updatedAt": "2024-12-13T03:54:45.953Z",
//             "publishedAt": "2024-12-13T03:54:45.942Z"
//         },
//         {
//             "id": 17,
//             "documentId": "m4q7tnerinpqun7tcb3ejmek",
//             "index": "FINNIFTY",
//             "indexToken": "26037",
//             "contractType": -3,
//             "contractToken": 0,
//             "tsym": 1.5,
//             "lotSize": 7,
//             "createdAt": "2024-12-05T12:45:15.771Z",
//             "updatedAt": "2024-12-05T12:45:15.771Z",
//             "publishedAt": "2024-12-05T12:45:15.765Z"
//         },
//         {
//             "id": 18,
//             "documentId": "t3q1uu0a3c3hejvv0lmxkhw7",
//             "index": "MIDCPNIFTY",
//             "indexToken": "26014",
//             "contractType": 15,
//             "contractToken": -4.2,
//             "tsym": 0,
//             "lotSize": -12,
//             "createdAt": "2024-12-05T12:45:30.310Z",
//             "updatedAt": "2024-12-05T12:45:30.310Z",
//             "publishedAt": "2024-12-05T12:45:30.303Z"
//         },
//         {
//             "id": 19,
//             "documentId": "b1l2ujcscxiiu6lzl5w16q7p",
//             "index": "BANKNIFTY",
//             "indexToken": "26009",
//             "contractType": 8,
//             "contractToken": 3.3,
//             "tsym": -6.5,
//             "lotSize": 5,
//             "createdAt": "2024-12-05T12:45:42.295Z",
//             "updatedAt": "2024-12-05T12:45:42.295Z",
//             "publishedAt": "2024-12-05T12:45:42.290Z"
//         },
//         {
//             "id": 20,
//             "documentId": "fjdkyj6ibchfttx1fwcw1yz6",
//             "index": "NIFTYNXT50",
//             "indexToken": "26013",
//             "contractType": -2,
//             "contractToken": 4.7,
//             "tsym": 6.1,
//             "lotSize": 0,
//             "createdAt": "2024-12-05T12:45:59.525Z",
//             "updatedAt": "2024-12-05T12:45:59.525Z",
//             "publishedAt": "2024-12-05T12:45:59.517Z"
//         }
//     ]);
//         }
//       } catch (error) {
//         console.error("Error fetching position data:", error);
//       }
//     };
//     handlePosition();
//   }, []);

//   const [open, setOpen] = useState(false);

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleConfirm = () => {
//     console.log("Confirmed!");
//     // Add your confirmation logic here
//     handleClose();
//   };
  
//   const handleItempoistion = async (item:PositionData) =>{
//     console.log("item datas : ", item)
    
//     const placeholderpayload:any = {
//         "contractType": `${item?.contractType}`,
//         "lp": `${isTypeindexload?.lp}`,
//         "index": `${item?.index}`,
//         "indexToken": `${item?.indexToken}`,
//         "quantity": 1
//     }

//     try {
//         await fetchpostplaceholder(placeholderpayload);
//     } catch (error) {
//         console.error("Error placeholder : ", error);
//       }
    
//   }

  

//   return (
//     <Box sx={{ width: "100%", overflowX: "auto", margin: "16px 0" }}>
//       <TableContainer
//         component={Paper}
//         elevation={3}
//         sx={{
//           width: "700px", // Table width
//           overflowX: "auto", // Horizontal scroll
//           borderRadius: "8px",
//         }}
//       >
//       <Typography
//         variant="h6"
//         component="div"
//         style={{ padding: "12px 16px", fontWeight: 600, color: "#555" }}
//       >
//         Positions Table
//       </Typography>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell style={{ fontWeight: "bold", color: "#777" }}>Index</TableCell>
//             <TableCell style={{ fontWeight: "bold", color: "#777" }}>Index Token</TableCell>
//             <TableCell style={{ fontWeight: "bold", color: "#777" }}>Lot Size</TableCell>
//             <TableCell style={{ fontWeight: "bold", color: "#777" }}>Tysm</TableCell>
//             <TableCell style={{ fontWeight: "bold", color: "#777" }}>Send</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {positions.map((item) => {
//             const { change, percentage } = generateRandomPercentage();
//             const islotsizePositive = parseFloat(item?.lotSize?.toString() || "0") > 0;
//             const istsymPositive = parseFloat(item?.tsym?.toString() || "0") > 0;

//             return (
//               <TableRow key={item.id}>
//                 {/* Index */}
//                 <TableCell>
//                   <Box display="flex" alignItems="center">
//                     <img
//                       src={`https://flagcdn.com/24x18/${item.index.toLowerCase().slice(0, 2)}.png`}
//                       alt={item.index}
//                       style={{
//                         width: "24px",
//                         height: "18px",
//                         marginRight: "8px",
//                         borderRadius: "4px",
//                       }}
//                     />
//                     <Typography variant="body1" style={{ fontWeight: 500 }}>
//                       {item.index || "N/A"}
//                     </Typography>
//                   </Box>
//                 </TableCell>

//                 {/* Index Token */}
//                 <TableCell>
//                   <Typography variant="body1">
//                     {item.indexToken || "N/A"}
//                   </Typography>
//                 </TableCell>

//                 {/* Change */}
//                 <TableCell style={{ color: islotsizePositive ? "green" : "red", fontWeight: 500 }}>
//                   {item?.lotSize}
//                 </TableCell>

//                 {/* Percentage */}
//                 <TableCell style={{ color: istsymPositive ? "green" : "red", fontWeight: 500 }}>
//                   {item?.tsym}%
//                 </TableCell>

//                 <TableCell style={{ color: '#fff', fontWeight: 500 }}>
//                   <Box onClick={()=>{handleItempoistion(item)}}><SendIcon sx={{color:'rgb(128, 175, 233)'}}/></Box>
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//       </TableContainer>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="confirm-dialog-title"
//         aria-describedby="confirm-dialog-description"
//       >
//         <DialogTitle id="confirm-dialog-title">Confirm Action</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="confirm-dialog-description">
//             Are you sure you want to proceed with this action?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleConfirm} color="primary" autoFocus>
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>
//       </Box>
//   );
// };

// export default Seller;











// import React, { useEffect } from 'react'
// import { fetchPosition } from '../../../api/Service/CommanServiceapi';

// const Seller = () => {

//     useEffect(()=>{
//         const handlePosition = async () => {
//             try {
//               const data = await fetchPosition();
          
//               console.log("Fetched position data: ", data?.data);
    
//               const { contractType, contractToken, tsym, lotSize } = data?.data?.map((item: any) => item);
          
//               if (!contractType || !contractToken || !tsym || !lotSize) {
//                 console.log("Not mentioned, one or more values are null.");
//               } else {
//                 console.log("Matched object:", contractType, contractToken, tsym, lotSize);
//               }
//             } catch (error) {
//               console.error("Error fetching position data:", error);
//             }
//           };
//         handlePosition()
//     })
    

//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Seller
