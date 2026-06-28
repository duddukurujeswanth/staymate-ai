import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../store/authSlice.js';
import { Plus, Trash2, Edit, Shuffle, Sparkles, X, Users, Search, DollarSign, ArrowRightLeft, UserCheck } from 'lucide-react';
import GlassCard from '../../components/GlassCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const TenantManager = () => {
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({
    name: '', email: '', password: 'password123', phone: '', pgId: '', roomId: ''
  });

  const [editForm, setEditForm] = useState({
    name: '', email: '', phone: '', rentPaid: false
  });

  const [transferState, setTransferState] = useState({
    tenantId: '',
    tenantName: '',
    currentRoomNumber: '',
    pgId: '',
    targetRoomId: ''
  });

  const fetchData = async () => {
    try {
      const tenantsRes = await axios.get(`${API_URL}/tenants`);
      const pgsRes = await axios.get(`${API_URL}/pgs`);
      const roomsRes = await axios.get(`${API_URL}/rooms`);
      
      setTenants(tenantsRes.data);
      setPgs(pgsRes.data);
      setRooms(roomsRes.data);
    } catch (err) {
      console.warn('API error, using static fallback tenants list.');
      setTenants([
        { id: 'u2', name: 'Alex Mercer', email: 'tenant@staymate.ai', phone: '+91 9988776655', pgId: 'pg1', roomId: 'r1', roomNumber: '101', sharingType: '1 Sharing', rentAmount: 10000, rentPaid: false, joiningDate: '2026-01-10T00:00:00.000Z' },
        { id: 'u3', name: 'Emma Watson', email: 'emma@gmail.com', phone: '+91 9123456780', pgId: 'pg1', roomId: 'r2', roomNumber: '102', sharingType: '2 Sharing', rentAmount: 8000, rentPaid: true, joiningDate: '2026-02-15T00:00:00.000Z' }
      ]);
      setPgs([{ id: 'pg1', name: 'StayMate Elite Coliving' }]);
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

  const handleOpenAdd = () => {
    setAddForm({
      name: '', email: '', password: 'password123', phone: '', pgId: pgs[0]?.id || '', roomId: ''
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (tenant) => {
    setEditingTenant(tenant);
    setEditForm({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone || '',
      rentPaid: tenant.rentPaid || false
    });
    setEditModalOpen(true);
  };

  const handleOpenTransfer = (tenant) => {
    setTransferState({
      tenantId: tenant.id,
      tenantName: tenant.name,
      currentRoomNumber: tenant.roomNumber || 'None',
      pgId: tenant.pgId || pgs[0]?.id || '',
      targetRoomId: ''
    });
    setTransferModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/tenants`, addForm);
      fetchData();
      setAddModalOpen(false);
    } catch (err) {
      console.error('Add tenant failed:', err);
      // Mock insert
      const room = rooms.find(r => r.id === addForm.roomId);
      const newTenant = {
        id: Math.random().toString(),
        name: addForm.name,
        email: addForm.email,
        phone: addForm.phone,
        pgId: addForm.pgId,
        roomId: addForm.roomId,
        roomNumber: room?.roomNumber || 'N/A',
        sharingType: room?.sharingType || 'N/A',
        rentAmount: room?.rent || 8000,
        rentPaid: false,
        joiningDate: new Date().toISOString()
      };
      setTenants(prev => [...prev, newTenant]);
      setAddModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${API_URL}/tenants/${editingTenant.id}`, editForm);
      fetchData();
      setEditModalOpen(false);
    } catch (err) {
      console.error('Edit tenant failed:', err);
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? { ...t, ...editForm } : t));
      setEditModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferState.targetRoomId) return;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/tenants/transfer`, {
        tenantId: transferState.tenantId,
        targetRoomId: transferState.targetRoomId
      });
      fetchData();
      setTransferModalOpen(false);
    } catch (err) {
      console.error('Transfer room failed:', err);
      // Simulate frontend update
      const room = rooms.find(r => r.id === transferState.targetRoomId);
      setTenants(prev => prev.map(t => {
        if (t.id === transferState.tenantId) {
          return {
            ...t,
            roomId: room.id,
            roomNumber: room.roomNumber,
            sharingType: room.sharingType,
            rentAmount: room.rent
          };
        }
        return t;
      }));
      setTransferModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this tenant from the system? This action will free up their bed immediately.')) return;
    try {
      await axios.delete(`${API_URL}/tenants/${id}`);
      fetchData();
    } catch (err) {
      console.error('Remove tenant error:', err);
      setTenants(prev => prev.filter(t => t.id !== id));
    }
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    (t.roomNumber && t.roomNumber.includes(search))
  );

  // Filter vacant rooms for target selection (same PG, has vacant beds)
  const availableTargetRooms = rooms.filter(r => 
    r.pgId === transferState.pgId && 
    r.occupiedBeds < r.totalBeds &&
    r.roomNumber !== transferState.currentRoomNumber
  );

  // Available rooms for add tenant selector
  const availableAddRooms = rooms.filter(r => 
    r.pgId === addForm.pgId && 
    r.occupiedBeds < r.totalBeds
  );

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Tenants Database</h1>
          <p className="text-slate-400 text-xs mt-1">Audit active tenants, register contracts, and transfer room allocations.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-aurora-gradient text-white rounded-xl text-xs font-bold shadow-neon-violet hover:opacity-95 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Tenant
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or room number..."
            className="w-full pl-10 p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
          />
        </div>
      </div>

      {/* Tenants Table Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-r-cyan-400 border-slate-700 animate-spin" />
        </div>
      ) : filteredTenants.length === 0 ? (
        <GlassCard hoverEffect={false} className="border border-white/5 p-12 text-center">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-white text-base font-bold mb-1">No Tenants Registered</h3>
          <p className="text-slate-400 text-xs">Create tenants manually or approve visitor join requests to populate tables.</p>
        </GlassCard>
      ) : (
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-glass">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-brand-card/80 text-slate-400 uppercase font-bold tracking-wider text-[10px]">
                  <th className="p-4 sm:p-5">Name / Contact</th>
                  <th className="p-4 sm:p-5">Room Assignment</th>
                  <th className="p-4 sm:p-5">Rent Amount</th>
                  <th className="p-4 sm:p-5">Billing Status</th>
                  <th className="p-4 sm:p-5">Joining Date</th>
                  <th className="p-4 sm:p-5 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-brand-dark/40">
                {filteredTenants.map(tenant => (
                  <tr key={tenant.id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4 sm:p-5">
                      <div className="font-bold text-white text-xs">{tenant.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{tenant.email} • {tenant.phone || 'No Phone'}</div>
                    </td>
                    <td className="p-4 sm:p-5">
                      {tenant.roomNumber ? (
                        <div>
                          <span className="font-semibold text-white">Room {tenant.roomNumber}</span>
                          <span className="block text-[10px] text-cyan-400 font-medium">{tenant.sharingType}</span>
                        </div>
                      ) : (
                        <span className="text-pink-400 font-semibold uppercase text-[9px] tracking-wide bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-full">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 font-semibold text-white">
                      ₹{(tenant.rentAmount || 8000).toLocaleString()}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${tenant.rentPaid ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'}`}>
                        {tenant.rentPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-slate-400">
                      {tenant.joiningDate ? new Date(tenant.joiningDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {tenant.roomNumber && (
                          <button
                            onClick={() => handleOpenTransfer(tenant)}
                            className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition"
                            title="Transfer Room"
                          >
                            <Shuffle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(tenant)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemove(tenant.id)}
                          className="p-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 transition"
                          title="Remove Tenant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-neon-violet bg-brand-dark/95"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Operations Registry
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">Register Tenant</h2>
                </div>
                <button onClick={() => setAddModalOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Tenant Name</label>
                  <input
                    type="text"
                    required
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    placeholder="Alex Mercer"
                    className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={addForm.email}
                      onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                      placeholder="alex@gmail.com"
                      className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                    <input
                      type="tel"
                      value={addForm.phone}
                      onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                      placeholder="+91 9988776655"
                      className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">PG Property</label>
                    <select
                      value={addForm.pgId}
                      onChange={(e) => setAddForm({ ...addForm, pgId: e.target.value, roomId: '' })}
                      className="w-full p-3 bg-[#0d1321]/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                    >
                      {pgs.map(pg => <option key={pg.id} value={pg.id}>{pg.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Room Assignment</label>
                    <select
                      value={addForm.roomId}
                      required
                      onChange={(e) => setAddForm({ ...addForm, roomId: e.target.value })}
                      className="w-full p-3 bg-[#0d1321]/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                    >
                      <option value="">Select Room</option>
                      {availableAddRooms.map(room => (
                        <option key={room.id} value={room.id}>
                          Room {room.roomNumber} ({room.sharingType} - Vacancy: {room.totalBeds - room.occupiedBeds})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold bg-aurora-gradient text-white text-xs flex justify-center items-center gap-1.5 shadow-neon-violet transition"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border border-t-transparent animate-spin" />
                  ) : (
                    'Add & Provision Login'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Tenant Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-neon-violet bg-brand-dark/95"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Operations editor
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">Edit Tenant Record</h2>
                </div>
                <button onClick={() => setEditModalOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Tenant Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                  <span className="text-xs font-semibold text-slate-300">Mark Rent as Paid</span>
                  <input
                    type="checkbox"
                    checked={editForm.rentPaid}
                    onChange={(e) => setEditForm({ ...editForm, rentPaid: e.target.checked })}
                    className="w-5 h-5 rounded border-white/10 bg-brand-dark text-purple-500 focus:ring-0 focus:outline-none cursor-pointer"
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
                    'Modify details'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Room Transfer Modal */}
      <AnimatePresence>
        {transferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-neon-violet bg-brand-dark/95"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5" /> Room Transfer Wizard
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">Transfer Room Assignment</h2>
                </div>
                <button onClick={() => setTransferModalOpen(false)} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-5">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Resident Name</span>
                    <span className="font-bold text-white">{transferState.tenantName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Room</span>
                    <span className="font-bold text-cyan-400">Room {transferState.currentRoomNumber}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Select Target Vacancy Room</label>
                  <select
                    value={transferState.targetRoomId}
                    required
                    onChange={(e) => setTransferState({ ...transferState, targetRoomId: e.target.value })}
                    className="w-full p-3 bg-[#0d1321]/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  >
                    <option value="">Select Vacant Room</option>
                    {availableTargetRooms.map(room => (
                      <option key={room.id} value={room.id}>
                        Room {room.roomNumber} ({room.sharingType} - Rent: ₹{room.rent} - Vacancy: {room.totalBeds - room.occupiedBeds})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !transferState.targetRoomId}
                  className="w-full py-3.5 rounded-xl font-bold bg-aurora-gradient text-white text-xs flex justify-center items-center gap-1.5 shadow-neon-violet transition disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border border-t-transparent animate-spin" />
                  ) : (
                    'Confirm Transfer Room'
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

export default TenantManager;
