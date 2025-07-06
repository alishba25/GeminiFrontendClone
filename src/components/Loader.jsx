import React from 'react';

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal dark:border-ocean-blue" style={{ boxShadow: '0 0 10px rgba(20, 184, 166, 0.5)' }}></div>
  </div>
);

export default Loader; 