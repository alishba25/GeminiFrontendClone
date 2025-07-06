import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// ContainerScroll: Scrollable container with animated title and children
const ContainerScroll = ({ titleComponent, children }) => {
  // Ref for the scrollable container
  const containerRef = useRef(null);
  // Animation controls for the title
  const controls = useAnimation();
  // State to track scroll position
  const [scrolled, setScrolled] = useState(false);

  // Animate the title on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      setScrolled(scrollTop > 40);
      controls.start({ opacity: scrollTop > 40 ? 0.7 : 1, y: scrollTop > 40 ? -30 : 0 });
    };
    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (ref) ref.removeEventListener('scroll', handleScroll);
    };
  }, [controls]);

  return (
    // Main scrollable container
    <div ref={containerRef} className="h-full w-full overflow-y-auto">
      {/* Animated title/header */}
      <motion.div animate={controls} className="sticky top-0 z-10 bg-transparent pt-8 pb-2">
        {titleComponent}
      </motion.div>
      {/* Main content (children) */}
      <div className="w-full max-w-6xl mx-auto px-2 md:px-8">
        {children}
      </div>
    </div>
  );
};

export default ContainerScroll; 