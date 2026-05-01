import React, { useContext, useState, useRef, useEffect } from 'react';
import { Moon, Sun, Bell, CheckCircle, Info } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const Topbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Mock notifications
  const notifications = [
    { id: 1, text: 'New task "Update wireframes" assigned to you', time: '10 min ago', unread: true, type: 'info' },
    { id: 2, text: 'Project "Website Redesign" was updated', time: '1 hour ago', unread: false, type: 'success' },
    { id: 3, text: 'Welcome to Ethara!', time: '1 day ago', unread: false, type: 'info' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-xl border border-black/5 dark:border-white/5 shadow-sm rounded-[32px] sticky top-6 z-10">
      <div className="flex-1">
         <h2 className="text-xl font-medium text-slate-500 dark:text-slate-400">Welcome back, <span className="font-semibold text-slate-800 dark:text-white">{user?.name?.split(' ')[0] || 'User'}</span></h2>
      </div>
      
      <div className="flex items-center space-x-5">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all hover-scale"
        >
          {darkMode ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-black/5 dark:hover:text-white dark:hover:bg-white/5 transition-all hover-scale"
          >
            <Bell size={20} strokeWidth={1.5} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white dark:border-[#1a1a1a]"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#232323] rounded-[24px] shadow-2xl border border-black/5 dark:border-white/5 animate-fade-in overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
                <span className="text-xs text-primary-500 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(note => (
                  <div key={note.id} className={`p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${note.unread ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}`}>
                    <div className="mt-0.5">
                      {note.type === 'success' ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <Info size={16} className="text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm ${note.unread ? 'text-slate-800 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-300'}`}>{note.text}</p>
                      <p className="text-xs text-slate-400 mt-1">{note.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">View all</span>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-primary-500 transition-colors">{user?.name}</p>
            <p className="text-xs text-slate-400 font-medium">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold shadow-sm transition-transform group-hover:scale-105">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
