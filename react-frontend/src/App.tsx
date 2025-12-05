import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Onboarding from './pages/Onboarding';
import RegisterInfo from './pages/RegisterInfo';
import CheckPhone from './pages/CheckPhone';
import AppointmentHistory from './pages/AppointmentHistory'; 
import Profile from './pages/Profile';
import AccountManager from './pages/AccountManager';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/register-info" element={<RegisterInfo />} />
        <Route path="/check-phone" element={<CheckPhone />} />
        <Route path="/account-manager" element={<AccountManager />} />

        {/* Layout có Footer */}
        <Route path="/" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="booking" element={<Booking />} />
          <Route path="appointments" element={<AppointmentHistory />} /> {/* <--- Route mới */}
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />

        </Route>

        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;