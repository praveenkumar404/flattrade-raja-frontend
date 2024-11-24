import React, { useEffect, useRef, useState } from 'react';
import { AppBar, Toolbar, IconButton, Badge, Popover, Typography, List, ListItem, ListItemText, Button, ListItemSecondaryAction, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularIntegration from './ReusabelCompoents/CircularIntegration';
import CheckIcon from '@mui/icons-material/Check';
import { useWebSocketMessages } from '../Webhooktypeprocess';

interface Notification {
  id: number;
  message: string;
}



const NotificationComponent: React.FC = () => {
  const webhookdatas = useWebSocketMessages();
  const webhookcontrol = webhookdatas.flat()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null); 

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Delete individual notification
  const handleDeleteNotification = (id: number) => {
    setTimeout(()=>{
        setNotifications((prevNotifications) => prevNotifications.filter(notification => notification.id !== id));
    },2000)
    
  };

  // Clear all notifications
  const handleClearAll = () => {
    setTimeout(()=>{
        setNotifications([]);
    },2000)
  };

  useEffect(() => {
    const uniqueNotifications = new Set(notifications.map((notif) => notif.message));
    
    webhookcontrol.forEach((item: any) => {
      if (item?.type === 'action' && !uniqueNotifications.has(item?.message)) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            id: prevNotifications.length > 0 ? prevNotifications[prevNotifications.length - 1].id + 1 : 1,
            message: item?.message,
          },
        ]);

        if (audioRef.current) {
          audioRef.current.play();
        }
      }
    });
  }, [webhookcontrol]);
  

  return (
    <>
      {/* AppBar with Notification Icon */}
      <Box>
        <>
          <IconButton color="inherit" onClick={handleNotificationClick}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </>
      </Box>

      {/* Notification Popover */}
      <audio ref={audioRef} src={require('../assets/audiofile/soundEffects/mixkit-bell-notification-933.wav')} preload="auto" />
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
              {notifications.map((notification) => (
                <ListItem key={notification.id}>
                  <ListItemText sx={{fontSize:'4px'}} primary={notification.message} />
                  {/* Delete Icon */}
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      {/* <DeleteIcon /> */}
                      <CircularIntegration
                            loadingDuration={3000}
                            fabColor="secondary"
                            fabIcon={<DeleteIcon sx={{color:'dodgerblue'}}/>}
                            successIcon={<CheckIcon sx={{color:'#e690ca'}}/>}
                            buttonText="Agree to Terms"
                            onAccept={() => handleDeleteNotification(notification.id)}
                        />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {/* Clear All Button */}
              <ListItem>
                <Button fullWidth color="error" variant="contained" onClick={handleClearAll}>
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
