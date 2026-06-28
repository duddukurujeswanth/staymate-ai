import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 bg-brand-darker py-16 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-cyan-900/5 blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-aurora-gradient flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                StayMate<span className="text-cyan-400">.AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Next-generation operational intelligence platform for Paying Guest accommodations and coliving properties. Streamline complaints, optimize sharing capacities, and enable automation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/rooms" className="hover:text-white transition">Rooms & Pricing</Link>
              </li>
              <li>
                <Link to="/amenities" className="hover:text-white transition">PG Amenities</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition">Visual Gallery</Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-white transition">Booking Inquiry</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Corporate</h4>
            <p className="text-slate-400 text-xs mb-3">
              Jayanagar 4th Block, Bangalore, India <br />
              support@staymate.ai
            </p>
            <Link 
              to="/join" 
              className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition"
            >
              Get in Touch <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

        <hr className="border-white/5 my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} StayMate AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" /> for digital nomad living.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
