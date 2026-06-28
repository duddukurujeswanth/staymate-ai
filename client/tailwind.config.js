/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#070B14',
          darker: '#05080e',
          card: '#0D1321',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: '#7C3AED',
          cyan: '#00E5FF',
          green: '#00FFA3',
          yellow: '#FFD60A',
          orange: '#FF9F1C'
        },
        aurora: {
          violet: '#7C3AED',
          purple: '#A855F7',
          pink: '#EC4899'
        },
        cyber: {
          cyan: '#00E5FF',
          teal: '#00FFA3'
        }
      },
      backgroundImage: {
        'aurora-gradient': 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00E5FF 0%, #00FFA3 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
        'glow-gradient': 'radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, transparent 70%)'
      },
      boxShadow: {
        'neon-violet': '0 0 20px rgba(124, 58, 237, 0.35)',
        'neon-cyber': '0 0 20px rgba(0, 229, 255, 0.35)',
        'neon-gold': '0 0 20px rgba(255, 214, 10, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backdropBlur: {
        'glass': '24px'
      },
      animation: {
        'aurora-flow': 'aurora 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite'
      },
      keyframes: {
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 }
        }
      }
    },
  },
  plugins: [],
}
