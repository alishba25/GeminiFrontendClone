import React from 'react';
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import AuthForm from "./features/auth/AuthForm";
import Dashboard from "./features/dashboard/Dashboard";
import Chatroom from "./features/chat/Chatroom";
import { useChatState } from "./store/chatState";
// Removed Mantine imports

interface AppProps {
  appearance: 'light' | 'dark';
  toggleAppearance: () => void;
}

function App({ appearance, toggleAppearance }: AppProps) {
  // Track login state
  const [loggedIn, setLoggedIn] = useState(false);
  // Zustand chat state
  const { currentChatroomId } = useChatState();

  // Check localStorage for auth state on mount
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        if (parsed.loggedIn) setLoggedIn(true);
      } catch {}
    }
  }, []);

  // Callback for AuthForm to set login state
  const handleLoginSuccess = () => setLoggedIn(true);

  return (
    <>
      <Toaster position="top-center" />
      {/* Main app container using Tailwind for layout and background */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        {!loggedIn ? (
          <AuthForm onLoginSuccess={handleLoginSuccess} appearance={appearance} toggleAppearance={toggleAppearance} />
        ) : currentChatroomId ? (
          <Chatroom />
        ) : (
          <Dashboard appearance={appearance} toggleAppearance={toggleAppearance} />
        )}
      </div>
    </>
  );
}

export default App;
