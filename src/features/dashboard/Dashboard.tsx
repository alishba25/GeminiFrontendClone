// Dashboard.tsx
// Dashboard page: lists chatrooms, allows creation/deletion, and theme toggling

import React, { useEffect, useState } from "react";
import { useChatroomStore } from "../../store/chatroomStore";
import { useChatState } from "../../store/chatState";
import toast from "react-hot-toast";
import ThemeToggle from "../../components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

// Props for theme toggling
interface DashboardProps {
  appearance: 'light' | 'dark';
  toggleAppearance: () => void;
}

// Animation variants for chatroom tiles
const tileVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 30 } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.2 } }
};

// Main Dashboard component
const Dashboard: React.FC<DashboardProps> = ({ appearance, toggleAppearance }) => {
  // Zustand store hooks for chatroom state
  const {
    chatrooms,
    search,
    setSearch,
    addChatroom,
    deleteChatroom,
    loadFromStorage,
  } = useChatroomStore();
  const { setCurrentChatroomId } = useChatState();

  // Local state for UI and form
  const [newTitle, setNewTitle] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [justCreated, setJustCreated] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search); // debounced search input
  const [loadingList, setLoadingList] = useState(true); // loading spinner for chatroom list
  const [titleError, setTitleError] = useState<string | null>(null); // error for chatroom title

  // Load chatrooms from localStorage and show loading spinner
  useEffect(() => {
    loadFromStorage();
    setLoadingList(true);
    const timer = setTimeout(() => setLoadingList(false), 600);
    return () => clearTimeout(timer);
  }, [loadFromStorage]);

  // Debounce search input for better UX
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput, setSearch]);

  // Filter chatrooms by search
  const filtered = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(search.toLowerCase())
  );

  // Validate chatroom title (length, not empty)
  const validateTitle = (title: string) => {
    if (!title.trim()) return "Chatroom title cannot be empty";
    if (title.trim().length < 2) return "Title must be at least 2 characters";
    if (title.trim().length > 32) return "Title must be at most 32 characters";
    return null;
  };

  // Handle chatroom creation
  const handleAdd = () => {
    const error = validateTitle(newTitle);
    setTitleError(error);
    if (error) return;
    addChatroom(newTitle.trim());
    setJustCreated(newTitle.trim());
    toast.success("Chatroom created");
    setNewTitle("");
    setTitleError(null);
    setTimeout(() => setJustCreated(null), 1200);
  };

  // Handle chatroom deletion
  const handleDelete = (id: string) => {
    deleteChatroom(id);
    toast.success("Chatroom deleted");
    setConfirmDelete(null);
  };

  // Handle logout (clear auth and reload)
  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.reload();
  };

  // --- UI ---
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-lemon via-mint to-white dark:from-dark-ebony dark:via-dark-mulberry dark:to-dark-rose px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard heading */}
        <h1 className="text-3xl font-extrabold text-white dark:text-dark-tan mb-2 text-center">Dashboard</h1>
        {/* Divider */}
        <div className="mb-8 border-b border-white dark:border-dark-tan" />
        {/* Header: title and theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-center flex-1 font-bold text-white dark:text-dark-tan">Your Chatrooms</h2>
          <div className="flex-shrink-0">
            <div className="bg-white border border-mint shadow-md rounded-full p-2 flex items-center justify-center dark:bg-dark-cocoa dark:border-dark-tan">
              <ThemeToggle appearance={appearance} toggleAppearance={toggleAppearance} />
            </div>
          </div>
        </div>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search chatrooms..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full px-3 py-2 border border-mint dark:border-dark-tan rounded-md mb-6 bg-lemon/40 dark:bg-dark-cocoa/60 !text-black dark:text-dark-tan placeholder:!text-black dark:placeholder:text-dark-tan"
        />
        {/* Chatroom Tiles Grid */}
        <div className="min-h-[220px] mb-6">
          {loadingList ? (
            // Loading spinner for chatroom list
            <div className="flex justify-center items-center h-48">
              <svg className="animate-spin h-8 w-8 text-mint dark:text-dark-tan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filtered.length === 0 ? (
                // Show only Create New tile if no chatrooms
                <div className="flex justify-center items-center h-48">
                  <motion.div
                    key="create-tile-alone"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`h-40 w-full max-w-xs flex flex-col items-center justify-center rounded-xl shadow-lg cursor-pointer transition group
                      bg-gradient-to-br from-mint via-aqua to-lemon hover:scale-105 hover:shadow-2xl hover:from-mint/80 hover:via-aqua/90 hover:to-lemon/90
                      dark:bg-none dark:bg-gradient-to-br dark:from-dark-tan dark:via-dark-cocoa dark:to-dark-rose dark:hover:scale-105 dark:hover:shadow-2xl dark:hover:from-dark-cocoa dark:hover:to-dark-tan`}
                  >
                    <span className="text-4xl mb-2 text-white drop-shadow shadow-white">＋</span>
                    <span className="font-semibold text-white drop-shadow shadow-white">Create New</span>
                    {/* Chatroom title input */}
                    <input
                      type="text"
                      placeholder="Chatroom title"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
                      className="mt-3 px-2 py-1 rounded border border-mint dark:border-dark-tan w-40 text-center bg-white/80 dark:bg-dark-cocoa/80 text-gray-900 dark:text-dark-tan"
                      aria-label="Chatroom title"
                    />
                    {titleError && <p className="text-xs text-red-600 mt-1">{titleError}</p>}
                    {/* Create button */}
                    <button
                      className="mt-2 bg-mint text-gray-900 px-4 py-1 rounded shadow hover:bg-aqua dark:bg-dark-tan dark:text-dark-ebony dark:hover:bg-dark-cocoa transition focus:ring-2 focus:ring-mint focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-dark-tan dark:focus:ring-offset-dark-cocoa"
                      onClick={handleAdd}
                      aria-label="Create chatroom"
                    >
                      Create
                    </button>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {/* Create New Tile (always first) */}
                  <div className="w-full h-40 relative flex flex-col items-center justify-center rounded-xl shadow-lg cursor-pointer transition group bg-gradient-to-br from-mint via-aqua to-lemon hover:scale-105 hover:shadow-2xl hover:from-mint/80 hover:via-aqua/90 hover:to-lemon/90 dark:bg-none dark:bg-gradient-to-br dark:from-dark-tan dark:via-dark-cocoa dark:to-dark-rose dark:hover:scale-105 dark:hover:shadow-2xl dark:hover:from-dark-cocoa dark:hover:to-dark-tan">
                    {/* Dark mode gradient overlay */}
                    <div className="hidden dark:block absolute inset-0 rounded-xl bg-gradient-to-br from-dark-tan via-dark-cocoa to-dark-rose z-0" />
                    <span className="text-4xl mb-2 text-white drop-shadow shadow-white z-10">＋</span>
                    <span className="font-semibold text-white drop-shadow shadow-white z-10">Create New</span>
                    {/* Chatroom title input */}
                    <input
                      type="text"
                      placeholder="Chatroom title"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
                      className="mt-3 px-2 py-1 rounded border border-mint dark:border-dark-tan w-40 text-center bg-white/80 dark:bg-dark-cocoa/80 text-gray-900 dark:text-dark-tan z-10 relative"
                      aria-label="Chatroom title"
                    />
                    {titleError && <p className="text-xs text-red-600 mt-1">{titleError}</p>}
                    {/* Create button */}
                    <button
                      className="mt-2 bg-mint text-gray-900 px-4 py-1 rounded shadow hover:bg-aqua dark:bg-dark-tan dark:text-dark-ebony dark:hover:bg-dark-cocoa transition z-10 relative focus:ring-2 focus:ring-mint focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-dark-tan dark:focus:ring-offset-dark-cocoa"
                      onClick={handleAdd}
                      aria-label="Create chatroom"
                    >
                      Create
                    </button>
                  </div>
                  {/* Chatroom Tiles */}
                  <AnimatePresence>
                    {filtered.map((room) => (
                      <motion.div
                        key={room.id}
                        layout
                        variants={tileVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`relative flex flex-col items-center justify-center bg-white/90 dark:bg-dark-cocoa rounded-xl shadow-lg h-40 p-4 group transition-all border border-mint dark:border-dark-tan hover:scale-105 hover:shadow-2xl hover:bg-mint/10 dark:hover:bg-dark-tan/20` + (justCreated === room.title ? ' ring-2 ring-mint dark:ring-dark-tan' : '')}
                      >
                        {/* Delete button */}
                        <button
                          className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700"
                          onClick={() => setConfirmDelete(room.id)}
                          aria-label={`Delete chatroom ${room.title}`}
                        >
                          ✕
                        </button>
                        {/* Chatroom name */}
                        <span className="text-lg font-semibold mb-2 truncate w-full text-center text-black">{room.title}</span>
                        {/* Open button */}
                        <button
                          className="mt-auto bg-mint text-gray-900 px-3 py-1 rounded shadow hover:bg-aqua dark:bg-dark-tan dark:text-dark-ebony dark:hover:bg-dark-cocoa transition"
                          onClick={() => setCurrentChatroomId(room.id)}
                          aria-label={`Open chatroom ${room.title}`}
                        >
                          Open
                        </button>
                        {/* Delete confirmation modal */}
                        {confirmDelete === room.id && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" role="dialog" aria-modal="true" tabIndex={-1} onKeyDown={e => { if (e.key === 'Escape') setConfirmDelete(null); }}>
                            <div className="bg-white dark:bg-dark-cocoa p-6 rounded-lg shadow-xl">
                              <p className="mb-4">Are you sure you want to delete this chatroom?</p>
                              <div className="flex justify-end gap-2">
                                <button
                                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                                  onClick={() => handleDelete(room.id)}
                                  aria-label="Confirm delete chatroom"
                                >
                                  Confirm
                                </button>
                                <button
                                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                                  onClick={() => setConfirmDelete(null)}
                                  aria-label="Cancel delete chatroom"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        {/* Divider */}
        <div className="my-8 border-t border-white dark:border-dark-tan" />
        {/* Logout button */}
        <button
          className="w-full bg-mint text-gray-900 px-4 py-2 rounded-md text-sm shadow hover:bg-aqua dark:bg-dark-tan dark:text-dark-ebony dark:hover:bg-dark-cocoa transition"
          onClick={() => setLogoutModal(true)}
        >
          Logout
        </button>
        {/* Logout confirmation modal */}
        {logoutModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-dark-cocoa p-6 rounded-lg shadow-xl">
              <p className="mb-4">Are you sure you want to logout?</p>
              <div className="flex justify-end gap-2">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={handleLogout}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                  onClick={() => setLogoutModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 