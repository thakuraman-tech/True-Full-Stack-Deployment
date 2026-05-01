import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <div className="flex bg-[#f9f8f6] dark:bg-[#121212] min-h-screen grain-bg text-slate-800 dark:text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 ml-[288px] flex flex-col min-h-screen p-6 pl-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto animate-fade-in mt-6 bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-xl border border-black/5 dark:border-white/5 shadow-sm rounded-[32px] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
