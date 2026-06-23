# Codebase Structure

**Analysis Date:** 2026-06-23

## Directory Layout

```
sasyra/
├── src/                # Application source code
│   ├── assets/         # Public static assets
│   ├── components/     # Reusable UI components (currently empty)
│   ├── contexts/       # React Contexts (currently empty)
│   ├── data/           # Domain data & matching engines
│   ├── lib/            # External library connections
│   ├── screens/        # Screen-level components and CSS
│   ├── App.css         # Main App CSS
│   ├── App.jsx         # App routes & main component
│   ├── index.css       # Core styling & variables
│   └── main.jsx        # App entry point
├── public/             # Static public assets
├── eslint.config.js    # Lint configuration
├── index.html          # HTML Shell
├── package.json        # Node.json packages manifest
├── README.md           # Documentation
└── vite.config.js      # Bundling tool configuration
```

## Directory Purposes

**src/components/**
- Purpose: Reusable components.
- Contains: Currently empty.

**src/contexts/**
- Purpose: React Context providers.
- Contains: Currently empty.

**src/data/**
- Purpose: Domain data models and matching logic.
- Contains: `cif.js`, `cifEngine.js`, `evidence.js`.

**src/lib/**
- Purpose: Library configuration wrappers.
- Contains: `supabase.js`.

**src/screens/**
- Purpose: High-level UI screens.
- Contains: `Dashboard.jsx`, `Login.jsx`, `Login.css`.

## Key File Locations

**Entry Points:**
- `src/main.jsx` - Application mount point.
- `index.html` - HTML file served by Vite.

**Configuration:**
- `package.json` - Node dependencies and run scripts.
- `vite.config.js` - Bundling and plugin parameters.
- `eslint.config.js` - Linter rule definitions.

**Core Logic:**
- `src/App.jsx` - Client routing mapping.
- `src/screens/Dashboard.jsx` - Main dashboard UI and logic.
- `src/data/cifEngine.js` - Matches clinic data to CIF codes.

## Naming Conventions

**Files:**
- `PascalCase.jsx` for React components/screens (e.g., `Dashboard.jsx`, `Login.jsx`).
- `camelCase.js` for data utilities and engines (e.g., `cifEngine.js`, `supabase.js`).
- `PascalCase.css` matching React component styles.

**Directories:**
- `camelCase` / `kebab-case` for folders (e.g., `src/data/`, `src/screens/`).

## Where to Add New Code

**New Screen:**
- Implementation: `src/screens/NewScreen.jsx`
- Styles: `src/screens/NewScreen.css`
- Route: Define in `src/App.jsx`

**New Reusable Component:**
- Implementation: `src/components/NewComponent.jsx`

**New Context/Global State:**
- Provider: `src/contexts/NewContext.jsx`

---

*Structure analysis: 2026-06-23*
*Update when directory structure changes*
