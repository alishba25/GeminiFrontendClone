// chatroomStore.ts
// Zustand store for managing chatrooms, search, add/delete, and localStorage sync

import { create } from "zustand";

// Chatroom type definition
export type Chatroom = {
  id: string; // Unique chatroom ID
  title: string; // Chatroom title
};

// State and actions for the chatroom store
interface ChatroomState {
  chatrooms: Chatroom[]; // List of all chatrooms
  search: string; // Current search query
  setSearch: (search: string) => void; // Set search query
  addChatroom: (title: string) => void; // Add a new chatroom
  deleteChatroom: (id: string) => void; // Delete a chatroom by ID
  loadFromStorage: () => void; // Load chatrooms from localStorage
}

const STORAGE_KEY = "chatrooms"; // Key for localStorage

// Create Zustand store for chatrooms
export const useChatroomStore = create<ChatroomState>((set, get) => ({
  chatrooms: [],
  search: "",
  // Set the search query
  setSearch: (search) => set({ search }),
  // Add a new chatroom and persist to localStorage
  addChatroom: (title) => {
    const newRoom = { id: Date.now().toString(), title };
    const updated = [...get().chatrooms, newRoom];
    set({ chatrooms: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
  // Delete a chatroom by ID and persist to localStorage
  deleteChatroom: (id) => {
    const updated = get().chatrooms.filter((room) => room.id !== id);
    set({ chatrooms: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
  // Load chatrooms from localStorage (if present)
  loadFromStorage: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) set({ chatrooms: JSON.parse(stored) });
  },
})); 