import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../store/authSlice.js';
import { Megaphone, Calendar, Info } from 'lucide-react';
import GlassCard from '../../components/GlassCard.jsx';

const TenantAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${API_URL}/announcements`);
        setAnnouncements(res.data);
      } catch (err) {
        console.warn('API fetch failed, falling back to mock announcements.');
        setAnnouncements([
          {
            id: 'a1',
            title: 'Water Tank Cleaning Scheduled',
            content: 'The overhead water tanks for StayMate Elite will be cleaned tomorrow Sunday between 10:00 AM and 02:00 PM. Please store sufficient water.',
            category: 'Maintenance',
            createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
          },
          {
            id: 'a2',
            title: 'WiFi Router Upgrade',
            content: 'We are upgrading the main broadband line on the rooftop to 1 Gbps today midnight. Expect a 10-minute network downtime.',
            category: 'Internet',
            createdAt: new Date(Date.now() - 36 * 3600000).toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

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
      <div className="mb-8 flex items-center gap-2">
        <Megaphone className="w-6 h-6 text-purple-400" />
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Broadcast Announcements</h1>
          <p className="text-slate-400 text-xs mt-1">Operational updates, policy notifications, and maintenance logs.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-t-purple-500 border-r-cyan-400 border-slate-700 animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <GlassCard hoverEffect={false} className="border border-white/5 p-12 text-center">
          <Info className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-white text-base font-bold mb-1">Quiet Atmosphere</h3>
          <p className="text-slate-400 text-xs">No active alerts broadcasted for your building yet.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((ann, idx) => (
            <GlassCard key={ann.id} hoverEffect={false} delay={idx * 0.05} className="border border-white/10 flex flex-col justify-between p-6">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wide ${getCategoryColor(ann.category)}`}>
                    {ann.category}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ann.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2 leading-snug">{ann.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{ann.content}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default TenantAnnouncements;
