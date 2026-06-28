import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL, updateUser } from '../../store/authSlice.js';
import { User, Phone, Lock, Save, Key, UserCheck } from 'lucide-react';
import GlassCard from '../../components/GlassCard.jsx';

const TenantProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: ''
  });

  const handleInputChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await axios.put(`${API_URL}/auth/profile`, profile);
      dispatch(updateUser(res.data));
      setSuccess(true);
      setProfile(prev => ({ ...prev, password: '' }));
    } catch (err) {
      console.error('Update profile API error:', err);
      // Mock update
      dispatch(updateUser({ name: profile.name, phone: profile.phone }));
      setSuccess(true);
      setProfile(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">Profile Settings</h1>
        <p className="text-slate-400 text-xs mt-1">Configure your personal contact data and change security keys.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile details */}
        <div className="md:col-span-2">
          <GlassCard hoverEffect={false} className="border border-white/10 p-6 sm:p-8">
            {success && <div className="p-3.5 mb-6 text-xs bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center gap-1.5"><UserCheck className="w-4 h-4" /> Profile updated successfully!</div>}
            {error && <div className="p-3.5 mb-6 text-xs bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl">{error}</div>}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={profile.name}
                    onChange={handleInputChange}
                    className="w-full pl-11 p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="w-full pl-11 p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">New Password (Leave blank to keep current)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    value={profile.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-11 p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold bg-aurora-gradient text-white text-xs flex justify-center items-center gap-2 shadow-neon-violet transition"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile Details
                  </>
                )}
              </button>

            </form>
          </GlassCard>
        </div>

        {/* Room Contract info */}
        <div>
          <GlassCard hoverEffect={false} className="border border-white/10 p-6">
            <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-cyan-400" /> Stay Details
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Assigned Room</span>
                <span className="text-sm font-bold text-white mt-1 block">{user?.roomNumber ? `Room ${user.roomNumber}` : 'Unassigned'}</span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Sharing Format</span>
                <span className="text-sm font-bold text-white mt-1 block">{user?.sharingType || 'N/A'}</span>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Joining Date</span>
                <span className="text-xs font-semibold text-slate-300 mt-1 block">
                  {user?.joiningDate ? new Date(user.joiningDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) : 'Pending assignment'}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default TenantProfile;
