import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroScroll = ({ children }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

  // Animate scale, opacity, and translateY as you scroll
  const scale = useTransform(scrollYProgress, [0, 0.7], [1, 0.7]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.7, 0]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-mint via-ocean-blue to-deep-charcoal dark:from-deep-charcoal dark:via-ocean-blue dark:to-sapphire">
      {/* Animated background sparkles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/30 dark:bg-white/10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>
      {/* Animated floating shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-24 h-24 bg-gradient-to-br from-teal/30 to-emerald/30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-gradient-to-br from-ocean-blue/30 to-sapphire/30 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }}></div>
      </div>
      {/* Hero content with scroll animation */}
      <motion.div
        style={{ scale, opacity, y: translateY }}
        className="relative z-10 flex flex-col items-center justify-center min-h-[60vh]"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-center bg-gradient-to-r from-gray-800 via-teal to-emerald dark:from-white dark:via-ocean-blue dark:to-sapphire bg-clip-text text-transparent drop-shadow-lg mb-6">
          Country Explorer
        </h1>
        <p className="text-lg md:text-2xl text-center text-gray-700 dark:text-gray-200 max-w-2xl mb-2">
          Discover the world, one country at a time.
        </p>
      </motion.div>
      {/* Subtle bottom fade for smooth transition */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-24 z-20" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--tw-bg-opacity,1) 100%)',
        backgroundColor: 'inherit',
        mixBlendMode: 'multiply'
      }} />
      {/* Children (main content) rendered below hero */}
      <div className="relative z-20 w-full">
        {children}
      </div>
    </section>
  );
};

export default HeroScroll; 