import React, { useEffect, useRef, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemSecondaryAction,
  Box,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CircularIntegration from './ReusabelCompoents/CircularIntegration'; // Use your custom component
import { useWebSocketMessages } from '../Webhooktypeprocess';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { setNotifications } from '../redux/authSlice';

interface Notification {
  id: number;
  message: string;
  type: string; // Either "action" or "order"
}

const NotificationComponent: React.FC<any> = () => {
  const messages = useWebSocketMessages();
  const dispatch = useDispatch<any>();
  const notifications = useSelector((state: RootState) => state.auth.notifications);
  // const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  


  // Play sound when a new notification is added
  const playChime = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // // Add new notifications when messages are received
  // useEffect(() => {
  //   const filteredMessages = messages.filter(
  //     (msg) => msg?.type === 'action' || msg?.type === 'order'
  //   );

  //   filteredMessages.forEach((msg) => {

  //     const newNotification = {
  //       id: notifications.length > 0
  //         ? notifications[notifications.length - 1].id + 1
  //         : 1,
  //       message: msg.message,
  //       type: msg.type,
  //       currentdate: new Date().toLocaleDateString(), // Generate current date
  //       currenttime: new Date().toLocaleTimeString(), // Generate current time
  //     };
  //     dispatch(setNotifications([...notifications, newNotification]));

  //     setUnreadCount((prevCount) => prevCount + 1);
  //     playChime();
  //   });
  // }, [messages]);
  


//   Uncaught runtime errors:
// ×
// ERROR
// play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString();
  
    // Filter out notifications that are not from today
    const currentDayNotifications = notifications.filter(
      (notification) => notification.currentdate === currentDate
    );
  
    const filteredMessages = messages.filter(
      (msg) => msg?.type === 'action' || msg?.type === 'order'
    );
  
    const newNotifications = filteredMessages.map((msg) => ({
      id: currentDayNotifications.length > 0
        ? currentDayNotifications[currentDayNotifications.length - 1].id + 1
        : 1,
      message: msg?.message?.dmsg ? msg?.message?.dmsg : msg?.message,
      type: msg?.type,
      currentdate: currentDate,
      currenttime: new Date().toLocaleTimeString(),
    }));
  
    const updatedNotifications = [...currentDayNotifications, ...newNotifications];
  
    dispatch(setNotifications(updatedNotifications));
    setUnreadCount((prevCount) => prevCount + newNotifications.length);
  
    if (newNotifications.length > 0) {
      playChime();
    }
  }, [messages]);
  

  // Open/Close Popover
  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0); // Mark all as read when opened
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Delete individual notification
  const handleDeleteNotification = (id: number) => {
    // setNotifications((prevNotifications) =>
    //   prevNotifications.filter((notification) => notification.id !== id)
    // );
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    dispatch(setNotifications(updatedNotifications));

  };

  // Clear all notifications
  const handleClearAll = () => {
    // setNotifications([]);
    dispatch(setNotifications([]));

  };

  return (
    <>
      <Box>
        {/* Notification Bell Icon */}
        <IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={notifications?.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Notification Popover */}
      <audio
        ref={audioRef}
        src={require('../assets/audiofile/soundEffects/mixkit-bell-notification-933.wav')}
        preload="auto"
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Notifications
        </Typography>

        {/* List of Notifications */}
<List sx={{ width: '350px' }}>
  {notifications.length > 0 ? (
    <>
      {[...notifications] // Create a shallow copy to avoid modifying the original array
        .sort((a, b) => {
          const dateTimeA = new Date(`${a.currentdate} ${a.currenttime}`).getTime();
          const dateTimeB = new Date(`${b.currentdate} ${b.currenttime}`).getTime();
          return dateTimeB - dateTimeA; // Sort in descending order
        })
        .map((notification) => (
          <ListItem key={notification.id}>
            <ListItemText
              primary={notification.message}
              secondary={`${notification?.type} - ${notification?.currentdate} ${notification?.currenttime}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end">
                <img
                  style={{ height: '20px', width: '25px' }}
                  src="https://cdn.pixabay.com/photo/2012/05/07/02/13/cancel-47588_960_720.png"
                  alt="Delete"
                  onClick={()=>{handleDeleteNotification(notification.id)}}
                />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      {/* Clear All Button */}
      <ListItem>
        <Button
          fullWidth
          color="error"
          variant="contained"
          onClick={handleClearAll}
        >
          Clear All
        </Button>
      </ListItem>
    </>
  ) : (
    <ListItem>
      <ListItemText primary="No notifications" />
    </ListItem>
  )}
</List>

      </Popover>
    </>
  );
};

export default NotificationComponent;




















// import React, { useEffect, useRef, useState } from 'react';
// import { AppBar, Toolbar, IconButton, Badge, Popover, Typography, List, ListItem, ListItemText, Button, ListItemSecondaryAction, Box } from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CircularIntegration from './ReusabelCompoents/CircularIntegration';
// import CheckIcon from '@mui/icons-material/Check';
// import { useWebSocketMessages } from '../Webhooktypeprocess';

// interface Notification {
//   id: number;
//   message: string;
// }



// const NotificationComponent: React.FC = () => {
//   const webhookdatas = useWebSocketMessages();
//   const webhookcontrol = webhookdatas.flat()
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const audioRef = useRef<HTMLAudioElement | null>(null); 

//   const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popover' : undefined;

//   // Delete individual notification
//   const handleDeleteNotification = (id: number) => {
//     setTimeout(()=>{
//         setNotifications((prevNotifications) => prevNotifications.filter(notification => notification.id !== id));
//     },2000)
    
//   };

//   // Clear all notifications
//   const handleClearAll = () => {
//     setTimeout(()=>{
//         setNotifications([]);
//     },2000)
//   };

//   useEffect(() => {
//     const uniqueNotifications = new Set(notifications.map((notif) => notif.message));
    
//     webhookcontrol.forEach((item: any) => {
//       if ((item?.type === 'action' || item?.type === 'order') && !uniqueNotifications.has(item?.message)) {
//         setNotifications((prevNotifications) => [
//           ...prevNotifications,
//           {
//             id: prevNotifications.length > 0 ? prevNotifications[prevNotifications.length - 1].id + 1 : 1,
//             message: item?.message,
//           },
//         ]);

//         if (audioRef.current) {
//           audioRef.current.play();
//         }
//       }
//     });
//   }, [webhookcontrol]);
  

//   return (
//     <>
//       {/* AppBar with Notification Icon */}
//       <Box>
//         <>
//           <IconButton color="inherit" onClick={handleNotificationClick}>
//             <Badge badgeContent={notifications.length} color="error">
//               <NotificationsIcon />
//             </Badge>
//           </IconButton>
//         </>
//       </Box>

//       {/* Notification Popover */}
//       <audio ref={audioRef} src={require('../assets/audiofile/soundEffects/mixkit-bell-notification-933.wav')} preload="auto" />
//       <Popover
//         id={id}
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <Typography variant="h6" sx={{ p: 2 }}>
//           Notifications
//         </Typography>
        
//         {/* List of Notifications */}
//         <List sx={{ width: '350px' }}>
//           {notifications.length > 0 ? (
//             <>
//               {notifications.map((notification) => (
//                 <ListItem key={notification.id}>
//                   <ListItemText sx={{fontSize:'4px'}} primary={notification.message} />
//                   {/* Delete Icon */}
//                   <ListItemSecondaryAction>
//                     <IconButton edge="end">
//                       {/* <DeleteIcon /> */}
//                       <CircularIntegration
//                             loadingDuration={3000}
//                             fabColor="secondary"
//                             fabIcon={<DeleteIcon sx={{color:'dodgerblue'}}/>}
//                             successIcon={<CheckIcon sx={{color:'#e690ca'}}/>}
//                             buttonText="Agree to Terms"
//                             onAccept={() => handleDeleteNotification(notification.id)}
//                         />
//                     </IconButton>
//                   </ListItemSecondaryAction>
//                 </ListItem>
//               ))}
//               {/* Clear All Button */}
//               <ListItem>
//                 <Button fullWidth color="error" variant="contained" onClick={handleClearAll}>
//                   Clear All
//                 </Button>
//               </ListItem>
//             </>
//           ) : (
//             <ListItem>
//               <ListItemText primary="No notifications" />
//             </ListItem>
//           )}
//         </List>
//       </Popover>
//     </>
//   );
// };

// export default NotificationComponent;
