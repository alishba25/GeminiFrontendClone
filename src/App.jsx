import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CountryPage from './pages/CountryPage';
import ThemeToggle from './components/ThemeToggle';

// App: Main application component with theme toggle and routing
function App() {
  return (
    // App background and theme
    <div className="min-h-screen h-full bg-cream dark:bg-deep-charcoal text-gray-900 dark:text-white transition-colors">
      {/* Fixed theme toggle button in top-right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Main content area with max width and padding */}
      <main className="p-4 max-w-6xl mx-auto w-full h-full">
        {/* App routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/country/:code" element={<CountryPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 