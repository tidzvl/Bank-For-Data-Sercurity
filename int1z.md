# Overview

This is a React single-page application built with Vite featuring a complete authentication flow with login page and dashboard. The project demonstrates a modern split-screen login interface and a fully functional dashboard with professional UI components. It is designed as a template/demo application with generic branding (SecureApp) and is clearly marked as non-production template to prevent misuse. 

# User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Minimal, mature, professional aesthetic with black/white color scheme. Avoid colorful emoji icons.

# System Architecture

## Frontend Architecture

**Framework Choice: React 18.2.0**
- Modern functional component-based UI library
- Provides component reusability and efficient rendering through virtual DOM
- Chosen for its maturity, ecosystem, and developer experience

**Build Tool: Vite 5.0.0**
- Fast development server with Hot Module Reloading (HMR)
- Optimized production builds with code splitting
- Native ES modules support for faster reload times
- Alternative to traditional webpack-based tooling (Create React App)
- Pros: Significantly faster dev server startup and HMR, simpler configuration
- Cons: Smaller ecosystem compared to webpack

**Language: JavaScript with TypeScript Support**
- Primary development in JSX (JavaScript)
- TypeScript types included for React and React-DOM
- TypeScript configuration present (tsconfig.json) for optional typed development
- Allows gradual migration from .jsx to .tsx files as needed

**Development Server Configuration**
- Host: 0.0.0.0
- Port: 5000 (fixed with strictPort: true)
- HMR configured with matching clientPort for proper hot reloading.

**Styling Approach**
- CSS Modules (separate .css files per component)
- Component-scoped styling (LoginPage.css, Dashboard.css, Transfer.css, Accounts.css)
- No CSS framework - custom styling approach
- Minimalist design system: dark theme (#1a1a1a) with white/light gray content areas
- Professional monochrome palette with subtle borders, shadows, and hover states
- Accent color: teal (#14b8a6) for positive metrics and active states