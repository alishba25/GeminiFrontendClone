import React, { useState, useRef } from 'react';

// SearchBar: Modern, animated search input with suggestions
const SearchBar = ({ value, onChange, onSubmit, suggestions = [] }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    // Search form wrapper
    <div className="w-full max-w-xl mx-auto relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative w-full h-14 bg-white dark:bg-rich-purple rounded-full 
          shadow-lg border-2 transition-all duration-300 ease-in-out
          ${isFocused 
            ? 'border-teal dark:border-ocean-blue shadow-xl scale-105' 
            : 'border-mint dark:border-ocean-blue'
          }
          ${value ? 'bg-gray-50 dark:bg-deep-plum' : ''}
        `}>

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className="w-full h-full bg-transparent text-gray-900 dark:text-white text-sm sm:text-base pl-6 pr-16 focus:outline-none z-10 relative"
            placeholder="Search for a country..."
            style={{ pointerEvents: 'auto' }}
            autoComplete="off"
          />

          {/* Search button */}
          <button
            type="submit"
            disabled={!value}
            className={`
              absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full 
              flex items-center justify-center transition-all duration-300 z-20
              ${value 
                ? 'bg-teal hover:bg-emerald text-white shadow-lg scale-110 cursor-pointer' 
                : 'bg-gray-200 dark:bg-deep-plum text-gray-400 cursor-not-allowed'
              }
            `}
            onClick={(e) => {
              if (!value) {
                e.preventDefault();
                return;
              }
            }}
          >
            <svg
              className={`w-5 h-5 transition-all duration-300 ${value ? 'scale-110' : 'scale-90'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              pointerEvents="none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Glow effect */}
          {isFocused && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal/20 to-emerald/20 dark:from-ocean-blue/20 dark:to-sapphire/20 blur-xl -z-10 animate-pulse"></div>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-rich-purple border border-teal dark:border-ocean-blue rounded-lg shadow-xl z-50 overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-mint dark:hover:bg-ocean-blue/20 cursor-pointer transition-colors duration-200 text-gray-900 dark:text-white border-b border-gray-100 dark:border-deep-plum last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 