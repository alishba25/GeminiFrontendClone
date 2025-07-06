import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../components/SearchBar';
import CountryCard from '../components/CountryCard';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { fetchCountriesByName, fetchCountrySuggestions } from '../services/api';
import HeroScroll from '../components/HeroScroll';

const PAGE_SIZE = 12;

const LandingPage = () => {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);

  const { data, isLoading, isError, error } = useQuery(
    ['countries', search],
    () => fetchCountriesByName(search),
    { enabled: !!search }
  );

  const paginated = data ? data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : [];
  const totalPages = data ? Math.ceil(data.length / PAGE_SIZE) : 1;

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
    <HeroScroll
      titleComponent={
        <h1 className="text-4xl font-semibold text-black dark:text-white">
          Welcome to <br />
          <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
            Country Explorer
          </span>
        </h1>
      }
    >
      <div className="flex flex-col items-center justify-start h-full w-full mt-8">
        <div className="w-full max-w-xl">
          <SearchBar
            value={query}
            onChange={handleInputChange}
            onSubmit={() => {
              setSearch(query);
              setPage(1);
            }}
            suggestions={suggestions}
          />
        </div>
        {isLoading && (
          <div className="mt-6 flex items-center justify-center w-full">
            <Loader />
          </div>
        )}
        {isError && <Error message={error.message} />}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {paginated.map(country => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
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
    </HeroScroll>
  );
};

export default LandingPage;