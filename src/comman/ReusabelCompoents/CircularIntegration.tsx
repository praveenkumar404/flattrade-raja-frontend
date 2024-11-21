import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green, red } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import '../../assets/css/Reusablecomponents/CircularIntegration.css'

interface CircularIntegrationProps {
  loadingDuration?: number; // Duration for loading in milliseconds
  fabColor?: 'primary' | 'secondary'; // Fab color
  fabIcon?: React.ReactNode; // Icon for the Fab
  successIcon?: React.ReactNode; // Icon to show on success
  buttonText?: string; // Text for the button
  onAccept?: () => void; // Callback for button click
}

const CircularIntegration: React.FC<CircularIntegrationProps> = ({
  loadingDuration = 2000,
  fabColor = 'primary',
  fabIcon = <SaveIcon />,
  successIcon = <CheckIcon />,
  buttonText = 'Accept terms',
  onAccept,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const buttonSx = {
    ...(success && {
      bgcolor: red[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        if (onAccept) {
          onAccept(); // Call the accept callback
        }
      }, loadingDuration);
    }
  };

  return (
    <Box className="circularintergrationdeletebg">
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ m:'2px', position: 'relative' }}>
        <Fab
          color={fabColor}
          sx={buttonSx}
          onClick={handleButtonClick}
        >
          {success ? successIcon : fabIcon}
        </Fab>
        {loading && (
          <CircularProgress
            size={38}
            sx={{
              color: green[500],
              position: 'absolute',
              top: 7,
              left: 7,
              zIndex: 1,
            }}
          />
        )}
      </Box>
    </Box>
    </Box>
  );
};

export default CircularIntegration;
