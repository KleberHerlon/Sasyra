# Technology Stack

**Analysis Date:** 2026-06-23

## Languages

**Primary:**
- JavaScript (ES6+) - All application code and configuration files.

**Secondary:**
- CSS - Styling for individual pages/screens (e.g., `Login.css`).
- HTML - Single Page Application entry point (`index.html`).

## Runtime

**Environment:**
- Browser runtime (React Single Page Application).
- Node.js (Vite build and development server).

**Package Manager:**
- npm - Lockfile: `package-lock.json` present.

## Frameworks

**Core:**
- React 19.2.6 - UI rendering and component architecture.
- React DOM 19.2.6 - DOM-specific methods.
- React Router DOM 7.17.0 - Client-side routing.

**Testing:**
- None - No testing framework or runner configured in the codebase.

**Build/Dev:**
- Vite 8.0.12 - Development server and application bundler.
- ESLint 10.3.0 - Code linting and style checking.
- `@vitejs/plugin-react` 6.0.1 - React support for Vite.

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.108.1 - Client SDK for authentication and database integration.

## Configuration

**Environment:**
- Configured using Vite's built-in env variables support (e.g., `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`).

**Build:**
- `vite.config.js` - Configuration for Vite and plugins.
- `eslint.config.js` - ESLint configuration rules.

## Platform Requirements

**Development:**
- Cross-platform (Windows, macOS, Linux) with Node.js and npm installed.

**Production:**
- Built as static assets (`npm run build`) deployable to static hosting platforms (Vercel, Netlify, Supabase Hosting, etc.).

---

*Stack analysis: 2026-06-23*
*Update after major dependency changes*
