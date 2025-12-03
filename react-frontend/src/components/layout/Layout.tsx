import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans flex flex-col text-slate-800">
      <Header />
      <main className="w-full flex-grow pb-24 px-4 pt-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;