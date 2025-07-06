import React from 'react';
import { Link } from 'react-router-dom';

// CountryCard: Displays a summary card for a country with flag, name, and region
const CountryCard = ({ country }) => (
  // Card links to the country details page
  <Link
    to={`/country/${country.cca3}`}
    className="block bg-white dark:bg-rich-purple rounded shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-mint dark:border-neon-pink hover:scale-105"
  >
    {/* Country flag image */}
    <img
      src={country.flags?.svg || country.flags?.png}
      alt={country.name?.common + ' flag'}
      className="w-full h-40 object-cover"
    />
    {/* Country name and region */}
    <div className="p-4">
      <h2 className="font-bold text-lg mb-1">{country.name?.common}</h2>
      <p className="text-sm text-gray-600 dark:text-dusty-peach">{country.region}</p>
    </div>
  </Link>
);

export default CountryCard; 