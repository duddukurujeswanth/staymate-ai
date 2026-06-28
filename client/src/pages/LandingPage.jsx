import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Shield, Cpu, Bell, CheckCircle, Smartphone, Wifi, Coffee, HelpCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard.jsx';

// Counter component for stats
const StatCounter = ({ value, label, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const numericVal = parseInt(value.replace(/[^0-9]/g, ''));

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const end = numericVal;
    if (start === end) return;

    const totalMilisecondsRoundTrip = 50;
    const incrementTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, Math.max(incrementTime, 20));

    return () => clearInterval(timer);
  }, [numericVal]);

  return (
    <div className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
      <h3 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
        {count.toLocaleString()}{suffix}
      </h3>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-2">{label}</p>
    </div>
  );
};

const LandingPage = () => {
  const [pricingTab, setPricingTab] = useState('monthly');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      
      {/* BACKGROUND PARTICLES/GLOWS */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/2 right-1/10 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen pt-32 pb-16 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-cyan-400 text-xs font-semibold mb-6 shadow-glass backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5" /> Introducing StayMate AI
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6"
        >
          Transform Your PG Operations Into a <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent text-glow-violet">Seamless Digital Experience</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-10"
        >
          Eliminate WhatsApp chaos, manual complaint notebooks, and spreadsheets. Experience the ultimate glassmorphic dashboard for PG owners, tenants, and visitors.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link
            to="/join"
            className="px-8 py-3.5 rounded-xl font-bold bg-aurora-gradient text-white shadow-neon-violet hover:opacity-95 transition-all duration-200 flex items-center justify-center gap-2 group text-sm"
          >
            🚀 Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="px-8 py-3.5 rounded-xl font-bold bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white transition-all duration-200 text-sm"
          >
            ✨ Explore Features
          </a>
        </motion.div>

        {/* 3D Dashboard Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, type: 'spring' }}
          className="w-full max-w-5xl rounded-2xl p-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 shadow-neon-violet border border-white/10 overflow-hidden"
        >
          <div className="bg-brand-dark rounded-xl overflow-hidden aspect-[16/9] relative">
            <img
              src="/assets/deluxe_private_suite.png"
              alt="StayMate Premium Spaces"
              className="w-full h-full object-cover opacity-90 hover:scale-102 transition-transform duration-700"
            />
            {/* Ambient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-40" />
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: STATISTICS */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCounter value="100" label="Beds Managed" suffix="+" />
          <StatCounter value="95" label="Faster Resolution" suffix="%" />
          <StatCounter value="200" label="Happy Tenants" suffix="+" />
          <StatCounter value="99" label="Reliability" suffix=".9%" />
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Operations Elevated. Experience Guaranteed.
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto">
            Everything you need to handle PG management, powered by live statistics, smart checklists, and robust ticket tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <GlassCard glowColor="violet">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Role-Based Access Portals</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Dedicated interfaces optimized specifically for Visitors, Tenants, and Owners. Secure logins ensure personal privacy and operation visibility.
            </p>
          </GlassCard>

          <GlassCard glowColor="cyber">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Ticketing Lifecycles</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              File complains in 8 categories, attach images, set priorities, and watch status logs update instantly. No more unanswered messages.
            </p>
          </GlassCard>

          <GlassCard glowColor="pink">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6">
              <Bell className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Announcements Center</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Broadcast critical water, electricity, or catering notifications to all tenants. Real-time glass sliders ensure no message goes unseen.
            </p>
          </GlassCard>

        </div>
      </section>

      {/* SECTION 4: AMENITIES */}
      <section className="py-20 bg-brand-card/30 border-y border-white/5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Smart Conveniences</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 mb-6">
              Premium Living Amenities For Modern Nomads
            </h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-8">
              We design spaces that feel like home but operate like hotels. Fully loaded facilities help developers, designers, and builders focus on their craft without daily operations friction.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Wifi className="w-4 h-4 text-purple-400" /> Gigabit Wi-Fi Broadbands
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Coffee className="w-4 h-4 text-purple-400" /> Curated Organic Catering
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Shield className="w-4 h-4 text-purple-400" /> 24/7 CCTV & Security
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Smartphone className="w-4 h-4 text-purple-400" /> Fully Automate Updates
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl blur-lg pointer-events-none" />
            <img
              src="/assets/deluxe_private_suite.png"
              alt="Coliving Common Area"
              className="w-full rounded-2xl object-cover aspect-[4/3] border border-white/10 shadow-neon-violet relative z-10"
            />
          </div>
        </div>
      </section>

      {/* SECTION 5: PRICING */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Flexible Layouts</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-2 mb-4">
            Transparent Pricing Configuration
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-lg mx-auto">
            Choose standard sharing plans structured to match your monthly space and privacy needs. No hidden charges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { sharing: '1 Sharing', price: '₹10,000', beds: 'Private Space', features: ['Private Attached Bathroom', 'Dedicated Workdesk', 'Smart AC Installed', 'Daily Housekeeping'] },
            { sharing: '2 Sharing', price: '₹8,000', beds: 'Twin Beds Config', features: ['Shared Attached Bathroom', 'Individual Storage Lockers', 'AC Installed', 'Daily Housekeeping'] },
            { sharing: '3 Sharing', price: '₹7,000', beds: 'Triple Bed Layout', features: ['Large Shared Bathroom', 'Individual Cabinets', 'Air Cooler System', 'Daily Housekeeping'] },
            { sharing: '4 Sharing', price: '₹6,000', beds: 'Quad Bed Setup', features: ['Large Shared Bathroom', 'Cabinets', 'Air Cooler System', 'Alternate Day Cleaning'] }
          ].map((plan, idx) => (
            <GlassCard key={idx} glowColor={idx === 0 ? 'violet' : 'cyber'} className="flex flex-col h-full">
              <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{plan.sharing}</h4>
              <div className="my-6">
                <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                <span className="text-slate-400 text-xs"> / month</span>
              </div>
              <p className="text-[11px] text-cyan-400 font-medium mb-6">{plan.beds}</p>
              <ul className="space-y-3.5 mb-8 flex-1 text-xs text-slate-300">
                {plan.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={`/join?sharing=${encodeURIComponent(plan.sharing)}`}
                className="w-full text-center py-2.5 rounded-xl font-bold bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white hover:text-cyan-300 text-xs transition duration-200"
              >
                Inquire Now
              </Link>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="py-20 bg-brand-card/20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              Endorsed by Residents and Operators
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Read how StayMate AI makes daily PG operations stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Kunal Verma', role: 'PG Tenant (Software Engineer)', quote: 'The wifi ticket raised on Sunday was resolved in 2 hours. The logs showed exactly when the technician arrived. Awwwards level stuff!' },
              { name: 'Megha Sharma', role: 'Property Owner', quote: 'I manage 40 rooms across 2 properties. Approving inquiries auto-provisions logins for tenants. I threw away my paper ledgers. Incredibly simple.' },
              { name: 'Rohan Sen', role: 'PG Tenant (UI Designer)', quote: 'Beautiful interface, clean dark theme. Getting housekeeping alerts directly to my notification center rules. Love opening the portal.' }
            ].map((t, idx) => (
              <GlassCard key={idx} hoverEffect={false} className="flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed italic mb-6">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white uppercase">
                    {t.name[0]}
                  </div>
                  <div>
                    <h5 className="text-white text-xs font-bold">{t.name}</h5>
                    <p className="text-slate-500 text-[10px]">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: GALLERY PREVIEW */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">Virtual Property Gallery</h2>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            Take a glance inside our premium common areas, modern cafeterias, and co-living workspaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <img
            src="/assets/deluxe_private_suite.png"
            alt="Single Deluxe Room"
            className="rounded-xl border border-white/5 object-cover w-full h-64 hover:opacity-90 transition duration-300 cursor-pointer"
          />
          <img
            src="/assets/twin_bed_sharing_room.jpg"
            alt="Sharing Room setup"
            className="rounded-xl border border-white/5 object-cover w-full h-64 hover:opacity-90 transition duration-300 cursor-pointer"
          />
          <img
            src="/assets/glassmorphic_workspace.jpg"
            alt="Common Dining Room"
            className="rounded-xl border border-white/5 object-cover w-full h-64 hover:opacity-90 transition duration-300 cursor-pointer"
          />
        </div>

        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition"
        >
          View Full Gallery <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* SECTION 8: CONTACT */}
      <section className="py-24 border-t border-white/5 bg-brand-dark px-6">
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-cyan-500/10 blur-[80px]" />
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">Connect With Us</h2>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Have questions about properties, pricing, or custom coliving dashboards? Drop us a line.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Message</label>
              <textarea
                required
                rows="4"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="I am interested in your twin sharing plan. What is the security deposit?"
                className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full py-3.5 rounded-xl font-bold bg-aurora-gradient hover:opacity-95 shadow-neon-violet text-white text-xs flex items-center justify-center gap-2 transition duration-200"
            >
              {submitted ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" /> Message Sent Successfully!
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
