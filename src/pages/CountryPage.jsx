import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCountryByCode, fetchNumberFact } from '../services/api';
import CountryDetails from '../components/CountryDetails';
import FunFactBox from '../components/FunFactBox';
import ImageGallery from '../components/ImageGallery';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { motion } from 'framer-motion';
import MovingBorderButton from '../components/MovingBorderButton';

// Animation variants for fade-in-up effect
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      type: 'spring',
      stiffness: 60,
    },
  }),
};

// CountryPage: Shows details, fun fact, and gallery for a selected country
const CountryPage = () => {
  // Get country code from URL params
  const { code } = useParams();
  // Fetch country data
  const {
    data: country,
    isLoading,
    isError,
    error,
  } = useQuery(['country', code], () => fetchCountryByCode(code), { enabled: !!code });

  // Fetch fun fact about the country's population
  const {
    data: fact,
    isLoading: factLoading,
    isError: factError,
    error: factErrorMsg,
  } = useQuery(
    ['fact', country?.population],
    () => fetchNumberFact(country.population),
    { enabled: !!country?.population }
  );

  // Show loader or error if needed
  if (isLoading) return <Loader />;
  if (isError) return <Error message={error.message} />;

  return (
    // Main page background and layout
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-mint/60 via-cream/70 to-teal/30 dark:from-deep-charcoal dark:via-rich-purple dark:to-sapphire transition-colors duration-500">
      {/* Animated background sparkles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-mint/60 via-cream/70 to-teal/30 dark:from-deep-charcoal dark:via-rich-purple dark:to-sapphire animate-pulse opacity-80"></div>
        {/* Random sparkles for visual effect */}
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 dark:bg-white/10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          />
        ))}
      </div>
      {/* Country details card */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="w-full max-w-3xl mx-auto"
      >
        <CountryDetails country={country} />
      </motion.div>
      {/* Shared wrapper for FunFactBox and ImageGallery, vertically stacked and centered */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Fun Fact box with animated lens effect */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
          className="w-full"
        >
          <FunFactBox
            fact={fact}
            loading={factLoading}
            error={factError ? factErrorMsg.message : null}
          />
        </motion.div>
        {/* Plain image carousel below fun fact */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={2}
          className="w-full"
        >
          <ImageGallery count={6} />
        </motion.div>
      </div>
      {/* Back to Search button at the bottom */}
      <div className="flex justify-center mt-8 mb-4">
        <Link to="/">
          <MovingBorderButton>
            <span className="mr-2">←</span> Back to Search
          </MovingBorderButton>
        </Link>
      </div>
    </div>
  );
};

export default CountryPage; 