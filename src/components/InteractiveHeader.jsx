import React, { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';

const InteractiveHeader = ({ children }) => {
  const [hovered, setHovered] = useState(false);
  const [beams, setBeams] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [ambientSparkles, setAmbientSparkles] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Generate beams
  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.clientHeight;
      const numberOfBeams = Math.floor(height / 12);
      const newBeams = Array.from({ length: numberOfBeams }, (_, i) => ({
        id: i,
        top: (i + 1) * (height / (numberOfBeams + 1)),
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 1
      }));
      setBeams(newBeams);
    }
  }, []);

  // Generate sparkles (active, on hover)
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2,
        type: Math.random() > 0.5 ? 'star' : 'circle'
      }));
      setSparkles(newSparkles);
    };
    if (hovered) {
      generateSparkles();
      const interval = setInterval(generateSparkles, 4000);
      return () => clearInterval(interval);
    }
  }, [hovered]);

  // Generate ambient sparkles (always on, subtle)
  useEffect(() => {
    const generateAmbient = () => {
      const newAmbient = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        duration: Math.random() * 8 + 6,
        opacity: Math.random() * 0.3 + 0.1,
        type: Math.random() > 0.7 ? 'star' : 'circle'
      }));
      setAmbientSparkles(newAmbient);
    };
    generateAmbient();
    const interval = setInterval(generateAmbient, 9000);
    return () => clearInterval(interval);
  }, []);

  // Handle mouse movement for ripple effects
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Create ripple effect
  const createRipple = () => {
    const newRipple = {
      id: Date.now(),
      x: mousePos.x,
      y: mousePos.y,
      size: 0
    };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={createRipple}
      className="relative flex items-center justify-center p-8 overflow-hidden group cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(152, 216, 200, 0.8) 0%, rgba(20, 184, 166, 0.6) 25%, rgba(16, 185, 129, 0.4) 50%, rgba(14, 165, 233, 0.3) 75%, rgba(245, 245, 220, 0.1) 100%)'
      }}
    >
      {/* Dark theme overlay */}
      <div className="dark:block hidden absolute inset-0" style={{
        background: 'linear-gradient(135deg, rgba(58, 12, 163, 0.8) 0%, rgba(14, 165, 233, 0.6) 25%, rgba(59, 130, 246, 0.4) 50%, rgba(15, 118, 110, 0.3) 75%, rgba(11, 15, 26, 0.1) 100%)'
      }}></div>

      {/* Enhanced animated background pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.4) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.4) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(14, 165, 233, 0.4) 0%, transparent 50%),
                           radial-gradient(circle at 60% 40%, rgba(152, 216, 200, 0.3) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Floating geometric shapes (always visible, subtle) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 left-1/4 w-6 h-6 border-2 border-teal/30 dark:border-ocean-blue/30 transform rotate-45 animate-spin" style={{ animationDuration: '12s', opacity: 0.25 }}></div>
        <div className="absolute top-8 right-1/3 w-4 h-4 border-2 border-emerald/30 dark:border-sapphire/30 transform -rotate-45 animate-spin" style={{ animationDuration: '18s', animationDirection: 'reverse', opacity: 0.18 }}></div>
        <div className="absolute bottom-6 left-1/2 w-5 h-5 border-2 border-ocean-blue/30 dark:border-teal/30 transform rotate-90 animate-spin" style={{ animationDuration: '15s', opacity: 0.18 }}></div>
        <div className="absolute top-2 right-1/4 w-3 h-3 bg-gradient-to-br from-teal/20 to-emerald/20 dark:from-ocean-blue/20 dark:to-sapphire/20 transform rotate-45 animate-bounce" style={{ animationDelay: '0.5s', opacity: 0.18 }}></div>
        <div className="absolute bottom-4 left-1/3 w-2 h-2 bg-gradient-to-br from-emerald/20 to-teal/20 dark:from-sapphire/20 dark:to-ocean-blue/20 transform rotate-45 animate-bounce" style={{ animationDelay: '1.5s', opacity: 0.18 }}></div>
        <div className="absolute top-6 left-1/2 w-3 h-3 bg-teal/30 dark:bg-ocean-blue/30 rounded-full animate-bounce" style={{ animationDelay: '0s', opacity: 0.18 }}></div>
        <div className="absolute top-10 right-1/4 w-2 h-2 bg-emerald/30 dark:bg-sapphire/30 rounded-full animate-bounce" style={{ animationDelay: '1s', opacity: 0.18 }}></div>
        <div className="absolute bottom-8 left-1/3 w-1.5 h-1.5 bg-teal/30 dark:bg-ocean-blue/30 rounded-full animate-bounce" style={{ animationDelay: '2s', opacity: 0.18 }}></div>
      </div>

      {/* Ambient sparkles (always on, subtle) */}
      {ambientSparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className={`absolute ${sparkle.type === 'star' ? 'text-yellow-200' : 'bg-white'} rounded-full`}
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            opacity: sparkle.opacity,
            fontSize: `${sparkle.size}px`,
            transition: 'all 2s linear'
          }}
        >
          {sparkle.type === 'star' && '⭐'}
        </div>
      ))}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute w-0 h-0 bg-white/20 dark:bg-white/10 rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            animation: 'ripple-expand 1s ease-out forwards'
          }}
        />
      ))}

      {/* Enhanced sparkles (on hover) */}
      {hovered && sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className={`absolute ${sparkle.type === 'star' ? 'text-yellow-300' : 'bg-white'} rounded-full animate-ping`}
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
            fontSize: `${sparkle.size}px`
          }}
        >
          {sparkle.type === 'star' && '⭐'}
        </div>
      ))}

      {/* Enhanced beams with glow */}
      {beams.map((beam) => (
        <div key={beam.id} className="relative">
          <div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal to-transparent dark:via-ocean-blue"
            style={{
              top: `${beam.top}px`,
              animation: hovered ? 'beam-sweep 0.5s linear infinite' : 'beam-sweep 2s linear infinite',
              animationDelay: `${beam.delay}s`,
              animationDuration: `${beam.duration}s`
            }}
          />
          {/* Beam glow effect */}
          <div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal/30 to-transparent dark:via-ocean-blue/30 blur-sm"
            style={{
              top: `${beam.top}px`,
              animation: hovered ? 'beam-sweep 0.5s linear infinite' : 'beam-sweep 2s linear infinite',
              animationDelay: `${beam.delay}s`,
              animationDuration: `${beam.duration}s`
            }}
          />
        </div>
      ))}

      {/* Main content with enhanced effects */}
      <div className="relative z-10 flex items-center">
        {/* Enhanced animated logo */}
        <div className="mr-4 relative group/logo">
          <div className="w-12 h-12 bg-gradient-to-br from-teal via-emerald to-ocean-blue dark:from-ocean-blue dark:via-sapphire dark:to-deep-teal rounded-xl shadow-2xl flex items-center justify-center animate-pulse relative overflow-hidden transition-transform duration-300 hover:scale-110">
            {/* Multiple rotating border effects */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-teal/30 to-transparent animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>
            <span className="text-white text-2xl font-bold relative z-10 transition-transform duration-300 group-hover/logo:scale-110">🌍</span>
          </div>
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-teal to-emerald dark:from-ocean-blue dark:to-sapphire rounded-xl blur-lg opacity-50 animate-pulse" style={{ animationDuration: '2s' }}></div>
          {/* Additional outer glow */}
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-teal/20 to-emerald/20 dark:from-ocean-blue/20 dark:to-sapphire/20 rounded-xl blur-xl opacity-30 animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
        </div>

        {/* Enhanced interactive title */}
        <div className="relative">
          <h1 
            className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-teal to-emerald dark:from-white dark:via-ocean-blue dark:to-sapphire bg-clip-text text-transparent transition-all duration-300 ${
              hovered ? 'scale-105' : 'scale-100'
            }`}
            style={{
              transform: hovered ? 'translateX(10px)' : 'translateX(0)',
              filter: hovered ? 'drop-shadow(0 0 15px rgba(20, 184, 166, 0.6))' : 'none',
              textShadow: hovered ? '0 0 20px rgba(20, 184, 166, 0.3)' : 'none'
            }}
          >
            {children}
          </h1>
          {/* Enhanced animated underline */}
          <div 
            className={`h-1 bg-gradient-to-r from-transparent via-teal to-transparent dark:via-ocean-blue mt-1 transition-all duration-300 ${
              hovered ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}
            style={{
              boxShadow: hovered ? '0 0 10px rgba(20, 184, 166, 0.5)' : 'none'
            }}
          />
        </div>
      </div>

      {/* Theme toggle with enhanced positioning */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10">
        <ThemeToggle />
      </div>

      {/* Enhanced corner decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-teal/40 dark:border-ocean-blue/40 rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-emerald/40 dark:border-sapphire/40 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-ocean-blue/40 dark:border-teal/40 rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-sapphire/40 dark:border-emerald/40 rounded-br-lg"></div>

      {/* Enhanced floating particles */}
      <div className="absolute top-1/2 left-8 w-8 h-8 bg-gradient-to-r from-teal/30 to-emerald/30 dark:from-ocean-blue/30 dark:to-sapphire/30 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
      <div className="absolute top-1/2 right-8 w-6 h-6 bg-gradient-to-r from-emerald/30 to-teal/30 dark:from-sapphire/30 dark:to-ocean-blue/30 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-to-r from-ocean-blue/40 to-sapphire/40 dark:from-teal/40 dark:to-emerald/40 rounded-full blur-sm animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-gradient-to-r from-sapphire/30 to-ocean-blue/30 dark:from-emerald/30 dark:to-teal/30 rounded-full blur-sm animate-pulse" style={{ animationDuration: '6s', animationDelay: '0.5s' }}></div>

      {/* Subtle bottom fade for smooth header ending */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-10 z-30" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--tw-bg-opacity,1) 100%)',
        backgroundColor: 'inherit',
        mixBlendMode: 'multiply'
      }} />
    </div>
  );
};

export default InteractiveHeader; 