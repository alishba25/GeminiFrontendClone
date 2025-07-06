import React, { useRef } from 'react';

// GlareCard: Glassmorphism card with interactive 3D tilt and glare effect
const GlareCard = ({ children }) => {
  // Ref to track if pointer is inside the card
  const isPointerInside = useRef(false);
  // Ref to the card DOM element
  const refElement = useRef(null);
  // Ref to store glare and rotation state
  const state = useRef({
    glare: { x: 50, y: 50 }, // Glare position (percentage)
    rotate: { x: 0, y: 0 },  // Rotation angles
  });
  // Initial CSS variables for glare and rotation
  const containerStyle = {
    '--m-x': '50%',
    '--m-y': '50%',
    '--r-x': '0deg',
    '--r-y': '0deg',
    '--duration': '300ms',
    '--radius': '32px',
    '--opacity': '0.25',
    '--easing': 'ease',
    '--transition': 'var(--duration) var(--easing)',
  };
  // Update CSS variables for glare and rotation
  const updateStyles = () => {
    if (refElement.current) {
      const { rotate, glare } = state.current;
      refElement.current.style.setProperty('--m-x', `${glare.x}%`);
      refElement.current.style.setProperty('--m-y', `${glare.y}%`);
      refElement.current.style.setProperty('--r-x', `${rotate.x}deg`);
      refElement.current.style.setProperty('--r-y', `${rotate.y}deg`);
    }
  };
  return (
    // Card container with interactive glare and tilt
    <div
      style={containerStyle}
      className="relative isolate [perspective:600px] transition-transform duration-[var(--duration)] ease-[var(--easing)] will-change-transform w-full max-w-3xl mx-auto my-8"
      ref={refElement}
      onPointerMove={event => {
        // Calculate pointer position and update glare/rotation
        const rotateFactor = 0.4;
        const rect = event.currentTarget.getBoundingClientRect();
        const position = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        const percentage = {
          x: (100 / rect.width) * position.x,
          y: (100 / rect.height) * position.y,
        };
        const delta = {
          x: percentage.x - 50,
          y: percentage.y - 50,
        };
        const { rotate, glare } = state.current;
        rotate.x = -(delta.x / 3.5) * rotateFactor;
        rotate.y = delta.y / 2 * rotateFactor;
        glare.x = percentage.x;
        glare.y = percentage.y;
        updateStyles();
      }}
      onPointerEnter={() => {
        isPointerInside.current = true;
        if (refElement.current) {
          setTimeout(() => {
            if (isPointerInside.current) {
              refElement.current.style.setProperty('--duration', '0s');
            }
          }, 300);
        }
      }}
      onPointerLeave={() => {
        isPointerInside.current = false;
        if (refElement.current) {
          refElement.current.style.removeProperty('--duration');
          refElement.current.style.setProperty('--r-x', `0deg`);
          refElement.current.style.setProperty('--r-y', `0deg`);
        }
      }}
    >
      {/* Card visual and glare effect */}
      <div className="h-full w-full rounded-[var(--radius)] border border-mint/60 dark:border-zinc-600/40 bg-gradient-to-br from-mint/60 via-cream/70 to-teal/30 dark:bg-zinc-800/40 shadow-2xl backdrop-blur-xl overflow-hidden relative transition-transform duration-[var(--duration)] ease-[var(--easing)] [transform:rotateY(var(--r-x))_rotateX(var(--r-y))]">
        {/* Glare effect overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-[var(--radius)] opacity-[var(--opacity)]" style={{
          background: 'radial-gradient(circle at var(--m-x) var(--m-y), rgba(255,255,255,0.7) 10%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 80%)',
          zIndex: 2,
        }} />
        {/* Card content */}
        <div className="relative z-10 p-6 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

// CountryDetails: Shows country info inside a GlareCard
const CountryDetails = ({ country }) => {
  if (!country) return null;
  return (
    <GlareCard>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Country flag */}
        <img
          src={country.flags?.svg || country.flags?.png}
          alt={country.name?.common + ' flag'}
          className="w-40 h-28 object-cover border-2 border-mint dark:border-ocean-blue rounded shadow-lg transition-transform duration-300 hover:scale-105"
        />
        {/* Country details text */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white drop-shadow">{country.name?.official}</h2>
          <p className="text-gray-700 dark:text-dusty-peach mb-1">
            <span className="font-semibold">Native Name:</span> {Object.values(country.name?.nativeName || {})[0]?.common || '-'}
          </p>
          <p className="mb-1 text-gray-700 dark:text-white"><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
          <p className="mb-1 text-gray-700 dark:text-white"><span className="font-semibold">Capital:</span> {country.capital?.join(', ') || '-'}</p>
          <p className="mb-1 text-gray-700 dark:text-white"><span className="font-semibold">Region:</span> {country.region}</p>
          <p className="mb-1 text-gray-700 dark:text-white"><span className="font-semibold">Subregion:</span> {country.subregion || '-'}</p>
          <p className="mb-1 text-gray-700 dark:text-white"><span className="font-semibold">Languages:</span> {country.languages ? Object.values(country.languages).join(', ') : '-'}</p>
          <p className="mb-1 text-gray-700 dark:text-white"><span className="font-semibold">Currencies:</span> {country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : '-'}</p>
          <p className="mb-1 text-gray-700 dark:text-white"><span className="font-semibold">Timezones:</span> {country.timezones?.join(', ')}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country.name?.common)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal dark:text-ocean-blue underline mt-2 inline-block hover:text-emerald dark:hover:text-sapphire transition-colors"
          >
            View on Google Maps
          </a>
        </div>
      </div>
    </GlareCard>
  );
};

export default CountryDetails; 