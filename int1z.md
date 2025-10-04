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

## Component Structure

**Entry Point**
- index.html serves as the application shell
- React app mounts to #root div element
- Module-based script loading (/src/index.jsx)

**Routing**
- React Router DOM v6 implemented
- Routes:
  - `/` - Login page
  - `/dashboard` - Main dashboard (protected route after login)
  - `/transfer` - Data transfer interface for numeric transactions
  - `/accounts` - Financial accounts and cards management
- Navigation handled via useNavigate hook and anchor links

**Dashboard Features**
- State-managed collapsible sidebar (useState for toggle)
- SVG icon library for all interface elements
- Responsive two-column layout (60/40 split, stacks on mobile)
- Column chart with 12-month data visualization
- Notification feed with icon variations
- Team members horizontal scroll list

**Transfer Page Features**
- Two-column layout (45/55 split, left: user selection, right: transfer form)
- Account information display: type, data value, ID, owner name
- Action buttons: Share ID and Request with SVG icons
- Saved users list with avatar initials and names
- Tabbed interface for own/other account selection
- Form inputs: first name, last name, ID (required), data amount (required)
- Data unit dropdown selector (D, K, M, G units)
- Continue button for form submission
- Responsive design with mobile-friendly stacking

**Accounts Page Features**
- Financial dashboard with "Accounts and collect" title
- My accounts section: 3 account cards in grid layout (3 columns)
- Account cards: dark (#1a1a1a) background with white text
- Each card displays: account type with icon, balance, yield percentage (teal #14b8a6), ID, owner
- "See details" white button on each card
- My cards section: 3 credit card designs with different colors
- Card colors: peach gradient, blue gradient, white with border
- Each card: chip icon, toggle switch, masked card number, type, balance
- Toggle switches control card activation state
- Responsive grid: 3 columns desktop, 2 columns tablet, 1 column mobile

# External Dependencies

## Core Dependencies

**React Ecosystem (v18.2.0)**
- react: Core library for building user interfaces
- react-dom: DOM-specific rendering methods
- react-router-dom: Client-side routing and navigation

**Build Tools**
- @vitejs/plugin-react: Official Vite plugin for React support with Fast Refresh
- vite: Build tool and development server
- typescript: Type checking support (optional usage)

**Type Definitions**
- @types/react: TypeScript type definitions for React
- @types/react-dom: TypeScript type definitions for React-DOM

## Platform Integration

**Specific Configuration**
- Server configured to bind to 0.0.0.0
- Fixed port 5000 with strictPort enabled
- HMR client port configuration

## No External Services Currently Integrated

- No authentication providers detected
- No backend API connections present
- No database integrations
- No state management libraries (Redux, Zustand, etc.)
- No HTTP client libraries (axios, fetch wrappers)

**Note:** The architecture suggests this is a frontend-only application template. Future integrations may include backend services, authentication systems, or databases depending on application requirements.
