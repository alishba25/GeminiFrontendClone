import React from 'react';

const Error = ({ message }) => (
  <div className="bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded p-4 my-4 shadow border border-red-200 dark:border-red-700">
    <p>{message}</p>
  </div>
);

export default Error; 