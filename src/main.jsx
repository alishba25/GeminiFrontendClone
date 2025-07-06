import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

// Create a QueryClient instance for react-query
const queryClient = new QueryClient();

// main.jsx: Entry point for the React app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provide react-query client and router context to the app */}
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
); 