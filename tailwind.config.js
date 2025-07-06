module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'mint': '#98D8C8',
        'teal': '#14B8A6',
        'emerald': '#10B981',
        'cream': '#F5F5DC',
        
        // Dark theme colors
        'deep-charcoal': '#0B0F1A',
        'royal-plum': '#3A0CA3',
        'rich-purple': '#1C0C3F',
        'sapphire': '#3B82F6',
        'ocean-blue': '#0EA5E9',
        'deep-teal': '#0F766E',
        'emerald-dark': '#047857',
        'dusty-peach': '#FFB6A3',
        'deep-plum': '#2C1B47',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'beam-sweep': 'beamSweep 2s linear infinite',
        'ripple-expand': 'rippleExpand 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        beamSweep: {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '50%': { 
            opacity: '1'
          },
          '100%': { 
            transform: 'translateX(100%)',
            opacity: '0'
          },
        },
        rippleExpand: {
          '0%': { 
            width: '0px',
            height: '0px',
            opacity: '1'
          },
          '100%': { 
            width: '200px',
            height: '200px',
            opacity: '0'
          },
        },
      },
    },
  },
  plugins: [],
}; 