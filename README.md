# Learnie - AI-Powered Learning Assistant

Learnie is an AI-powered learning assistant that helps you learn new topics in just 5 minutes. Built with React, TypeScript, Vite, and Chakra UI, it uses OpenAI's GPT models to generate concise learning content based on your interests.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/learnie.git
   cd learnie
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Configure your OpenAI API key:
   - Open `src/config.ts`
   - Replace `'your-openai-api-key-here'` with your actual OpenAI API key

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Usage

1. Enter a topic you want to learn about in the input field
2. Click the "Learn!" button or press Enter
3. Wait for the AI to generate a 5-minute learning plan
4. Read and enjoy your personalized learning content!

## AI Provider Framework

Learnie uses a generic AI provider framework that allows easy switching between different AI providers:

- Currently supports OpenAI
- Future support planned for Google's Gemini and other AI models
- To switch providers, update the `provider` value in `src/config.ts`

## Design System

This project uses [Chakra UI](https://chakra-ui.com/) as its design system. Chakra UI is a simple, modular, and accessible component library that gives you the building blocks to build React applications with speed.

### Features

- **Minimalistic & Modern**: Clean, simple design with modern aesthetics
- **Customizable**: Easily extend the theme in `src/theme.ts`
- **Responsive**: Built-in responsive styles
- **Accessible**: WAI-ARIA compliant components
- **Dark Mode Support**: Uses Chakra's color mode for light/dark themes

### Theme Customization

The design system includes:
- Custom color palettes (brand and accent colors)
- Typography settings
- Component style overrides
- Global styles

## Vite Plugins

Currently, two official Vite plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
