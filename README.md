# Gemini Chatbot Clone

A modern, visually rich Gemini chatbot clone built with React, Tailwind CSS, Framer Motion, and Zustand. Features a professional chat UI, animated chatrooms dashboard, OTP-based authentication, dark/light mode, infinite scroll, image upload, and more.

**Live Demo:** [Add your live link here]

---

## Features
- OTP-based login/signup with country code selection and robust validation
- Animated dashboard with chatroom tiles, creation, deletion, and search
- Modern chat UI: message bubbles, avatars, timestamps, typing indicator, animated entry, and fixed input bar
- Infinite scroll and pagination for chat history
- Image upload and copy-to-clipboard in chat
- Fully responsive, accessible, and keyboard-navigable
- Custom light/dark themes with a toggle
- LocalStorage persistence for auth, chatrooms, and messages
- Toast notifications and loading skeletons
- Highly readable, well-commented, and modular codebase

---

## Getting Started

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Install dependencies
```sh
npm install
```

### 3. Start the development server
```sh
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## Folder Structure

```
src/
  main.tsx            # App entry point, theme logic
  App.tsx             # App shell, routing, layout
  index.css           # Tailwind and global styles
  components/
    ThemeToggle.tsx   # Theme toggle button
  features/
    auth/
      AuthForm.tsx    # OTP login/signup form
    dashboard/
      Dashboard.tsx   # Chatrooms dashboard (tiles, search, create/delete)
    chat/
      Chatroom.tsx    # Main chat UI (bubbles, infinite scroll, input)
  store/
    chatroomStore.ts  # Zustand store for chatrooms
    chatState.ts      # Zustand store for current chatroom selection
    messageStore.ts   # Zustand store for messages
```

---

## Implementation Details

### Throttling
- AI replies in chat are simulated with a timeout and random delay to mimic real typing speed, preventing instant responses and improving realism.

### Pagination & Infinite Scroll
- Chat messages are paginated in the store. The chat UI loads the most recent messages and provides a "Load older messages" button for infinite scroll. Older messages are fetched page by page from localStorage.

### Form Validation
- All forms use [zod](https://zod.dev/) schemas and [react-hook-form](https://react-hook-form.com/) for robust, declarative validation. Errors are shown inline and all fields are validated before submission.

### Accessibility & UX
- All interactive elements are keyboard-accessible and have ARIA labels.
- The UI is fully responsive and adapts to all screen sizes.
- Toast notifications provide feedback for actions and errors.
- Loading skeletons and spinners indicate background activity.

### Theming & Persistence
- Theme (light/dark) is toggled globally and applied via Tailwind's `dark` class on the `<html>` element.
- Auth state, chatrooms, and messages are persisted in localStorage for seamless reloads.

---

## Screenshots

> **Tip:** To add screenshots:
> 1. Use the Windows Snipping Tool (`Win + Shift + S`) or [ShareX](https://getsharex.com/) to capture your app.
> 2. Save images in a `screenshots/` folder in your repo.
> 3. Reference them in this section:
>
> ```md
> ![Dashboard](screenshots/dashboard.png)
> ![Chatroom](screenshots/chatroom.png)
> ```

---

## Additional Notes
- All code is thoroughly commented for clarity and maintainability.
- The project is designed for easy extension (add new features, stores, or UI components).
- If you encounter issues, ensure your dependencies are up to date and your browser supports modern JavaScript features.

---

## License
MIT 