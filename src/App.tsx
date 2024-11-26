import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DashboardLayoutPages from './components/DashboardLayoutPages';
import './assets/css/style.css'
import { useWebSocketMessages } from './Webhooktypeprocess';

const App: React.FC = () => {
  
  return (
    <>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<PrivateRoute component={DashboardLayoutPages} />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;