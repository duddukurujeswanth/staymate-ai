import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, ShieldAlert, ClipboardList, Megaphone, User, LogOut, Menu, X, AppWindow, Bell } from 'lucide-react';
import { logout } from '../../store/authSlice.js';
import NotificationCenter from '../../components/NotificationCenter.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const TenantLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const notifications = useSelector(state => state.notifications.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', path: '/tenant', icon: <AppWindow className="w-4 h-4" /> },
    { label: 'Raise Complaint', path: '/tenant/raise-complaint', icon: <ShieldAlert className="w-4 h-4" /> },
    { label: 'My Complaints', path: '/tenant/my-complaints', icon: <ClipboardList className="w-4 h-4" /> },
    { label: 'Announcements', path: '/tenant/announcements', icon: <Megaphone className="w-4 h-4" /> },
    { label: 'Profile Settings', path: '/tenant/profile', icon: <User className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col md:flex-row relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-purple-500/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-cyan-500/5 blur-[90px] pointer-events-none" />

      {/* MOBILE HEADER */}
      <header className="md:hidden glass-panel border-b border-white/5 py-4 px-6 flex justify-between items-center z-30 bg-brand-dark/95">
        <Link to="/" className="flex items-center gap-1.5">
          <span className="font-extrabold text-base tracking-tight text-white">
            StayMate<span className="text-cyan-400">.AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="bell-trigger relative p-2 rounded-lg bg-white/[0.03] border border-white/5 text-slate-300"
          >
            <Bell className="w-4 h-4 pointer-events-none" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 pointer-events-none" />}
          </button>
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-slate-300"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE NOTIFICATION OVERLAY */}
      {notifOpen && (
        <div className="absolute right-6 top-16 md:hidden z-50">
          <NotificationCenter isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
      )}

      {/* SIDEBAR ON DESKTOP & SLIDE OUT ON MOBILE */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 glass-panel border-r border-white/5 z-40 bg-brand-dark/95 p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Logo */}
          <Link to="/" className="hidden md:flex items-center gap-2 mb-8 group">
            <div className="w-8 h-8 rounded-lg bg-aurora-gradient flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              StayMate<span className="text-cyan-400">.AI</span>
            </span>
          </Link>

          {/* User Profile Card */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-extrabold text-sm flex items-center justify-center uppercase shrink-0">
              {user?.name?.[0] || 'T'}
            </div>
            <div className="min-w-0">
              <h5 className="text-white text-xs font-bold truncate leading-tight">{user?.name}</h5>
              <span className="text-[10px] text-cyan-400 font-medium">Resident ({user?.roomNumber ? `Rm ${user.roomNumber}` : 'Unassigned'})</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${isActive ? 'bg-aurora-gradient text-white shadow-neon-violet border border-transparent' : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'}`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* DASHBOARD CONTENT CONTAINER */}
      <main className="flex-1 p-6 md:p-10 min-w-0">
        
        {/* DESKTOP HEADER ACTION */}
        <div className="hidden md:flex justify-end items-center gap-4 mb-8">
          <div className="relative">
            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="bell-trigger relative p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-300 hover:text-white hover:bg-white/[0.05] transition"
            >
              <Bell className="w-5 h-5 pointer-events-none" />
              {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_#EC4899] pointer-events-none" />}
            </button>
            <NotificationCenter isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
          </div>
          <Link
            to="/tenant/profile"
            className="flex items-center gap-2 p-1.5 pr-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">
              {user?.name?.[0]}
            </div>
            <span className="text-xs font-semibold text-white">{user?.name}</span>
          </Link>
        </div>

        <Outlet />
      </main>

    </div>
  );
};

export default TenantLayout;
