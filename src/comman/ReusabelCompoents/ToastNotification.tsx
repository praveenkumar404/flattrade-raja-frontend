import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ToastProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  btnchoice?: {
    sendbtn?: {
      showbtn:boolean,
      btnlabelname:any,
      btnonClick: () => void;
    },
    cancelbtn?: {
      showbtn:boolean,
      btnlabelname:any,
      btnonClick: () => void;
    }
  }
}

const ToastNotification: React.FC<ToastProps> = ({ open, message, severity = 'info', onClose, btnchoice }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        <div>{message}</div>

        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          {btnchoice?.sendbtn?.showbtn && (
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={btnchoice.sendbtn.btnonClick}
            >
              {btnchoice.sendbtn.btnlabelname}
            </Button>
          )}
          {btnchoice?.cancelbtn?.showbtn && (
            <Button
              variant="contained"
              color="secondary"
              onClick={btnchoice.cancelbtn.btnonClick}
            >
              {btnchoice.cancelbtn.btnlabelname}
            </Button>
          )}
          </div>
        {/* <Button variant="contained" endIcon={<SendIcon />}>
          Send
        </Button>
        <Button variant="contained" endIcon={<SendIcon />}>
          Cancel
        </Button> */}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
