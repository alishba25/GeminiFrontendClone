import React, { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';

const MovingBorder = ({ children, duration = 3000, rx = '30%', ry = '30%' }) => {
  const pathRef = useRef();
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val)?.x || 0);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val)?.y || 0);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'inline-block',
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

// MovingBorderButton: Button with animated, glowing border and glassy style
const MovingBorderButton = ({ children, className = '', ...props }) => {
  return (
    // Button with animated border using pseudo-elements and gradients
    <button
      {...props}
      className={`relative px-6 py-2 rounded-full font-semibold bg-white/30 dark:bg-zinc-900/40 text-gray-900 dark:text-white shadow-lg overflow-hidden border-2 border-mint dark:border-ocean-blue transition-colors duration-200 group focus:outline-none ${className}`}
      style={{ boxShadow: '0 2px 16px 0 rgba(31, 38, 135, 0.10)' }}
    >
      {/* Animated border using before/after pseudo-elements */}
      <span className="absolute inset-0 rounded-full pointer-events-none z-0 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-mint before:via-ocean-blue before:to-emerald before:blur before:opacity-60 before:animate-move-border after:absolute after:inset-0 after:rounded-full after:bg-white/10 after:opacity-60" />
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};

export default MovingBorderButton; 