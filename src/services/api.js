import axios from 'axios';

// Base URLs for country and number facts APIs
const BASE_COUNTRIES = 'https://restcountries.com/v3.1';
const BASE_NUMBERS = 'https://numbersapi.com';

// Fetch all countries
export const fetchAllCountries = async () => {
  // GET request to fetch all countries
  const { data } = await axios.get(`${BASE_COUNTRIES}/all`);
  return data;
};

// Fetch countries by name (search)
export const fetchCountriesByName = async (name) => {
  // GET request to search countries by name
  const { data } = await axios.get(`${BASE_COUNTRIES}/name/${name}`);
  return data;
};

// Fetch a single country by code
export const fetchCountryByCode = async (code) => {
  // GET request to fetch a country by its code
  const { data } = await axios.get(`${BASE_COUNTRIES}/alpha/${code}`);
  return data[0];
};

// Fetch country suggestions for autocomplete
export const fetchCountrySuggestions = async (query) => {
  // GET request to search countries by name
  const { data } = await axios.get(`${BASE_COUNTRIES}/name/${query}`);
  // Return an array of country names for suggestions
  return data.map((c) => c.name.common);
};

// Fetch a fun fact about a number (e.g., population)
export const fetchNumberFact = async (number) => {
  // GET request to numbersapi for a fact about the number
  const { data } = await axios.get(`${BASE_NUMBERS}/${number}`);
  return data;
}; 