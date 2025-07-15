// ThemeToggle.tsx
// This component provides a button to toggle between light and dark themes.
// It is designed to be accessible, visually appealing, and easy to integrate.

import React from 'react';

// Props for ThemeToggle:
// - appearance: current theme mode ('light' or 'dark')
// - toggleAppearance: function to switch between themes
interface ThemeToggleProps {
  appearance: 'light' | 'dark'; // Current theme mode
  toggleAppearance: () => void; // Function to toggle theme
}

// ThemeToggle component definition
const ThemeToggle = ({ appearance, toggleAppearance }: ThemeToggleProps) => {
  return (
    // Button to toggle theme
    <button
      onClick={toggleAppearance} // Calls the toggle function when clicked
      // ARIA label updates for accessibility, describing the action
      aria-label={appearance === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      // Styling: circular button, border, shadow, scaling on hover, focus outline for accessibility
      className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-mint bg-white shadow-md transition hover:scale-110 focus:outline-none"
    >
      {/* Icon changes based on current theme: sun for dark mode, moon for light mode */}
      <span className="text-2xl transition-transform duration-200">
        {appearance === 'dark' ? '🌞' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle; // Export the component for use in other files 