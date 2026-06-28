import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../store/authSlice.js';
import { Plus, Edit, Trash2, Bed, Sparkles, X, LayoutGrid } from 'lucide-react';
import GlassCard from '../../components/GlassCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';

// Visual bed indicators
const OccupancyBedsGrid = ({ occupied, total }) => {
  return (
    <div className="flex gap-1.5 mt-2">
      {[...Array(total)].map((_, i) => {
        const isOccupied = i < occupied;
        return (
          <div 
            key={i} 
            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${isOccupied ? 'bg-purple-600/30 border-purple-500 text-purple-400' : 'bg-white/[0.02] border-white/10 text-slate-600'}`}
          >
            <Bed className="w-3 h-3" />
          </div>
        );
      })}
    </div>
  );
};

const RoomManager = () => {
  const [pgs, setPgs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedPgId, setSelectedPgId] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    pgId: '',
    roomNumber: '',
    sharingType: '2 Sharing',
    rent: '',
    totalBeds: 2
  });

  const fetchRoomsAndPgs = async () => {
    try {
      const pgsRes = await axios.get(`${API_URL}/pgs`);
      const roomsRes = await axios.get(`${API_URL}/rooms`);
      
      setPgs(pgsRes.data);
      setRooms(roomsRes.data);
      if (pgsRes.data.length > 0 && !selectedPgId) {
        setSelectedPgId(pgsRes.data[0].id);
      }
    } catch (err) {
      console.warn('API error, using static fallback rooms.');
      const mockPgs = [
        { id: 'pg1', name: 'StayMate Elite Coliving' },
        { id: 'pg2', name: 'StayMate Premium Suites' }
      ];
      const mockRooms = [
        { id: 'r1', pgId: 'pg1', roomNumber: '101', sharingType: '1 Sharing', rent: 10000, totalBeds: 1, occupiedBeds: 1 },
        { id: 'r2', pgId: 'pg1', roomNumber: '102', sharingType: '2 Sharing', rent: 8000, totalBeds: 2, occupiedBeds: 1 },
        { id: 'r3', pgId: 'pg1', roomNumber: '103', sharingType: '3 Sharing', rent: 7000, totalBeds: 3, occupiedBeds: 0 },
        { id: 'r4', pgId: 'pg2', roomNumber: '201', sharingType: '2 Sharing', rent: 9000, totalBeds: 2, occupiedBeds: 0 }
      ];
      setPgs(mockPgs);
      setRooms(mockRooms);
      if (!selectedPgId) setSelectedPgId(mockPgs[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomsAndPgs();
  }, []);

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      pgId: selectedPgId || pgs[0]?.id || '',
      roomNumber: '',
      sharingType: '2 Sharing',
      rent: '',
      totalBeds: 2
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      pgId: room.pgId,
      roomNumber: room.roomNumber,
      sharingType: room.sharingType,
      rent: room.rent.toString(),
      totalBeds: room.totalBeds
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingRoom) {
        // Edit Mode
        await axios.put(`${API_URL}/rooms/${editingRoom.id}`, {
          ...formData,
          rent: Number(formData.rent),
          totalBeds: Number(formData.totalBeds)
        });
      } else {
        // Add Mode
        await axios.post(`${API_URL}/rooms`, {
          ...formData,
          rent: Number(formData.rent),
          totalBeds: Number(formData.totalBeds)
        });
      }
      fetchRoomsAndPgs();
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to submit Room:', err);
      // Fallback frontend update
      if (editingRoom) {
        setRooms(prev => prev.map(r => r.id === editingRoom.id ? { ...r, ...formData, rent: Number(formData.rent), totalBeds: Number(formData.totalBeds) } : r));
      } else {
        setRooms(prev => [...prev, { id: Math.random().toString(), occupiedBeds: 0, ...formData, rent: Number(formData.rent), totalBeds: Number(formData.totalBeds) }]);
      }
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room? Operating indices will rebuild occupancy counts.')) return;
    try {
      await axios.delete(`${API_URL}/rooms/${id}`);
      fetchRoomsAndPgs();
    } catch (err) {
      console.error('Delete room failed:', err);
      setRooms(prev => prev.filter(r => r.id !== id));
    }
  };

  const activePg = pgs.find(p => p.id === selectedPgId);
  const filteredRooms = rooms.filter(r => r.pgId === selectedPgId);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Rooms Configuration</h1>
          <p className="text-slate-400 text-xs mt-1">Manage single, double, triple, and quad sharing room occupancy layouts.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-aurora-gradient text-white rounded-xl text-xs font-bold shadow-neon-violet hover:opacity-95 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* PG Selector Tab Headers */}
      {pgs.length > 1 && (
        <div className="flex flex-wrap gap-3 mb-10">
          {pgs.map(pg => (
            <button
              key={pg.id}
              onClick={() => setSelectedPgId(pg.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${selectedPgId === pg.id ? 'bg-aurora-gradient text-white border-transparent shadow-neon-violet scale-102' : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'}`}
            >
              {pg.name}
            </button>
          ))}
        </div>
      )}

      {/* Rooms Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-r-cyan-400 border-slate-700 animate-spin" />
        </div>
      ) : filteredRooms.length === 0 ? (
        <GlassCard hoverEffect={false} className="border border-white/5 p-12 text-center">
          <LayoutGrid className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-white text-base font-bold mb-1">No Rooms Configured</h3>
          <p className="text-slate-400 text-xs mb-6">Register rooms under this PG to begin lodging residents.</p>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-aurora-gradient text-white text-xs font-bold rounded-xl shadow-neon-violet"
          >
            Add Room Number
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => {
            const isFull = room.occupiedBeds >= room.totalBeds;
            return (
              <GlassCard key={room.id} hoverEffect={false} className="border border-white/10 p-6 flex flex-col justify-between rounded-xl">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">Room {room.roomNumber}</h3>
                      <span className="text-[10px] text-cyan-400 font-semibold">{room.sharingType}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(room)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="p-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="my-5">
                    <span className="text-xl font-bold text-white">₹{room.rent.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 font-normal"> / mo</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Occupancy</span>
                    <span className={`text-[9px] font-bold ${isFull ? 'text-pink-400' : 'text-cyan-400'}`}>
                      {room.occupiedBeds} / {room.totalBeds} Beds
                    </span>
                  </div>
                  <OccupancyBedsGrid occupied={room.occupiedBeds} total={room.totalBeds} />
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Add/Edit modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-neon-violet bg-brand-dark/95"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Room Design Systems
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">{editingRoom ? 'Modify Room Info' : 'Add New Room'}</h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">PG Property Location</label>
                  <select
                    value={formData.pgId}
                    onChange={(e) => setFormData({ ...formData, pgId: e.target.value })}
                    className="w-full p-3 bg-[#0d1321]/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  >
                    {pgs.map(pg => <option key={pg.id} value={pg.id}>{pg.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Room Number</label>
                    <input
                      type="text"
                      required
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      placeholder="101"
                      className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Sharing Type</label>
                    <select
                      value={formData.sharingType}
                      onChange={(e) => setFormData({ ...formData, sharingType: e.target.value })}
                      className="w-full p-3 bg-[#0d1321]/90 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                    >
                      <option value="1 Sharing">1 Sharing</option>
                      <option value="2 Sharing">2 Sharing</option>
                      <option value="3 Sharing">3 Sharing</option>
                      <option value="4 Sharing">4 Sharing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.rent}
                      onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                      placeholder="8000"
                      className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Beds Capacity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="6"
                      value={formData.totalBeds}
                      onChange={(e) => setFormData({ ...formData, totalBeds: parseInt(e.target.value) || 2 })}
                      placeholder="2"
                      className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                    />
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
                    editingRoom ? 'Modify Details' : 'Register Room'
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

export default RoomManager;
