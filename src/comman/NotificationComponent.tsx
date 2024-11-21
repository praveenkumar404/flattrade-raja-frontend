import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Badge, Popover, Typography, List, ListItem, ListItemText, Button, ListItemSecondaryAction, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularIntegration from './ReusabelCompoents/CircularIntegration';
import CheckIcon from '@mui/icons-material/Check';

interface Notification {
  id: number;
  message: string;
}

const notificationsData: Notification[] = [
  { id: 1, message: "New message from John" },
  { id: 2, message: "Server downtime alert" },
  { id: 3, message: "New task assigned to you" },
  { id: 4, message: "New task assigned to me" },
];

const NotificationComponent: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);

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
        <List sx={{ width: '300px' }}>
          {notifications.length > 0 ? (
            <>
              {notifications.map((notification) => (
                <ListItem key={notification.id}>
                  <ListItemText primary={notification.message} />
                  {/* Delete Icon */}
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      {/* <DeleteIcon /> */}
                      <CircularIntegration
                            loadingDuration={3000}
                            fabColor="secondary"
                            fabIcon={<DeleteIcon sx={{color:'#ff00ff'}}/>}
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
