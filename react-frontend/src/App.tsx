import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Manager from './pages/Manager';
import Onboarding from './pages/Onboarding';
import RegisterInfo from './pages/RegisterInfo';
import AppointmentHistory from './pages/AppointmentHistory'; 
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import ClinicInfoManager from './pages/ClinicInfoManager';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Đưa Onboarding sang route riêng */}
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/register-info" element={<RegisterInfo />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/clinic-info" element={<ClinicInfoManager />} /> 
        <Route path="/login" element={<Login />} />

        {/* 2. Layout chính nằm ở root "/" */}
        <Route path="/" element={<Layout />}>
          {/* Thay "home" thành "index" để đây là trang mặc định khi vào "/" */}
          <Route index element={<Home />} />
          
          <Route path="booking" element={<Booking />} />
          <Route path="appointments" element={<AppointmentHistory />} /> 
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/manager" element={<Manager />} />
        
        {/* Fallback: Nếu gõ route linh tinh thì về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;