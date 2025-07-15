// main.tsx
// Entry point for the React app: sets up theme toggling and renders the App component

import './index.css'; // Import global styles and Tailwind CSS
import React, { useEffect } from 'react';
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Type for theme appearance
type Appearance = 'light' | 'dark';

// Root component manages theme and provides props to App
function Root() {
  // State for current theme (light or dark)
  const [appearance, setAppearance] = useState<Appearance>('light');
  // Function to toggle between light and dark mode
  const toggleAppearance = () =>
    setAppearance((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // Add or remove 'dark' class on html element for Tailwind dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (appearance === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [appearance]);

  // Pass theme state and toggle function to App
  return (
    <App appearance={appearance} toggleAppearance={toggleAppearance} />
  );
}

// Mount the React app to the root div in index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
