import React from 'react';
import { Wifi, Video, ShieldCheck, Flame, Zap, Droplet, Utensils, Brush, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard.jsx';
import { motion } from 'framer-motion';

const Amenities = () => {
  const amenitiesList = [
    { 
      icon: <Wifi className="w-8 h-8 text-cyan-400" />, 
      title: 'High-Speed Wi-Fi', 
      desc: '1 Gbps backup line configuration with mesh routers on every floor. Low ping for developer workflow.', 
      glow: 'cyber' 
    },
    { 
      icon: <Video className="w-8 h-8 text-purple-400" />, 
      title: '24/7 CCTV Monitoring', 
      desc: 'High-definition cameras monitoring entry, exit, and common areas. Constant cloud recording for security.', 
      glow: 'violet' 
    },
    { 
      icon: <Brush className="w-8 h-8 text-pink-400" />, 
      title: 'Professional Housekeeping', 
      desc: 'Daily room dusting, restroom sanitation, and trash disposal. Fully managed service with weekly feedback loops.', 
      glow: 'pink' 
    },
    { 
      icon: <Utensils className="w-8 h-8 text-yellow-400" />, 
      title: 'Home-Style Organic Catering', 
      desc: 'Nutritious breakfast, lunch, and dinner options prepared under high hygiene standards. Menu updates weekly.', 
      glow: 'gold' 
    },
    { 
      icon: <Zap className="w-8 h-8 text-cyan-400" />, 
      title: '100% Power Backup', 
      desc: 'High-capacity generator sets ensure no interruptions during grid outages. Zero downtime for remote work.', 
      glow: 'cyber' 
    },
    { 
      icon: <ShieldCheck className="w-8 h-8 text-purple-400" />, 
      title: 'Secure Access & Wardens', 
      desc: 'Biometric fingerprint locks at entry points. Dedicated wardens residing on-premise for immediate support.', 
      glow: 'violet' 
    },
    { 
      icon: <Droplet className="w-8 h-8 text-pink-400" />, 
      title: 'RO Water Supply', 
      desc: 'Dual RO filtration systems connected to water coolers. Continuous water supply with regular tank audits.', 
      glow: 'pink' 
    },
    { 
      icon: <Sparkles className="w-8 h-8 text-yellow-400" />, 
      title: 'Smart Laundry Systems', 
      desc: 'Semi-automatic washing machines and drying yards available. Ironing boards and optional laundry pickup service.', 
      glow: 'gold' 
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-purple-400 font-semibold mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> High-End Conveniences
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            Curated Services For Peak Comfort
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-400 text-xs md:text-sm max-w-md mx-auto"
          >
            We manage your laundry, housekeeping, electricity, and catering so that you can focus on building the future.
          </motion.p>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenitiesList.map((item, idx) => (
            <GlassCard key={idx} glowColor={item.glow} delay={idx * 0.05} className="flex flex-col text-center sm:text-left items-center sm:items-start">
              <div className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl mb-5 shrink-0">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed flex-1">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Amenities;
