import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../store/authSlice.js';
import { Search, Filter, ShieldAlert, X, ChevronRight, Calendar, AlertCircle, FileText, CheckCircle2, Clock } from 'lucide-react';
import GlassCard from '../../components/GlassCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [closingTicketId, setClosingTicketId] = useState('');

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API_URL}/complaints/my`);
      setComplaints(res.data);
    } catch (err) {
      console.warn('API fetch failed, falling back to mock tickets.');
      setComplaints([
        {
          id: 'c1',
          title: 'WiFi speed is dropping frequently',
          description: 'The router on the 1st floor drops connectivity during office hours. Video calls keep buffering.',
          category: 'WiFi',
          priority: 'High',
          status: 'In Progress',
          imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
          logs: [
            { status: 'Open', date: new Date(Date.now() - 86400000).toISOString(), comment: 'Complaint submitted' },
            { status: 'In Progress', date: new Date().toISOString(), comment: 'Technician scheduled for 4 PM visit' }
          ],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'c2',
          title: 'Water tap leaking in washroom',
          description: 'The bathroom basin tap is constantly dripping water. Needs washer replacement.',
          category: 'Water',
          priority: 'Medium',
          status: 'Resolved',
          imageUrl: '',
          logs: [
            { status: 'Open', date: new Date(Date.now() - 172800000).toISOString(), comment: 'Complaint submitted' },
            { status: 'In Progress', date: new Date(Date.now() - 86400000).toISOString(), comment: 'Plumber assigned' },
            { status: 'Resolved', date: new Date().toISOString(), comment: 'Tap washer replaced. Leak fixed.' }
          ],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleCloseTicket = async (ticketId) => {
    setClosingTicketId(ticketId);
    try {
      await axios.put(`${API_URL}/complaints/${ticketId}/status`, {
        status: 'Closed',
        comment: 'Resolved ticket confirmed and closed by resident.'
      });
      fetchComplaints();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => ({
          ...prev,
          status: 'Closed',
          logs: [...prev.logs, { status: 'Closed', date: new Date().toISOString(), comment: 'Resolved ticket confirmed and closed by resident.' }]
        }));
      }
    } catch (err) {
      console.error('Failed to close complaint:', err);
      // Mock update
      setComplaints(prev => prev.map(c => {
        if (c.id === ticketId) {
          const updated = {
            ...c,
            status: 'Closed',
            logs: [...c.logs, { status: 'Closed', date: new Date().toISOString(), comment: 'Resolved ticket confirmed and closed by resident.' }]
          };
          if (selectedTicket?.id === ticketId) setSelectedTicket(updated);
          return updated;
        }
        return c;
      }));
    } finally {
      setClosingTicketId('');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Open': 'bg-purple-500/10 border border-purple-500/20 text-purple-400',
      'In Progress': 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400',
      'Resolved': 'bg-green-500/10 border border-green-500/20 text-green-400',
      'Closed': 'bg-slate-500/10 border border-slate-500/20 text-slate-400'
    };
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${styles[status] || styles.Open}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      'Low': 'bg-slate-500/10 text-slate-400',
      'Medium': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      'High': 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      'Urgent': 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
    };
    return (
      <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wide ${styles[priority] || styles.Medium}`}>
        {priority}
      </span>
    );
  };

  const filtered = complaints.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Your Support Tickets</h1>
        <p className="text-slate-400 text-xs mt-1">Track active investigations and inspect previous resolutions.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket summary or category..."
            className="w-full pl-10 p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
          />
        </div>
      </div>

      {/* Ticket List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-r-cyan-400 border-slate-700 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard hoverEffect={false} className="border border-white/5 p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-bounce" />
          <h3 className="text-white text-base font-bold mb-1">No complaints yet 🎉</h3>
          <p className="text-slate-400 text-xs">Enjoy your peaceful stay in our PG spaces.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filtered.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/20 hover:bg-white/[0.03] transition duration-300 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-2 border-l-purple-500"
            >
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] text-slate-500 font-mono">#{ticket.id}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-bold uppercase tracking-wider text-cyan-400">{ticket.category}</span>
                  {getPriorityBadge(ticket.priority)}
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">{ticket.title}</h3>
                <span className="block mt-2 text-[9px] text-slate-500">Submitted: {new Date(ticket.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                {getStatusBadge(ticket.status)}
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Slide Drawer Details */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setSelectedTicket(null)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-full max-w-lg bg-brand-dark border-l border-white/10 p-6 md:p-8 flex flex-col justify-between h-full relative z-10 shadow-glass overflow-y-auto"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono">TICKET DETAILS #{selectedTicket.id}</span>
                    <h2 className="text-lg font-bold text-white mt-1.5">{selectedTicket.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Info Badges */}
                <div className="flex gap-2.5 mb-6 flex-wrap">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-400 font-bold uppercase tracking-wider">
                    Category: {selectedTicket.category}
                  </span>
                  {getPriorityBadge(selectedTicket.priority)}
                  {getStatusBadge(selectedTicket.status)}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-xs text-slate-300 leading-relaxed p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    {selectedTicket.description}
                  </p>
                </div>

                {/* Image Snapshot */}
                {selectedTicket.imageUrl && (
                  <div className="mb-6">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">Snapshot Snapshot</h4>
                    <div className="rounded-xl overflow-hidden border border-white/5 aspect-video">
                      <img src={selectedTicket.imageUrl} alt="attached details" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {/* Resolution timeline log */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Resolution History Log</h4>
                  <div className="relative pl-6 space-y-5 border-l border-white/5">
                    {selectedTicket.logs?.map((log, lidx) => (
                      <div key={lidx} className="relative">
                        {/* Circle bullet */}
                        <div className="absolute -left-[30px] top-0.5 w-2 h-2 rounded-full bg-purple-500 border-4 border-brand-dark" />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-white">{log.status}</span>
                          <span className="text-[9px] text-slate-500">
                            {new Date(log.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{log.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Drawer Footer / Closing Action */}
              {selectedTicket.status === 'Resolved' && (
                <div className="pt-6 border-t border-white/5 mt-8">
                  <button
                    onClick={() => handleCloseTicket(selectedTicket.id)}
                    disabled={closingTicketId === selectedTicket.id}
                    className="w-full py-3 rounded-xl font-bold bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 text-xs flex justify-center items-center gap-1.5 transition"
                  >
                    {closingTicketId === selectedTicket.id ? (
                      <div className="w-4 h-4 rounded-full border border-t-transparent animate-spin" />
                    ) : (
                      'Accept Resolution & Close Ticket'
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyComplaints;
