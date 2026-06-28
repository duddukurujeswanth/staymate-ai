import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../store/authSlice.js';
import { Sparkles, Bed, LayoutGrid, Check, MapPin } from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import { motion } from 'framer-motion';

// Bed indicator component
const OccupancyBeds = ({ occupied, total }) => {
  return (
    <div className="flex gap-1.5 mt-2">
      {[...Array(total)].map((_, i) => {
        const isOccupied = i < occupied;
        return (
          <div 
            key={i} 
            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${isOccupied ? 'bg-purple-600/30 border-purple-500 text-purple-400' : 'bg-white/[0.02] border-white/10 text-slate-600'}`}
            title={isOccupied ? 'Occupied Bed' : 'Available Bed'}
          >
            <Bed className="w-3 h-3" />
          </div>
        );
      })}
    </div>
  );
};

const Rooms = () => {
  const [pgs, setPgs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedPgId, setSelectedPgId] = useState('');
  const [loading, setLoading] = useState(true);

  const fallbackPgs = [
    { id: 'pg1', name: 'StayMate Elite Coliving', address: 'Jayanagar 4th Block, Bangalore, Near Metro Station' },
    { id: 'pg2', name: 'StayMate Premium Suites', address: 'Koramangala 4th Block, Bangalore' }
  ];

  const fallbackRooms = [
    { id: 'r1', pgId: 'pg1', roomNumber: '101', sharingType: '1 Sharing', rent: 10000, totalBeds: 1, occupiedBeds: 1 },
    { id: 'r2', pgId: 'pg1', roomNumber: '102', sharingType: '2 Sharing', rent: 8000, totalBeds: 2, occupiedBeds: 1 },
    { id: 'r3', pgId: 'pg1', roomNumber: '103', sharingType: '3 Sharing', rent: 7000, totalBeds: 3, occupiedBeds: 0 },
    { id: 'r4', pgId: 'pg2', roomNumber: '201', sharingType: '2 Sharing', rent: 9000, totalBeds: 2, occupiedBeds: 0 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pgsRes = await axios.get(`${API_URL}/pgs`);
        setPgs(pgsRes.data);
        if (pgsRes.data.length > 0) {
          setSelectedPgId(pgsRes.data[0].id);
        }
        const roomsRes = await axios.get(`${API_URL}/rooms`);
        setRooms(roomsRes.data);
      } catch (err) {
        console.warn('Backend fetch failed, using fallback mock data for Rooms.');
        setPgs(fallbackPgs);
        setSelectedPgId(fallbackPgs[0].id);
        setRooms(fallbackRooms);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activePg = pgs.find(p => p.id === selectedPgId) || pgs[0];
  const filteredRooms = rooms.filter(r => r.pgId === selectedPgId);

  const sharingTypePricing = {
    '1 Sharing': { desc: 'Premium privacy suite for single occupancy. Highly requested by software professionals.', price: '₹10,000', img: '/assets/deluxe_private_suite.png' },
    '2 Sharing': { desc: 'Twin Bed Config. Fully loaded with separate lockers, organic catering and individual desks.', price: '₹8,000', img: '/assets/twin_bed_sharing_room.jpg' },
    '3 Sharing': { desc: 'Triple sharing config. Optimized workspace layouts and spacious attached bathrooms.', price: '₹7,000', img: '/assets/paying_guest_rooms.png' },
    '4 Sharing': { desc: 'Quad sharing budget config. Spacious ventilated layout, housekeeping services, storage systems.', price: '₹6,000', img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=70' },
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-cyan-400 font-semibold mb-4">
            <LayoutGrid className="w-3.5 h-3.5" /> Space Configuration
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Explore Available Sharing Spaces
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto">
            Choose from our single or twin sharing rooms. High speed internet and daily laundry standard on all rooms.
          </p>
        </div>

        {/* PG Property Selector */}
        {pgs.length > 1 && (
          <div className="flex justify-center gap-3 mb-12">
            {pgs.map(pg => (
              <button
                key={pg.id}
                onClick={() => setSelectedPgId(pg.id)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold border transition ${selectedPgId === pg.id ? 'bg-aurora-gradient text-white border-transparent shadow-neon-violet' : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'}`}
              >
                {pg.name}
              </button>
            ))}
          </div>
        )}

        {/* Selected PG Details Card */}
        {activePg && (
          <div className="glass-panel rounded-2xl p-6 mb-12 border border-white/10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-purple-500/5 blur-[50px]" />
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{activePg.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {activePg.address}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{activePg.description || 'Premium co-living property configured with all modern security facilities, dining systems, and remote working arrangements.'}</p>
            </div>
          </div>
        )}

        {/* Rooms Listing Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-r-cyan-400 border-slate-700 animate-spin" />
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-white/10">
            <p className="text-slate-400 text-sm">No rooms registered under this property yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredRooms.map((room) => {
              const info = sharingTypePricing[room.sharingType] || {
                desc: 'Standard rooms with ventilation, locker space, organic catering and study table.',
                price: `₹${room.rent.toLocaleString()}`,
                img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80'
              };

              const isFull = room.occupiedBeds >= room.totalBeds;

              return (
                <GlassCard key={room.id} glowColor={isFull ? 'pink' : 'cyber'} className="flex flex-col overflow-hidden p-0 rounded-2xl border border-white/10">
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={info.img} 
                      alt={room.sharingType} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 bg-brand-dark/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10 text-xs font-extrabold text-cyan-400">
                      {info.price} <span className="text-[10px] text-slate-400 font-normal">/ mo</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-white">Room {room.roomNumber} ({room.sharingType})</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isFull ? 'bg-pink-500/10 border border-pink-500/20 text-pink-400' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'}`}>
                          {isFull ? 'No Beds left' : 'Beds available'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed mb-6">{info.desc}</p>
                    </div>

                    <div className="border-t border-white/5 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Bed Occupancy Layout</span>
                        <OccupancyBeds occupied={room.occupiedBeds} total={room.totalBeds} />
                      </div>
                      {!isFull && (
                        <Link
                          to={`/join?roomId=${room.id}&roomNumber=${room.roomNumber}&sharing=${encodeURIComponent(room.sharingType)}`}
                          className="w-full sm:w-auto px-5 py-2 text-center rounded-xl bg-aurora-gradient text-white text-xs font-semibold shadow-neon-violet hover:opacity-95 transition"
                        >
                          Book Bed Now
                        </Link>
                      )}
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Rooms;
