import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../store/authSlice.js';
import { Plus, Edit, Trash2, MapPin, Sparkles, Check, X, ShieldAlert } from 'lucide-react';
import GlassCard from '../../components/GlassCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyManager = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPg, setEditingPg] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    amenities: []
  });

  const allAmenities = ['WiFi', 'CCTV', 'Laundry', 'Housekeeping', 'Power Backup', 'Security', 'Food', 'Water Supply'];

  const fetchPgs = async () => {
    try {
      const res = await axios.get(`${API_URL}/pgs`);
      setPgs(res.data);
    } catch (err) {
      console.warn('API error, using static fallback properties.');
      setPgs([
        { id: 'pg1', name: 'StayMate Elite Coliving', address: 'Jayanagar 4th Block, Bangalore, Near Metro Station', description: 'Premium smart living for professionals with high-end amenities.', amenities: ['WiFi', 'CCTV', 'Laundry', 'Housekeeping', 'Power Backup'] },
        { id: 'pg2', name: 'StayMate Premium Suites', address: 'Koramangala 4th Block, Bangalore', description: 'Futuristic suites optimized for digital nomads.', amenities: ['WiFi', 'CCTV', 'Laundry', 'Housekeeping', 'Food'] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPgs();
  }, []);

  const handleOpenAdd = () => {
    setEditingPg(null);
    setFormData({ name: '', address: '', description: '', amenities: [] });
    setModalOpen(true);
  };

  const handleOpenEdit = (pg) => {
    setEditingPg(pg);
    setFormData({
      name: pg.name,
      address: pg.address,
      description: pg.description || '',
      amenities: pg.amenities || []
    });
    setModalOpen(true);
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const current = prev.amenities;
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPg) {
        // Edit Mode
        await axios.put(`${API_URL}/pgs/${editingPg.id}`, formData);
      } else {
        // Add Mode
        await axios.post(`${API_URL}/pgs`, formData);
      }
      fetchPgs();
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to submit PG property:', err);
      // Simulate frontend mock logic update
      if (editingPg) {
        setPgs(prev => prev.map(p => p.id === editingPg.id ? { ...p, ...formData } : p));
      } else {
        setPgs(prev => [...prev, { id: Math.random().toString(), ...formData }]);
      }
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? All room configs will lose this binding!')) return;
    try {
      await axios.delete(`${API_URL}/pgs/${id}`);
      fetchPgs();
    } catch (err) {
      console.error('Delete PG failed:', err);
      setPgs(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Properties Command</h1>
          <p className="text-slate-400 text-xs mt-1">Register new buildings, edit address descriptors, and change amenities.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-aurora-gradient text-white rounded-xl text-xs font-bold shadow-neon-violet hover:opacity-95 transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Building
        </button>
      </div>

      {/* Property Cards Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-r-cyan-400 border-slate-700 animate-spin" />
        </div>
      ) : pgs.length === 0 ? (
        <GlassCard hoverEffect={false} className="border border-white/5 p-12 text-center">
          <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-white text-base font-bold mb-1">No Properties Found</h3>
          <p className="text-slate-400 text-xs mb-6">Create a PG property block to start assigning rooms.</p>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-aurora-gradient text-white text-xs font-bold rounded-xl shadow-neon-violet"
          >
            Create First PG
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pgs.map(pg => (
            <GlassCard key={pg.id} hoverEffect={false} className="border border-white/10 p-0 overflow-hidden flex flex-col justify-between rounded-2xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-base font-bold text-white">{pg.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(pg)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pg.id)}
                      className="p-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {pg.address}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {pg.description || 'Premium PG residency located near city transport hubs, configured with modern utilities.'}
                </p>

                {/* Amenities checklist badges */}
                <div className="flex flex-wrap gap-1.5">
                  {pg.amenities?.map(amenity => (
                    <span key={amenity} className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
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
              className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-neon-violet bg-brand-dark/95 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Building Operations
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">{editingPg ? 'Modify Property Details' : 'Register New Property'}</h2>
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
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Property Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="StayMate Elite"
                    className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Location Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Jayanagar 4th Block, Bangalore"
                    className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a detailed description of the property features, vicinity details, and coliving guidelines."
                    rows="3"
                    className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Amenities Checklist</label>
                  <div className="grid grid-cols-2 gap-3 mt-1.5">
                    {allAmenities.map(amenity => {
                      const isSelected = formData.amenities.includes(amenity);
                      return (
                        <div
                          key={amenity}
                          onClick={() => handleAmenityToggle(amenity)}
                          className={`p-2.5 rounded-lg border text-left cursor-pointer transition flex items-center justify-between text-[11px] font-semibold ${isSelected ? 'bg-purple-500/10 border-purple-500/30 text-white' : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white'}`}
                        >
                          <span>{amenity}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                        </div>
                      );
                    })}
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
                    editingPg ? 'Modify Details' : 'Register Property'
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

export default PropertyManager;
