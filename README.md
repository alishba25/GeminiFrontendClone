# Country Explorer

A modern, visually rich React app to explore countries, built with React, Tailwind CSS, Framer Motion, and more. Features beautiful glassmorphism, animated UI, theme toggle, search, fun facts, and a responsive image carousel.

## Features
- Animated glassmorphism hero and cards
- Always-visible theme toggle (light/dark)
- Modern search bar with suggestions
- Animated country cards and details
- Fun Fact box with interactive lens effect
- Responsive, animated image carousel
- Custom animated back button
- Fully commented, maintainable codebase
- Unit tests with Jest and React Testing Library

## Tech Stack
- React 18+
- Tailwind CSS
- Framer Motion
- React Router
- React Query
- Jest & React Testing Library

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

### 4. Run tests
```sh
npm test
```

## Testing & Troubleshooting

- **Unit tests** are written with Jest and React Testing Library (see `src/__tests__`).
- If you see errors about JSX or Babel, ensure you have these dev dependencies:
  ```sh
  npm install --save-dev @babel/preset-env @babel/preset-react babel-jest jest-environment-jsdom
  ```
- Make sure you have a `babel.config.js`:
  ```js
  module.exports = {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
    ],
  };
  ```
- And a `jest.config.js`:
  ```js
  module.exports = {
    transform: {
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  };
  ```
- If you see `jest-environment-jsdom cannot be found`, run:
  ```sh
  npm install --save-dev jest-environment-jsdom
  ```

## Folder Structure
- `src/components/` – UI components
- `src/pages/` – Page components
- `src/services/` – API logic
- `src/__tests__/` – Unit tests
- `src/index.css` – Tailwind and global styles

## License
MIT 