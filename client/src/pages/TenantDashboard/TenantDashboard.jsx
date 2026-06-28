import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../../store/authSlice.js';
import { Bed, DollarSign, LifeBuoy, Megaphone, ArrowUpRight, CheckCircle, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import GlassCard from '../../components/GlassCard.jsx';
import { motion } from 'framer-motion';

const TenantDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [complaints, setComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentPaid, setRentPaid] = useState(user?.rentPaid || false);
  const [paySuccess, setPaySuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintsRes = await axios.get(`${API_URL}/complaints/my`);
        setComplaints(complaintsRes.data);
      } catch (err) {
        console.warn('API error, using fallback complaints.');
        setComplaints([
          { id: 'c1', title: 'WiFi speed is dropping frequently', status: 'In Progress', category: 'WiFi' },
          { id: 'c2', title: 'Water tap leaking in washroom', status: 'Resolved', category: 'Water' }
        ]);
      }

      try {
        const announcementsRes = await axios.get(`${API_URL}/announcements`);
        setAnnouncements(announcementsRes.data.slice(0, 3));
      } catch (err) {
        console.warn('API error, using fallback announcements.');
        setAnnouncements([
          { id: 'a1', title: 'Water Tank Cleaning Scheduled', content: 'Cleaning will occur Sunday 10 AM.', category: 'Maintenance' },
          { id: 'a2', title: 'WiFi Router Upgrade', content: 'Upgrading to 1 Gbps broadband today midnight.', category: 'Internet' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePayRent = () => {
    setLoading(true);
    setTimeout(() => {
      setRentPaid(true);
      setPaySuccess(true);
      setLoading(false);
      setTimeout(() => setPaySuccess(false), 3000);
    }, 1500);
  };

  const activeTickets = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const resolvedTickets = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  return (
    <div className="space-y-8">
      
      {/* Greetings */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 text-xs mt-1">Here is a quick snapshot of your coliving residency status today.</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <GlassCard hoverEffect={false} glowColor="cyber">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Room Details</p>
              <h3 className="text-2xl font-extrabold text-white mt-1.5">{user?.roomNumber ? `Room ${user.roomNumber}` : 'Unassigned'}</h3>
              <p className="text-[10px] text-cyan-400 font-semibold mt-1">{user?.sharingType || 'N/A Layout'}</p>
            </div>
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
              <Bed className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} glowColor="violet">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Monthly Rent</p>
              <h3 className="text-2xl font-extrabold text-white mt-1.5">₹{(user?.rentAmount || 8000).toLocaleString()}</h3>
              <span className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-1.5 ${rentPaid ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'}`}>
                {rentPaid ? 'Paid' : 'Payment Due'}
              </span>
            </div>
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} glowColor="pink">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Complaints</p>
              <h3 className="text-2xl font-extrabold text-white mt-1.5">{activeTickets}</h3>
              <p className="text-[10px] text-pink-400 font-semibold mt-1">Pending Resolution</p>
            </div>
            <div className="p-3 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

        <GlassCard hoverEffect={false} glowColor="gold">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Resolved Complaints</p>
              <h3 className="text-2xl font-extrabold text-white mt-1.5">{resolvedTickets}</h3>
              <p className="text-[10px] text-yellow-400 font-semibold mt-1">Completed Tickets</p>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Main Grid: Rent payment & announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Rent Pay Widget */}
        <div className="lg:col-span-2">
          <GlassCard hoverEffect={false} className="h-full border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-white">Rent Management Portal</h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Billing Cycle: Monthly</span>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Resident Rent Assessment</p>
                  <p className="text-2xl font-bold text-white mt-1">₹{(user?.rentAmount || 8000).toLocaleString()}</p>
                </div>
                <div className="text-right sm:text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">Due Date</p>
                  <p className="text-xs font-semibold text-slate-300 mt-1">05th July, 2026</p>
                </div>
              </div>

              <div className="space-y-3.5 mb-6 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Room Basic Charge</span>
                  <span>₹{(user?.rentAmount || 8000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wi-Fi & Utility Fees</span>
                  <span className="text-cyan-400">Included</span>
                </div>
                <div className="flex justify-between">
                  <span>Organic Catering Meals</span>
                  <span className="text-cyan-400">Included</span>
                </div>
              </div>
            </div>

            <div>
              {rentPaid ? (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Rent fully paid for current cycle. Thank you!</span>
                </div>
              ) : (
                <button
                  onClick={handlePayRent}
                  className="w-full py-3.5 rounded-xl font-bold bg-aurora-gradient text-white text-xs flex justify-center items-center gap-2 shadow-neon-violet transition"
                >
                  <CreditCard className="w-4 h-4" /> Pay Rent (Secure Simulation Gate)
                </button>
              )}

              {paySuccess && (
                <div className="mt-3 p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl text-xs text-center flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Rent payment mock processed! Receipt sent to email.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Announcements List */}
        <div>
          <GlassCard hoverEffect={false} className="h-full border border-white/10 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Megaphone className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">Broadcasts</h3>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-16 bg-white/[0.03] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <p className="text-xs text-slate-500 py-10 text-center">No alerts broadcasted.</p>
            ) : (
              <div className="space-y-4">
                {announcements.map(ann => (
                  <div key={ann.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition">
                    <div className="flex justify-between items-center mb-1.5">
                      <h4 className="text-xs font-bold text-white truncate max-w-[130px]">{ann.title}</h4>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-purple-400 uppercase font-extrabold tracking-wider shrink-0">
                        {ann.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{ann.content}</p>
                    <span className="block mt-2 text-[9px] text-slate-600">
                      {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

      </div>

    </div>
  );
};

export default TenantDashboard;
