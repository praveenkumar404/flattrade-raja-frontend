import React from 'react';
import { Alert, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get('message') || 'An error occurred';

  return (
    <Box sx={{ padding: '20px' }}>
      <h1>Error</h1>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
};

export default ErrorPage;














// import React from 'react';
// import { useLocation } from 'react-router-dom';

// const ErrorPage: React.FC = () => {
//   const location = useLocation();
//   const message = new URLSearchParams(location.search).get('message');

//   return (
//     <div>
//       <h1>Error</h1>
//       <p>{message || 'An error occurred during login.'}</p>
//     </div>
//   );
// };

// export default ErrorPage;
