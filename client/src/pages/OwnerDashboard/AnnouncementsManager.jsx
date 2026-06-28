import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../store/authSlice.js';
import { Plus, Megaphone, Trash2, Calendar, Sparkles, X } from 'lucide-react';
import GlassCard from '../../components/GlassCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General'
  });

  const categories = ['Maintenance', 'Food', 'Internet', 'General'];

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API_URL}/announcements`);
      setAnnouncements(res.data);
    } catch (err) {
      console.warn('API error, using static fallback announcements.');
      setAnnouncements([
        { id: 'a1', title: 'Water Tank Cleaning Scheduled', content: 'The overhead water tanks for StayMate Elite will be cleaned tomorrow Sunday between 10:00 AM and 02:00 PM. Please store sufficient water.', category: 'Maintenance', createdAt: new Date(Date.now() - 12 * 3600000).toISOString() },
        { id: 'a2', title: 'WiFi Router Upgrade', content: 'We are upgrading the main broadband line on the rooftop to 1 Gbps today midnight. Expect a 10-minute network downtime.', category: 'Internet', createdAt: new Date(Date.now() - 36 * 3600000).toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleOpenAdd = () => {
    setFormData({ title: '', content: '', category: 'General' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/announcements`, formData);
      fetchAnnouncements();
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to submit announcement:', err);
      // Fallback
      setAnnouncements(prev => [
        { id: Math.random().toString(), createdAt: new Date().toISOString(), ...formData },
        ...prev
      ]);
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this broadcast card permanently?')) return;
    try {
      await axios.delete(`${API_URL}/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      console.error('Delete announcement failed:', err);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }
  };

  const getCategoryColor = (cat) => {
    const styles = {
      'Maintenance': 'text-orange-400 bg-orange-500/10 border border-orange-500/20',
      'Food': 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20',
      'Internet': 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20',
      'General': 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
    };
    return styles[cat] || styles.General;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Broadcast Alerts</h1>
          <p className="text-slate-400 text-xs mt-1">Compose news bulletins, select notification levels, and track active notices.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-aurora-gradient text-white rounded-xl text-xs font-bold shadow-neon-violet hover:opacity-95 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Compose Alert
        </button>
      </div>

      {/* Broadcasts Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-r-cyan-400 border-slate-700 animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <GlassCard hoverEffect={false} className="border border-white/5 p-12 text-center">
          <Megaphone className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-white text-base font-bold mb-1">No Broadcasts Active</h3>
          <p className="text-slate-400 text-xs">Announcements you compile will propagate to tenant boards instantly.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map(ann => (
            <GlassCard key={ann.id} hoverEffect={false} className="border border-white/10 flex flex-col justify-between p-6">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wide ${getCategoryColor(ann.category)}`}>
                    {ann.category}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1 rounded bg-pink-500/5 hover:bg-pink-500/15 border border-pink-500/20 text-pink-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-2 leading-snug">{ann.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{ann.content}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Compose Announcement Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-neon-violet bg-brand-dark/95"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Broadcast Engine
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">Compose Broadcast Notice</h2>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Notice Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Water Pump Repair Notice"
                    className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-[#0d1321]/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Broadcast Content</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Please explain the details of the notice clearly..."
                    rows="5"
                    className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold bg-aurora-gradient text-white text-xs flex justify-center items-center gap-1.5 shadow-neon-violet transition"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border border-t-transparent animate-spin" />
                  ) : (
                    'Publish Notice to Resident Boards'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AnnouncementsManager;
