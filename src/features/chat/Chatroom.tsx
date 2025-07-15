// Chatroom.tsx
// Main chatroom UI: handles chat messages, avatars, infinite scroll, image upload, copy-to-clipboard, typing indicator, and responsive layout

import React, { useEffect, useRef, useState } from "react";
import { useChatState } from "../../store/chatState";
import { useChatroomStore } from "../../store/chatroomStore";
import { useMessageStore } from "../../store/messageStore";
import type { Message } from "../../store/messageStore";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_SIZE = 20; // Number of messages per page for infinite scroll

// Framer Motion animation variants for message bubbles
const messageVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 30 } },
  exit: { opacity: 0, y: 30, transition: { duration: 0.2 } }
};

// User avatar (gradient background, initial)
const userAvatar = (
  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
    U
  </div>
);
// AI avatar (gradient background, SVG icon)
const aiAvatar = (
  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-700 flex items-center justify-center text-white font-bold shadow-md">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  </div>
);

// Main Chatroom component
const Chatroom: React.FC = () => {
  // --- State and store hooks ---
  const { currentChatroomId, setCurrentChatroomId } = useChatState(); // Current chatroom selection
  const { chatrooms } = useChatroomStore(); // List of chatrooms
  const {
    messages,
    sendMessage,
    addAIMessage,
    loadFromStorage,
    fetchOlderMessages,
  } = useMessageStore(); // Message store and actions

  const chatroom = chatrooms.find((r) => r.id === currentChatroomId); // Current chatroom object

  // Local UI state
  const [input, setInput] = useState(""); // Message input value
  const [isTyping, setIsTyping] = useState(false); // AI typing indicator
  const [page, setPage] = useState(0); // Pagination for infinite scroll
  const [loadingOlder, setLoadingOlder] = useState(false); // Loading state for older messages
  const [image, setImage] = useState<string | null>(null); // Uploaded image (base64)
  const [copiedId, setCopiedId] = useState<string | null>(null); // ID of copied message
  const [inputError, setInputError] = useState<string | null>(null); // Error/helper for input
  const [sending, setSending] = useState(false); // Loading state for sending message
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for auto-scroll

  // --- Effects ---
  // Load messages from localStorage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Scroll to bottom when messages, chatroom, or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentChatroomId, isTyping]);

  // --- Early return if chatroom not found ---
  if (!chatroom) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 mx-auto mt-12">
        <p className="text-center text-gray-500">Chatroom not found.</p>
        <div className="flex justify-center mt-4">
          <button onClick={() => setCurrentChatroomId(null)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- Message pagination logic ---
  const allMessages = messages[chatroom.id] || [];
  const paginated = allMessages.slice(-PAGE_SIZE * (page + 1));

  // --- Handlers ---
  // Send message (user input and optional image)
  const handleSend = () => {
    if (!input.trim() && !image) {
      setInputError("Type a message or upload an image");
      return;
    }
    setInputError(null);
    setSending(true);
    sendMessage(chatroom.id, input.trim(), image || undefined);
    setInput("");
    setImage(null);
    setIsTyping(true);
    setTimeout(() => {
      addAIMessage(chatroom.id, "This is a simulated Gemini AI reply.");
      setIsTyping(false);
      setSending(false);
    }, 1200 + Math.random() * 1000); // Simulate AI response delay
  };

  // Fetch older messages (pagination)
  const handleFetchOlder = () => {
    setLoadingOlder(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingOlder(false);
    }, 500);
  };

  // Handle image upload (convert to base64)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove uploaded image
  const removeImage = () => setImage(null);

  // Copy message text to clipboard
  const handleCopy = async (msg: Message) => {
    if (!msg.text) return;
    try {
      await navigator.clipboard.writeText(msg.text);
      setCopiedId(msg.id);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Skeleton loader for loading messages
  const MessageSkeleton = () => (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  // --- UI ---
  return (
    <div className="relative flex justify-center items-center h-[94vh] max-h-[900px] w-full bg-gradient-to-br from-lemon via-mint to-white dark:from-dark-ebony dark:via-dark-mulberry dark:to-dark-rose">
      {/* Left Side: User Profile Card over Gradient */}
      <div className="hidden lg:flex flex-col items-center justify-center absolute left-0 top-0 h-full w-64 z-10 select-none">
        {/* Gradient background */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-mint via-aqua to-lemon rounded-3xl blur-2xl opacity-30 animate-gradient-move -z-10 dark:bg-gradient-to-br dark:from-dark-mulberry dark:via-dark-tan dark:to-dark-cocoa" />
        {/* User Profile Card */}
        <div className="mt-24 bg-white/95 dark:bg-dark-cocoa rounded-2xl shadow-xl p-6 flex flex-col items-center w-56 border border-mint dark:border-dark-tan">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mint to-aqua flex items-center justify-center text-white text-3xl font-bold mb-2 shadow dark:bg-gradient-to-br dark:from-dark-tan dark:to-dark-cocoa">
            U
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-dark-tan">User Name</div>
          <div className="text-xs text-gray-500 dark:text-dark-tan mb-2">user@email.com</div>
          <button className="mt-2 px-4 py-1 bg-mint text-gray-900 rounded-full shadow hover:bg-aqua transition text-sm dark:bg-dark-tan dark:text-dark-ebony dark:hover:bg-dark-cocoa">Settings</button>
        </div>
      </div>
      {/* Right Side: Tips Card over Gradient */}
      <div className="hidden lg:flex flex-col items-center justify-center absolute right-0 top-0 h-full w-64 z-10 select-none">
        {/* Gradient background */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-lemon via-mint to-aqua rounded-3xl blur-2xl opacity-30 animate-gradient-move2 -z-10 dark:bg-gradient-to-br dark:from-dark-tan dark:via-dark-cocoa dark:to-dark-rose" />
        {/* Tips Card */}
        <div className="mt-24 bg-white/95 dark:bg-dark-cocoa rounded-2xl shadow-xl p-6 w-56 border border-mint dark:border-dark-tan">
          <div className="text-lg font-semibold text-mint dark:text-dark-tan mb-2">💡 Tips</div>
          <ul className="text-sm text-gray-700 dark:text-dark-tan space-y-2 list-disc list-inside">
            <li>Press <span className="font-bold">Enter</span> to send a message</li>
            <li>Click the paperclip to upload an image</li>
            <li>Click a message to copy it</li>
          </ul>
        </div>
      </div>
      {/* Main Chat Container */}
      <div className="flex flex-col h-[94vh] max-h-[900px] w-full max-w-4xl mx-auto bg-gradient-to-br from-lemon via-mint to-white dark:from-dark-ebony dark:via-dark-mulberry dark:to-dark-rose border border-mint dark:border-dark-tan rounded-3xl shadow-2xl overflow-hidden relative z-20">
        <h1 className="text-3xl font-extrabold text-mint dark:text-dark-tan mb-2 px-6 pt-6 text-center">Chatroom</h1>
        <div className="mb-4 border-b border-mint dark:border-dark-tan mx-6" />
        {/* Header: AI avatar, title, back button */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 dark:border-dark-tan bg-white/80 dark:bg-dark-cocoa/80 backdrop-blur-md shadow-sm z-10">
          {aiAvatar}
          <div className="flex flex-col flex-1">
            <span className="font-bold text-lg text-gray-900 dark:text-dark-tan">Gemini AI</span>
            <span className="text-xs text-gray-500 dark:text-dark-tan">Your smart assistant</span>
          </div>
          <button onClick={() => setCurrentChatroomId(null)} className="ml-auto bg-mint text-gray-900 px-4 py-2 rounded-full shadow hover:bg-aqua transition-all font-semibold dark:bg-dark-tan dark:text-dark-ebony dark:hover:bg-dark-cocoa" aria-label="Back to dashboard">
            ← Back
          </button>
        </div>
        {/* Chat Area: message list, infinite scroll, typing indicator */}
        <div className="flex-1 overflow-y-auto px-10 py-8 flex flex-col-reverse gap-4" style={{ minHeight: 0 }}>
          <div ref={messagesEndRef} />
          {paginated.length < allMessages.length && (
            <button onClick={handleFetchOlder} disabled={loadingOlder} className="bg-lemon/80 dark:bg-dark-tan text-gray-800 dark:text-dark-ebony px-4 py-2 rounded-md hover:bg-mint/80 dark:hover:bg-dark-cocoa mx-auto mb-2">
              Load older messages
            </button>
          )}
          {loadingOlder && (
            <>
              <MessageSkeleton />
              <MessageSkeleton />
              <MessageSkeleton />
            </>
          )}
          {paginated.length === 0 && !loadingOlder && (
            <p className="text-center text-gray-500 dark:text-dark-tan">No messages yet.</p>
          )}
          <AnimatePresence initial={false}>
            {paginated
              .slice()
              .reverse()
              .map((msg: Message) => (
                <motion.div
                  key={msg.id}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={`flex w-full mb-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-end gap-2 max-w-full ${msg.sender === "user" ? "flex-row-reverse" : ""}`}> 
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {msg.sender === "user" ? userAvatar : aiAvatar}
                    </div>
                    {/* Bubble: message text/image, copy, timestamp, delivered icon */}
                    <div
                      className={`relative px-5 py-3 rounded-2xl shadow-lg transition-all group
                        ${msg.sender === "user"
                          ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-br-md ml-auto dark:from-dark-tan dark:to-dark-cocoa"
                          : "bg-gradient-to-br from-gray-100 via-mint to-lemon dark:from-dark-cocoa dark:via-dark-mulberry dark:to-dark-rose text-gray-900 dark:text-dark-tan rounded-bl-md mr-auto"}
                        ${copiedId === msg.id ? "ring-2 ring-blue-400 dark:ring-dark-tan" : ""}
                      `}
                      onMouseLeave={() => setCopiedId(null)}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="uploaded"
                          className="mb-2 max-w-[180px] max-h-[180px] rounded-lg object-cover border border-gray-200 dark:border-dark-tan"
                        />
                      )}
                      {msg.text && (
                        <span
                          className={`block cursor-pointer break-words transition-colors duration-150 ${copiedId === msg.id ? "underline" : "group-hover:bg-white/10"}`}
                          onClick={() => handleCopy(msg)}
                          title="Copy to clipboard"
                          tabIndex={0}
                          role="button"
                          aria-label="Copy message"
                        >
                          {msg.text}
                        </span>
                      )}
                      <span className="block text-xs text-gray-200/80 dark:text-dark-tan text-right mt-1">
                        {msg.sender === "user" && (
                          <span className="inline-block align-middle mr-1" title="Delivered">
                            <svg className="w-4 h-4 inline text-green-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </span>
                        )}
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            {/* Typing indicator (animated) */}
            {isTyping && (
              <motion.div
                key="typing-indicator"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex w-full justify-start mb-2"
              >
                <div className="flex items-end gap-2 max-w-full">
                  <div className="flex-shrink-0">{aiAvatar}</div>
                  <div className="bg-gray-200 dark:bg-dark-cocoa px-5 py-3 rounded-2xl shadow-lg max-w-[60%]">
                    <div className="flex items-center gap-2">
                      <span className="block text-sm text-gray-500 dark:text-dark-tan italic">Gemini is typing</span>
                      <span className="inline-block w-2 h-2 bg-gray-400 dark:bg-dark-tan rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                      <span className="inline-block w-2 h-2 bg-gray-400 dark:bg-dark-tan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="inline-block w-2 h-2 bg-gray-400 dark:bg-dark-tan rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Input Bar: message input, image upload, send button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="px-10 py-6 border-t border-mint dark:border-dark-tan bg-white/80 dark:bg-dark-cocoa/80 flex items-end gap-4 sticky bottom-0 shadow-lg z-10"
          style={{ zIndex: 10 }}
        >
          <div className="relative group flex-shrink-0">
            <label className="cursor-pointer">
              <span className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-mint dark:from-dark-tan dark:to-dark-cocoa hover:bg-blue-100 dark:hover:bg-dark-mulberry shadow transition focus:outline-none" tabIndex={0} aria-label="Upload image">
                {/* Paperclip icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600 dark:text-dark-tan">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75V7.5a4.5 4.5 0 10-9 0v7.5a6 6 0 0012 0V9.75" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isTyping}
                  aria-label="Upload image"
                />
              </span>
              {/* Tooltip */}
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                Upload image
              </span>
            </label>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {image && (
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={image}
                  alt="preview"
                  className="max-w-[80px] max-h-[80px] rounded-lg object-cover border border-gray-200 dark:border-dark-tan"
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 text-xs"
                  onClick={removeImage}
                  tabIndex={-1}
                >
                  ×
                </button>
              </div>
            )}
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              className="w-full p-3 border border-mint dark:border-dark-tan rounded-full focus:outline-none focus:ring-2 focus:ring-mint dark:focus:ring-dark-tan dark:bg-dark-cocoa dark:text-dark-tan text-base shadow-sm"
              aria-label="Type your message"
            />
            {inputError && <p className="text-xs text-red-600 mt-1">{inputError}</p>}
            {!inputError && <p className="text-xs text-gray-500 mt-1">Press Enter to send or click the send button</p>}
          </div>
          <motion.button
            type="submit"
            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 disabled:opacity-60 dark:from-dark-tan dark:to-dark-cocoa dark:text-dark-ebony dark:hover:from-dark-cocoa dark:hover:to-dark-tan"
            disabled={isTyping || sending || (!input.trim() && !image)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.07 }}
            aria-label="Send message"
            tabIndex={0}
          >
            {sending ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6.75 6.75 8.25-13.5" />
                </svg>
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </motion.button>
        </form>
        {/* Subtle background pattern/gradient */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-transparent via-white/30 to-transparent dark:via-dark-mulberry/20" />
      </div>
    </div>
  );
};

export default Chatroom; // Export the component for use in other files 