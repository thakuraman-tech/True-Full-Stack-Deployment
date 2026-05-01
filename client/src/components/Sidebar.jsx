import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClasses = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
      isActive
        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg scale-[1.02]'
        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
    }`;

  return (
    <aside className="w-64 fixed left-6 top-6 bottom-6 flex flex-col z-20">
      <div className="flex-1 bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-xl border border-black/5 dark:border-white/5 shadow-sm rounded-[32px] flex flex-col overflow-hidden">
        <div className="p-8 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shadow-[0_4px_12px_rgba(224,106,83,0.3)]">
            <span className="text-white font-bold text-xl tracking-tight">E</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-white">Ethara</h1>
        </div>

        <nav className="flex-1 px-6 space-y-3 mt-4">
          <NavLink to="/dashboard" className={navClasses}>
            <LayoutDashboard size={20} strokeWidth={1.5} />
            <span className="font-medium">Dashboard</span>
          </NavLink>
          <NavLink to="/projects" className={navClasses}>
            <FolderKanban size={20} strokeWidth={1.5} />
            <span className="font-medium">Projects</span>
          </NavLink>
        </nav>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center space-x-2 px-4 py-3.5 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
