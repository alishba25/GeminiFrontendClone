import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button
      className="p-4 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 dark:from-black/30 dark:to-black/10 backdrop-blur-md border border-white/40 dark:border-white/20 hover:from-white/40 hover:to-white/20 dark:hover:from-black/40 dark:hover:to-black/20 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-110 relative overflow-hidden group"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle dark mode"
      type="button"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-emerald/20 dark:from-ocean-blue/20 dark:to-sapphire/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <span className={`text-2xl transition-all duration-700 ${dark ? 'rotate-0 opacity-100 scale-100' : 'rotate-180 opacity-0 scale-75 absolute inset-0'}`}>
          🌙
        </span>
        <span className={`text-2xl transition-all duration-700 ${dark ? 'rotate-180 opacity-0 scale-75 absolute inset-0' : 'rotate-0 opacity-100 scale-100'}`}>
          ☀️
        </span>
      </div>
      
      {/* Floating particles */}
      <div className="absolute top-1 left-1 w-1 h-1 bg-teal/60 dark:bg-ocean-blue/60 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
      <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-emerald/60 dark:bg-sapphire/60 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
    </button>
  );
};

export default ThemeToggle; 