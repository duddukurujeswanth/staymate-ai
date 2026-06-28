import React, { useState } from 'react';
import { Camera, X, ZoomIn, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const images = [
    { 
      url: '/assets/deluxe_private_suite.png', 
      category: 'rooms', 
      title: 'Deluxe Private Suite',
      desc: 'Elegant single sharing room with attached balcony and workspace.'
    },
    { 
      url: '/assets/twin_bed_sharing_room.jpg', 
      category: 'rooms', 
      title: 'Twin Bed Sharing Room',
      desc: 'Beautifully configured shared space featuring individual workspaces.'
    },
    { 
      url: '/assets/safe_biometric_entry_facade.png', 
      category: 'building', 
      title: 'Safe Biometric Entry Facade',
      desc: 'Keyless biometric fingerprint verification gateway guaranteeing total security.'
    },
    { 
      url: '/assets/paying_guest_rooms.png', 
      category: 'rooms', 
      title: 'Paying Guest Rooms',
      desc: 'Modern twin bed air-conditioned layout optimized for co-living residents.'
    },
    { 
      url: '/assets/modular_kitchen.png', 
      category: 'food', 
      title: 'Modular Kitchen Area',
      desc: 'Clean modular pantry equipped with smart refrigerators, chimney, and cooking facilities.'
    },
    { 
      url: '/assets/glassmorphic_workspace.jpg', 
      category: 'common', 
      title: 'Glassmorphic Workspace',
      desc: 'Vibrant student and professional coworking area featuring ergonomic lounge chairs.'
    },
    { 
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=70', 
      category: 'building', 
      title: 'StayMate Elite Exterior',
      desc: 'Modern multistory residential building block facade.'
    },
    { 
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=70', 
      category: 'food', 
      title: 'Organic Food Buffet',
      desc: 'Nutritious chef-prepared meals served daily in the dining lounge.'
    }
  ];

  const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter);

  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-purple-400 font-semibold mb-4">
            <Camera className="w-3.5 h-3.5" /> Visual Showcase
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Inside StayMate AI Spaces
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto">
            Take a visual tour inside our spaces, private sharing rooms, dining cafeteria, and community lounges.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
          {[
            { label: 'All Images', value: 'all' },
            { label: 'Rooms', value: 'rooms' },
            { label: 'Common Areas', value: 'common' },
            { label: 'Catering & Food', value: 'food' },
            { label: 'Building Structure', value: 'building' }
          ].map(btn => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${filter === btn.value ? 'bg-aurora-gradient border-transparent text-white shadow-neon-violet scale-102' : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Uniform Grid Layout */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredImages.map((img, idx) => (
            <motion.div
              key={img.url}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setLightboxImage(img)}
              className="relative rounded-2xl overflow-hidden border border-white/5 bg-brand-card group cursor-zoom-in aspect-[4/3]"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-103 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="flex justify-between items-center text-white mb-1.5">
                  <h4 className="text-sm font-bold">{img.title}</h4>
                  <ZoomIn className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">{img.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
            >
              {/* Close Button */}
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full rounded-2xl overflow-hidden border border-white/10 shadow-neon-violet bg-brand-dark/95"
              >
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  className="w-full max-h-[70vh] object-contain bg-black/20"
                />
                
                {/* Details Footer */}
                <div className="p-6 border-t border-white/10 bg-brand-card/90 flex gap-4 items-start">
                  <div className="p-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-cyan-400 shrink-0">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{lightboxImage.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{lightboxImage.desc}</p>
                    <span className="inline-block mt-3 text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 uppercase font-extrabold tracking-wider text-slate-400">
                      {lightboxImage.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Gallery;
