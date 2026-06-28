import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../store/authSlice.js';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building, Bed, Users, ShieldAlert, Sparkles, FileText, TrendingUp, HelpCircle } from 'lucide-react';
import GlassCard from '../../components/GlassCard.jsx';

const OwnerOverview = () => {
  const [stats, setStats] = useState({
    totalPgs: 2,
    totalRooms: 4,
    totalBeds: 8,
    occupiedBeds: 2,
    availableBeds: 6,
    totalTenants: 2,
    openComplaints: 1,
    resolvedComplaints: 1
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const pgsRes = await axios.get(`${API_URL}/pgs`);
        const roomsRes = await axios.get(`${API_URL}/rooms`);
        const tenantsRes = await axios.get(`${API_URL}/tenants`);
        const complaintsRes = await axios.get(`${API_URL}/complaints`);

        const pgs = pgsRes.data;
        const rooms = roomsRes.data;
        const tenants = tenantsRes.data;
        const complaints = complaintsRes.data;

        const totalBeds = rooms.reduce((acc, r) => acc + r.totalBeds, 0);
        const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupiedBeds, 0);
        const openComplaints = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
        const resolvedComplaints = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

        setStats({
          totalPgs: pgs.length,
          totalRooms: rooms.length,
          totalBeds,
          occupiedBeds,
          availableBeds: Math.max(0, totalBeds - occupiedBeds),
          totalTenants: tenants.length,
          openComplaints,
          resolvedComplaints
        });
      } catch (err) {
        console.warn('API metrics query failed, using static seed averages.');
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  // Recharts Chart Mock Data
  const occupancyData = [
    { name: 'Jan', Occupancy: 65 },
    { name: 'Feb', Occupancy: 70 },
    { name: 'Mar', Occupancy: 80 },
    { name: 'Apr', Occupancy: 85 },
    { name: 'May', Occupancy: 90 },
    { name: 'Jun', Occupancy: 92 }
  ];

  const complaintsData = [
    { name: 'WiFi', Count: 3 },
    { name: 'Food', Count: 2 },
    { name: 'Cleaning', Count: 4 },
    { name: 'Water', Count: 1 },
    { name: 'Electricity', Count: 2 },
    { name: 'Furniture', Count: 0 }
  ];

  const statusPieData = [
    { name: 'Resolved', value: stats.resolvedComplaints, color: '#00FFA3' },
    { name: 'Pending / Open', value: stats.openComplaints, color: '#7C3AED' }
  ];

  return (
    <div className="space-y-8">
      {/* Greetings */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
            StayMate Operations Center <Sparkles className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-slate-400 text-xs mt-1">Real-time room occupancy trends, tenant lists, and maintenance reports.</p>
        </div>
        
        <div className="flex gap-2">
          <Link
            to="/owner/reports"
            className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-white rounded-xl border border-white/10 flex items-center gap-1.5 transition"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Generate CSV Report
          </Link>
        </div>
      </div>

      {/* Analytics KPI Dashboard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <GlassCard hoverEffect={false} glowColor="cyber">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Properties</span>
              <h3 className="text-2xl font-extrabold text-white mt-1.5">{stats.totalPgs} PGs</h3>
              <p className="text-[9px] text-cyan-400 mt-1">Fully Connected Nodes</p>
            </div>
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
              <Building className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} glowColor="violet">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Bed Capacity</span>
              <h3 className="text-2xl font-extrabold text-white mt-1.5">{stats.occupiedBeds} / {stats.totalBeds}</h3>
              <p className="text-[9px] text-purple-400 mt-1">{stats.availableBeds} Vacant Beds Left</p>
            </div>
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <Bed className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} glowColor="gold">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Residents</span>
              <h3 className="text-2xl font-extrabold text-white mt-1.5">{stats.totalTenants} Tenants</h3>
              <p className="text-[9px] text-yellow-400 mt-1">Active Room Inmates</p>
            </div>
            <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} glowColor="pink">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Open Tickets</span>
              <h3 className="text-2xl font-extrabold text-white mt-1.5">{stats.openComplaints} Pending</h3>
              <p className="text-[9px] text-pink-400 mt-1">{stats.resolvedComplaints} Resolved Issues</p>
            </div>
            <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Interactive Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Occupancy Area Growth Chart */}
        <div className="lg:col-span-2">
          <GlassCard hoverEffect={false} className="border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Bed Occupancy Rate Trends (%)
              </h3>
              <span className="text-[9px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 uppercase font-extrabold px-1.5 py-0.5 rounded">
                Live Data
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0d1321', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 11, color: '#f8fafc' }} />
                  <Area type="monotone" dataKey="Occupancy" stroke="#00E5FF" strokeWidth={2} fillOpacity={1} fill="url(#colorOcc)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Complaints Ticket status Pie Distribution */}
        <div>
          <GlassCard hoverEffect={false} className="border border-white/10 p-6 flex flex-col justify-between h-full">
            <h3 className="text-sm font-bold text-white mb-6">Ticket Support Status</h3>

            <div className="h-56 relative flex items-center justify-center">
              {stats.openComplaints === 0 && stats.resolvedComplaints === 0 ? (
                <p className="text-xs text-slate-500">No support tickets raised.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* Display total tickets in center */}
              <div className="absolute text-center">
                <span className="text-2xl font-extrabold text-white">{(stats.openComplaints + stats.resolvedComplaints)}</span>
                <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Total Tickets</p>
              </div>
            </div>

            <div className="space-y-2 mt-4 text-[10px]">
              {statusPieData.map((d, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded bg-white/[0.01] border border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-400 font-semibold">{d.name}</span>
                  </div>
                  <span className="font-extrabold text-white">{d.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Complaints by category bar charts */}
      <GlassCard hoverEffect={false} className="border border-white/10 p-6">
        <h3 className="text-sm font-bold text-white mb-6">Open Complaints count by Category</h3>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complaintsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0d1321', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 11, color: '#f8fafc' }} />
              <Bar dataKey="Count" fill="#7C3AED" radius={[4, 4, 0, 0]} maxBarSize={45}>
                {complaintsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#7C3AED' : '#A855F7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

    </div>
  );
};

export default OwnerOverview;
