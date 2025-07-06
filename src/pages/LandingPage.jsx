import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../components/SearchBar';
import CountryCard from '../components/CountryCard';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { fetchCountriesByName, fetchCountrySuggestions } from '../services/api';
import ContainerScroll from '../components/ContainerScroll';
import { motion, AnimatePresence } from 'framer-motion';

const PAGE_SIZE = 12;

// Animation variants for country cards
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.5,
      type: 'spring',
      stiffness: 60,
    },
  }),
};

// LandingPage: Main landing/search page for the app
const LandingPage = () => {
  // State for search query, submitted search, page, and suggestions
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch countries matching the search
  const { data, isLoading, isError, error } = useQuery(
    ['countries', search],
    () => fetchCountriesByName(search),
    { enabled: !!search }
  );

  // Paginate results
  const paginated = data ? data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [];
  const totalPages = data ? Math.ceil(data.length / PAGE_SIZE) : 1;

  // Handle input change and fetch suggestions
  const handleInputChange = async (val) => {
    const value = typeof val === 'string' ? val : val.target.value;
    setQuery(value);
    if (value.length > 1) {
      try {
        const sugg = await fetchCountrySuggestions(value);
        setSuggestions(sugg.slice(0, 5));
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    // Main scrollable container with animated hero/title
    <ContainerScroll
      titleComponent={
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center justify-center">
            {/* Glassmorphism card for hero/title */}
            <div className="backdrop-blur-xl bg-white/40 dark:bg-zinc-800/40 border border-white/30 dark:border-zinc-600/40 rounded-3xl shadow-2xl px-8 py-10 md:px-16 md:py-16 mb-4 max-w-3xl mx-auto" style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)'}}>
              <h1 className="text-3xl md:text-6xl font-extrabold text-center text-gray-900 dark:text-white tracking-tight">
                Welcome to
                <br />
                <span className="block text-4xl md:text-7xl font-bold bg-gradient-to-r from-teal via-sapphire to-emerald dark:from-ocean-blue dark:via-sapphire dark:to-mint bg-clip-text text-transparent mt-2">
                  Country Explorer
                </span>
              </h1>
            </div>
          </div>
        </div>
      }
    >
      {/* Search bar and results grid */}
      <div className="flex flex-col items-center justify-center h-full w-full">
        {/* Search bar with suggestions */}
        <SearchBar
          value={query}
          onChange={handleInputChange}
          onSubmit={() => {
            setSearch(query);
            setPage(1);
          }}
          suggestions={suggestions}
        />
        <div className="mt-8 w-full">
          {/* Loader and error display */}
          {isLoading && <Loader />}
          {isError && <Error message={error.message} />}
          {/* Animated country cards grid */}
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              {paginated.map((country, i) => (
                <motion.div
                  key={country.cca3}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={cardVariants}
                  layout
                >
                  <CountryCard country={country} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
          {data && data.length > PAGE_SIZE && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                className="px-3 py-1 rounded bg-mint dark:bg-ocean-blue hover:bg-teal dark:hover:bg-sapphire disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="text-gray-800 dark:text-white">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-mint dark:bg-ocean-blue hover:bg-teal dark:hover:bg-sapphire disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </ContainerScroll>
  );
};

export default LandingPage; 