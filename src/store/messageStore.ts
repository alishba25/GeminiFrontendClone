// messageStore.ts
// Zustand store for managing chat messages, sending, AI replies, localStorage sync, and pagination

import { create } from "zustand";

// Message type definition
export type Message = {
  id: string; // Unique message ID
  chatroomId: string; // Associated chatroom
  sender: "user" | "ai"; // Who sent the message
  text?: string; // Message text (optional)
  image?: string; // Image (base64 or preview URL, optional)
  timestamp: number; // Unix timestamp
};

// State and actions for the message store
interface MessageState {
  messages: Record<string, Message[]>; // chatroomId -> array of messages
  sendMessage: (chatroomId: string, text: string, image?: string) => void; // Send user message
  addAIMessage: (chatroomId: string, text: string) => void; // Add AI reply
  loadFromStorage: () => void; // Load messages from localStorage
  fetchOlderMessages: (chatroomId: string, page: number, pageSize: number) => Message[]; // Paginate older messages
}

const STORAGE_KEY = "messages"; // Key for localStorage

// Create Zustand store for messages
export const useMessageStore = create<MessageState>((set, get) => ({
  messages: {},
  // Send a user message and persist to localStorage
  sendMessage: (chatroomId, text, image) => {
    const msg: Message = {
      id: Date.now().toString() + Math.random(),
      chatroomId,
      sender: "user",
      text,
      image,
      timestamp: Date.now(),
    };
    const updated = {
      ...get().messages,
      [chatroomId]: [...(get().messages[chatroomId] || []), msg],
    };
    set({ messages: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
  // Add an AI message and persist to localStorage
  addAIMessage: (chatroomId, text) => {
    const msg: Message = {
      id: Date.now().toString() + Math.random(),
      chatroomId,
      sender: "ai",
      text,
      timestamp: Date.now(),
    };
    const updated = {
      ...get().messages,
      [chatroomId]: [...(get().messages[chatroomId] || []), msg],
    };
    set({ messages: updated });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },
  // Load messages from localStorage (if present)
  loadFromStorage: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) set({ messages: JSON.parse(stored) });
  },
  // Fetch a page of older messages for infinite scroll
  fetchOlderMessages: (chatroomId, page, pageSize) => {
    const all = get().messages[chatroomId] || [];
    const start = Math.max(0, all.length - (page + 1) * pageSize);
    const end = all.length - page * pageSize;
    return all.slice(start, end);
  },
})); 