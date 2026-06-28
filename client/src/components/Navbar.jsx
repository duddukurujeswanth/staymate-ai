import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, Bell, User, LogOut, Menu, X, Shield, Settings, Sparkles } from 'lucide-react';
import { logout } from '../store/authSlice.js';
import NotificationCenter from './NotificationCenter.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const notifications = useSelector(state => state.notifications.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const dashboardLink = user?.role === 'owner' ? '/owner' : '/tenant';

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Rooms & Sharing', path: '/rooms' },
    { label: 'Amenities', path: '/amenities' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Join PG', path: '/join' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-brand-dark/75 backdrop-blur-glass border-b border-white/5' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-aurora-gradient flex items-center justify-center shadow-neon-violet group-hover:scale-105 transition-transform duration-300">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            StayMate<span className="text-cyan-400">.AI</span>
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-white/[0.03] rounded-full border border-white/5 backdrop-blur-xl">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/[0.06] border border-white/10 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Notification Button Wrapper */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="bell-trigger relative p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-slate-300 hover:text-white hover:bg-white/[0.07] transition-all duration-200"
                >
                  <Bell className="w-4 h-4 pointer-events-none" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-aurora-pink shadow-[0_0_8px_#EC4899] pointer-events-none" />
                  )}
                </button>

                <NotificationCenter isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
              </div>

              {/* Dashboard Link */}
              <Link
                to={dashboardLink}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] text-white transition-all duration-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Dashboard
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-500/20 hover:text-pink-300 transition-all duration-200"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/login?portal=owner"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-aurora-gradient hover:opacity-90 shadow-neon-violet text-white transition duration-200"
              >
                Owner Portal
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="bell-trigger relative p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-slate-300"
            >
              <Bell className="w-4 h-4 pointer-events-none" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-aurora-pink pointer-events-none" />
              )}
            </button>
          )}
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* MOBILE NOTIFICATION LAYER */}
      {isAuthenticated && (
        <div className="absolute right-6 top-16 md:hidden">
          <NotificationCenter isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
      )}

      {/* MOBILE MENU PANEL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-b border-white/10 overflow-hidden bg-brand-dark/95"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {menuItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-sm font-medium text-slate-300 hover:text-white py-1"
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-white/5 my-1" />
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link
                    to={dashboardLink}
                    className="flex justify-center items-center gap-2 w-full py-2.5 rounded-xl bg-aurora-gradient text-white text-sm font-semibold shadow-neon-violet"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Enter Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex justify-center items-center gap-2 w-full py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-pink-400 text-sm font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 rounded-xl text-slate-300 text-sm font-semibold hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login?portal=owner"
                    className="w-full text-center py-2.5 rounded-xl bg-aurora-gradient text-white text-sm font-semibold shadow-neon-violet"
                  >
                    Owner Portal
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
