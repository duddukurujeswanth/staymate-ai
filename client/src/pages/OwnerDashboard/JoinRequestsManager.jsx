import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../store/authSlice.js';
import { Check, X, ShieldAlert, Sparkles, Star, Calendar, Phone, Mail, FileText, UserCheck } from 'lucide-react';
import GlassCard from '../../components/GlassCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const JoinRequestsManager = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedLead, setSelectedLead] = useState(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [assignedRoomId, setAssignedRoomId] = useState('');

  const fetchData = async () => {
    try {
      const requestsRes = await axios.get(`${API_URL}/join-requests`);
      const roomsRes = await axios.get(`${API_URL}/rooms`);
      
      setRequests(requestsRes.data);
      setRooms(roomsRes.data);
    } catch (err) {
      console.warn('API error, using static fallback leads list.');
      setRequests([
        { id: 'jr1', name: 'John Doe', phone: '+91 9888123456', email: 'johndoe@gmail.com', occupation: 'Software Engineer', gender: 'Male', preferredSharing: '2 Sharing', preferredMoveInDate: '2026-07-05', message: 'Hi, I work at Google and am looking for a premium place with WiFi and a workspace.', status: 'Pending', createdAt: new Date().toISOString() }
      ]);
      setRooms([
        { id: 'r1', pgId: 'pg1', roomNumber: '101', sharingType: '1 Sharing', rent: 10000, totalBeds: 1, occupiedBeds: 1 },
        { id: 'r2', pgId: 'pg1', roomNumber: '102', sharingType: '2 Sharing', rent: 8000, totalBeds: 2, occupiedBeds: 1 },
        { id: 'r3', pgId: 'pg1', roomNumber: '103', sharingType: '3 Sharing', rent: 7000, totalBeds: 3, occupiedBeds: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenApprove = (lead) => {
    setSelectedLead(lead);
    setAssignedRoomId('');
    setApproveModalOpen(true);
  };

  const handleApproveConfirm = async (e) => {
    e.preventDefault();
    if (!assignedRoomId) return;
    setLoading(true);

    try {
      await axios.put(`${API_URL}/join-requests/${selectedLead.id}/status`, {
        status: 'Approved',
        roomId: assignedRoomId
      });
      fetchData();
      setApproveModalOpen(false);
    } catch (err) {
      console.error('Approve lead failed:', err);
      // Simulate state updates on failure/mock mode
      setRequests(prev => prev.map(r => r.id === selectedLead.id ? { ...r, status: 'Approved' } : r));
      setApproveModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (leadId) => {
    if (!window.confirm('Are you sure you want to reject this request?')) return;
    setLoading(true);
    try {
      await axios.put(`${API_URL}/join-requests/${leadId}/status`, {
        status: 'Rejected'
      });
      fetchData();
    } catch (err) {
      console.error('Reject lead failed:', err);
      setRequests(prev => prev.map(r => r.id === leadId ? { ...r, status: 'Rejected' } : r));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request card permanently?')) return;
    try {
      await axios.delete(`${API_URL}/join-requests/${id}`);
      fetchData();
    } catch (err) {
      console.error('Delete request card error:', err);
      setRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Pending': 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400',
      'Approved': 'bg-green-500/10 border border-green-500/20 text-green-400',
      'Rejected': 'bg-pink-500/10 border border-pink-500/20 text-pink-400'
    };
    return (
      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${styles[status] || styles.Pending}`}>
        {status}
      </span>
    );
  };

  // Filter rooms that match the lead preferred sharing type and are not fully occupied
  const vacantMatchingRooms = rooms.filter(r => 
    r.sharingType === selectedLead?.preferredSharing && 
    r.occupiedBeds < r.totalBeds
  );

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Join PG Inquiries</h1>
        <p className="text-slate-400 text-xs mt-1">Review incoming visitor booking cards, evaluate sharing options, and sign digital profiles.</p>
      </div>

      {/* Inquiries table list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-r-cyan-400 border-slate-700 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <GlassCard hoverEffect={false} className="border border-white/5 p-12 text-center">
          <Star className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-white text-base font-bold mb-1">No Booking Inquiries</h3>
          <p className="text-slate-400 text-xs">Prospective tenants will fill forms on your visitor site.</p>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {requests.map(lead => (
            <GlassCard key={lead.id} hoverEffect={false} className="border border-white/10 p-6 flex flex-col justify-between">
              
              {/* Card top */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white">{lead.name}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                      {lead.gender} • {lead.occupation || 'No Job Field'}
                    </span>
                    {getStatusBadge(lead.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-500" /> {lead.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" /> {lead.email}</span>
                  </div>
                </div>

                {/* Operations Actions */}
                {lead.status === 'Pending' ? (
                  <div className="flex gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenApprove(lead)}
                      className="px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(lead.id)}
                      className="px-3.5 py-1.5 bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 text-pink-400 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="p-2 bg-pink-500/5 hover:bg-pink-500/15 border border-pink-500/20 rounded-lg text-pink-400 transition"
                    title="Delete Request permanent"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Message content */}
              <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-3.5 text-xs text-slate-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Requested Layout</span>
                    <span className="font-bold text-cyan-400 mt-0.5 block">{lead.preferredSharing}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block sm:text-right uppercase">Move-In Target</span>
                    <span className="font-semibold text-slate-300 mt-0.5 block sm:text-right flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {lead.preferredMoveInDate}
                    </span>
                  </div>
                </div>

                {lead.message && (
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase mb-1">Message Note</span>
                    <p className="leading-relaxed p-3 rounded-lg bg-white/[0.02] border border-white/5 text-slate-400 italic">
                      "{lead.message}"
                    </p>
                  </div>
                )}
              </div>

            </GlassCard>
          ))}
        </div>
      )}

      {/* Approve Inquiry Modal */}
      <AnimatePresence>
        {approveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-neon-violet bg-brand-dark/95"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Lead Conversion Engine
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">Assign Room & Approve</h2>
                </div>
                <button onClick={() => setApproveModalOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleApproveConfirm} className="space-y-5">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applicant Name</span>
                    <span className="font-bold text-white">{selectedLead?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Requested Sharing</span>
                    <span className="font-bold text-cyan-400">{selectedLead?.preferredSharing}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Bed Assignment</label>
                  <select
                    value={assignedRoomId}
                    required
                    onChange={(e) => setAssignedRoomId(e.target.value)}
                    className="w-full p-3 bg-[#0d1321]/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  >
                    <option value="">Select Room</option>
                    {vacantMatchingRooms.map(room => (
                      <option key={room.id} value={room.id}>
                        Room {room.roomNumber} (Vacancy: {room.totalBeds - room.occupiedBeds} beds)
                      </option>
                    ))}
                    {vacantMatchingRooms.length === 0 && (
                      <option disabled>No vacant {selectedLead?.preferredSharing} rooms found!</option>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !assignedRoomId}
                  className="w-full py-3.5 rounded-xl font-bold bg-aurora-gradient text-white text-xs flex justify-center items-center gap-1.5 shadow-neon-violet transition disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border border-t-transparent animate-spin" />
                  ) : (
                    'Approve & Auto-Create Account'
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

export default JoinRequestsManager;
