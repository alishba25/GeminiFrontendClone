// chatState.ts
// Zustand store for managing the currently selected chatroom (global state)

import { create } from "zustand";

// State and actions for chatroom selection
interface ChatState {
  currentChatroomId: string | null; // ID of the currently selected chatroom (null if none)
  setCurrentChatroomId: (id: string | null) => void; // Setter for currentChatroomId
}

// Create Zustand store for chatroom selection
export const useChatState = create<ChatState>((set) => ({
  currentChatroomId: null,
  setCurrentChatroomId: (id) => set({ currentChatroomId: id }),
})); 