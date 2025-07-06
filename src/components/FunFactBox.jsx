import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Rays/Beams background for visual effect
const Rays = () => (
  <svg
    width="380"
    height="397"
    viewBox="0 0 380 397"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute left-0 top-0 pointer-events-none z-0"
  >
    <g filter="url(#filter0_f)">
      <path d="M-37.4 -76L-18.6 -90.7L242.8 162.2L207.5 182.1L-37.4 -76Z" fill="url(#paint0_linear)" />
    </g>
    <defs>
      <filter id="filter0_f" x="-49.4" y="-102.7" width="304.2" height="296.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur" />
      </filter>
      <linearGradient id="paint0_linear" x1="-57.5" y1="-134.7" x2="403.1" y2="351.5" gradientUnits="userSpaceOnUse">
        <stop offset="0.21" stopColor="#AF53FF" />
        <stop offset="0.78" stopColor="#B253FF" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

// FunFactBox: Glassy, animated card with lens/spotlight effect and animated reveal
const FunFactBox = ({ fact, loading, error }) => {
  // State for open/closed (revealed) state
  const [isOpen, setIsOpen] = useState(false);
  // State for mouse hover (for lens effect)
  const [isHovering, setIsHovering] = useState(false);
  // Ref to the box element (for lens position calculation)
  const boxRef = useRef(null);
  // State for lens (spotlight) position
  const [lensPos, setLensPos] = useState({ x: 100, y: 100 });

  // Update lens position on mouse move
  const handleMouseMove = (e) => {
    const rect = boxRef.current.getBoundingClientRect();
    setLensPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    // Outer wrapper for centering
    <div className="my-8 flex justify-center">
      {/* Glassmorphism card with animated background and lens effect */}
      <div
        ref={boxRef}
        className={`relative w-full max-w-md rounded-3xl overflow-hidden bg-gradient-to-r from-mint/80 via-ocean-blue/70 to-emerald/80 dark:from-ocean-blue/80 dark:via-sapphire/70 dark:to-mint/80 p-8 shadow-2xl backdrop-blur-xl border border-mint/40 dark:border-ocean-blue/40 group cursor-pointer transition-all duration-300 ${isOpen ? 'scale-105' : 'hover:scale-105'}`}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        style={{ minHeight: 180 }}
      >
        {/* Animated SVG rays background */}
        <Rays />
        {/* Reverse lens effect: blurred by default, clear lens on hover */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            filter: 'blur(2.5px)',
            maskImage: isHovering
              ? `radial-gradient(circle 90px at ${lensPos.x}px ${lensPos.y}px, transparent 80%, black 100%)`
              : undefined,
            WebkitMaskImage: isHovering
              ? `radial-gradient(circle 90px at ${lensPos.x}px ${lensPos.y}px, transparent 80%, black 100%)`
              : undefined,
            transition: 'mask-image 0.2s, -webkit-mask-image 0.2s',
          }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-transparent" />
        </motion.div>
        {/* Box content: icon, title, and fun fact content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Icon and title, blurred when not hovered */}
          <motion.div
            animate={{ filter: isHovering ? 'blur(0px)' : 'blur(2.5px)' }}
            className="flex flex-col items-center justify-center py-2"
          >
            <div className="text-4xl mb-2 select-none">{isOpen ? '🎉' : '🎁'}</div>
            <h3 className="font-bold text-lg text-white mb-2">Fun Fact</h3>
          </motion.div>
          {/* Fun Fact Content: animated in on reveal */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 60 }}
                className="mt-2 bg-white/80 dark:bg-zinc-900/80 text-gray-900 dark:text-white rounded-xl p-4 shadow-lg border border-mint/40 dark:border-ocean-blue/40 w-full"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal dark:border-ocean-blue"></div>
                    <p>Loading fun fact...</p>
                  </div>
                ) : error ? (
                  <p className="text-red-600 dark:text-red-400 flex items-center gap-2">
                    <span>😞</span>
                    {error}
                  </p>
                ) : (
                  <p className="text-lg leading-relaxed">{fact}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Hint text when closed */}
          {!isOpen && !loading && !error && fact && (
            <p className="text-center text-white/80 dark:text-mint mt-2 text-sm">
              👆 Click the gift box to reveal a fun fact!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FunFactBox; 