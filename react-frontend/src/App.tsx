import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Manager from './pages/Manager';


import Admin from './pages/Admin';
import ClinicInfoManager from './pages/ClinicInfoManager';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/clinic-info" element={<ClinicInfoManager />} /> 
        <Route path="/" element={<Login />} />
        <Route path="/manager" element={<Manager />} />
        
        {/* Fallback: Nếu gõ route linh tinh thì về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;