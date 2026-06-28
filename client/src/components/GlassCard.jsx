import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  hoverEffect = true, 
  glowColor = 'violet', // violet, cyber, gold, pink
  onClick,
  delay = 0
}) => {
  const glowClasses = {
    violet: 'hover:border-purple-500/30 hover:shadow-[0_0_25px_rgba(124,58,237,0.15)]',
    cyber: 'hover:border-cyan-500/30 hover:shadow-[0_0_25px_rgba(0,229,255,0.15)]',
    gold: 'hover:border-yellow-500/30 hover:shadow-[0_0_25px_rgba(255,214,10,0.15)]',
    pink: 'hover:border-pink-500/30 hover:shadow-[0_0_25px_rgba(236,72,153,0.15)]'
  };

  const borderGlow = glowClasses[glowColor] || glowClasses.violet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      whileHover={hoverEffect ? { y: -4, scale: 1.01 } : {}}
      onClick={onClick}
      className={`
        glass-panel 
        rounded-2xl 
        p-6 
        transition-all 
        duration-300 
        ${hoverEffect ? `cursor-pointer ${borderGlow}` : ''} 
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
