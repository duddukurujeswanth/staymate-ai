import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, Check, Trash2, ShieldAlert, Star, Megaphone } from 'lucide-react';
import { markAsRead, markAllAsRead, clearNotification } from '../store/notificationSlice.js';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCenter = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        // If clicked on the bell button itself, ignore click-outside to let button handler toggle state
        if (!event.target.closest('.bell-trigger')) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'complaint':
        return <ShieldAlert className="w-4 h-4 text-pink-500" />;
      case 'request':
        return <Star className="w-4 h-4 text-cyan-400" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-yellow-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2.5 w-80 glass-panel rounded-2xl shadow-glass overflow-hidden z-50 border border-white/10">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-brand-card/85">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <span className="bg-aurora-pink text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={() => dispatch(markAllAsRead())}
            className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
          >
            <Check className="w-3 h-3" /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-72 overflow-y-auto bg-brand-dark/95">
        <AnimatePresence initial={false}>
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No new alerts. You're all caught up! 🎉
            </div>
          ) : (
            notifications.map(n => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-3 border-b border-white/5 flex gap-3 items-start transition-colors duration-200 ${!n.read ? 'bg-white/[0.03]' : ''}`}
              >
                <div className="p-2 bg-white/[0.05] rounded-lg mt-0.5 shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <p className={`text-xs font-semibold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>{n.title}</p>
                    <button 
                      onClick={() => dispatch(clearNotification(n.id))}
                      className="text-slate-500 hover:text-slate-300 p-0.5 rounded shrink-0 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[9px] text-slate-500">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!n.read && (
                      <button 
                        onClick={() => dispatch(markAsRead(n.id))}
                        className="text-[9px] text-cyan-400 hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationCenter;
