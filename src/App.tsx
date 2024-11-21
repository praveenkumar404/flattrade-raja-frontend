import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardLayoutPages from './components/DashboardLayoutPages';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<PrivateRoute component={DashboardLayoutPages} />} />
      </Routes>
    </Router>
  );
};

export default App;













// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import PrivateRoute from './PrivateRoute';

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;















// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import PrivateRoute from './PrivateRoute';

// const App: React.FC = () => {
//   return (
//     <div>
//       <h1>Flattrade Authentication</h1>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;













// import React from 'react';
// import { Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import PrivateRoute from './PrivateRoute';
// import { Box } from '@mui/material';

// const App: React.FC = () => {
//   return (
//     <Box>
//       <Box sx={{padding:'20px',paddingX:'50px'}}>
//         <h1>Flattrade Applications</h1>
//       </Box>
//       <Box>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
//         </Routes>
//       </Box>
//     </Box>
//   );
// };

// export default App;
