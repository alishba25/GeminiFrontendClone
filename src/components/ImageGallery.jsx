import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ImageGallery: A simple, plain image carousel with autoplay and navigation
const ImageGallery = ({ count = 6, autoplayInterval = 6000 }) => {
  // Generate an array of random image URLs
  const images = Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${Math.random() * 1000}/800/500`);

  // State for the current image index
  const [current, setCurrent] = useState(0);
  // State to pause autoplay on hover or interaction
  const [isPaused, setIsPaused] = useState(false);
  // Ref to store the autoplay interval
  const autoplayRef = useRef();

  // Autoplay: advance to the next image every autoplayInterval ms
  useEffect(() => {
    if (isPaused) return; // Pause autoplay if needed
    autoplayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, autoplayInterval);
    // Clear interval on cleanup or when paused
    return () => clearInterval(autoplayRef.current);
  }, [isPaused, images.length, autoplayInterval]);

  // Go to previous image and pause autoplay
  const prevImage = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
    setIsPaused(true);
  };
  // Go to next image and pause autoplay
  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % images.length);
    setIsPaused(true);
  };
  // Go to a specific image (dot navigation) and pause autoplay
  const handleDotClick = (i) => {
    setCurrent(i);
    setIsPaused(true);
  };

  return (
    // Carousel wrapper: centers content and handles pause on hover
    <div
      className="relative flex flex-col items-center justify-center min-h-[300px] py-4 mb-8 w-full"
      onMouseEnter={() => setIsPaused(true)} // Pause autoplay on hover
      onMouseLeave={() => setIsPaused(false)} // Resume autoplay on mouse leave
      style={{ maxWidth: '100vw' }}
    >
      {/* Carousel area: image and navigation arrows */}
      <div className="relative w-full max-w-md h-[220px] flex items-center justify-center mx-auto">
        {/* Left arrow: go to previous image */}
        <button
          onClick={prevImage}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-mint/80 dark:bg-ocean-blue/80 hover:bg-mint dark:hover:bg-sapphire text-gray-900 dark:text-white rounded-full p-2 shadow-lg transition-colors flex items-center justify-center"
          aria-label="Previous image"
          style={{ minWidth: 40, minHeight: 40 }}
        >
          <span className="text-2xl">&#8592;</span>
        </button>
        {/* Main image: animated fade/slide in/out */}
        <div className="w-full flex items-center justify-center">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={images[current]}
              src={images[current]}
              alt={`Country gallery ${current + 1}`}
              className="object-cover rounded-2xl shadow-xl border-2 border-mint dark:border-ocean-blue w-full h-[220px] mx-12 select-none"
              initial={{ opacity: 0, x: 40 }} // Animation: fade/slide in from right
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }} // Animation: fade/slide out to left
              transition={{ duration: 0.4, type: 'spring', stiffness: 60 }}
            />
          </AnimatePresence>
        </div>
        {/* Right arrow: go to next image */}
        <button
          onClick={nextImage}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-mint/80 dark:bg-ocean-blue/80 hover:bg-mint dark:hover:bg-sapphire text-gray-900 dark:text-white rounded-full p-2 shadow-lg transition-colors flex items-center justify-center"
          aria-label="Next image"
          style={{ minWidth: 40, minHeight: 40 }}
        >
          <span className="text-2xl">&#8594;</span>
        </button>
      </div>
      {/* Dots indicator: show current image and allow navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`w-3 h-3 rounded-full ${i === current ? 'bg-mint dark:bg-ocean-blue' : 'bg-mint/40 dark:bg-ocean-blue/40'} transition-colors`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery; 