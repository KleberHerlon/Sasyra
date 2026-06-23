# Architecture

**Analysis Date:** 2026-06-23

## Pattern Overview

**Overall:** React Single Page Application (SPA) with Client-Side Routing.

**Key Characteristics:**
- Monolithic page screens: Core UI components, tokens, and calculators are bundled into single screen files.
- Client-side navigation via React Router.
- Built and bundled statically using Vite.
- Offline-ready features like browser SpeechRecognition.

## Layers

**Routing Layer:**
- Purpose: Directs traffic to different screens.
- Contains: Route definitions and redirects.
- Location: `src/App.jsx`
- Depends on: Screen Layer
- Used by: entry point (`src/main.jsx`)

**Screen Layer:**
- Purpose: Render views and orchestrate local state.
- Contains: Layouts, UI state, inputs, and form handlers.
- Location: `src/screens/`
- Depends on: Component Layer (currently empty), Data Layer, Lib Layer.
- Used by: Routing Layer (`src/App.jsx`)

**Data Layer:**
- Purpose: Domain datasets and helper functions.
- Contains: Static maps, classification data, and engine functions.
- Location: `src/data/`
- Depends on: None.
- Used by: Screen Layer

**Lib Layer:**
- Purpose: External client initializations.
- Contains: Supabase client instantiations.
- Location: `src/lib/`
- Depends on: Environment configuration.
- Used by: Screen Layer

## Data Flow

**Authentication Flow:**
1. User navigates to `/login`.
2. User submits email/password in `src/screens/Login.jsx`.
3. Login handler simulates latency (`setTimeout`) and redirects to `/dashboard`.

**Goniometry / ADM Alerta Flow:**
1. User interacts with Goniometry inputs in `src/screens/Dashboard.jsx`.
2. Input invokes `onUpdate` which updates state, calculating reference ranges via `getRef` in `src/screens/Dashboard.jsx`.
3. Out of range values trigger warnings and red alerts in the UI.

**State Management:**
- React state (`useState`, `useRef`, `useEffect`) managed locally in page/screen components.
- No global state manager (e.g. Redux, Zustand, or React Context) is active in the current implementation.

## Key Abstractions

**Classification Engine:**
- Purpose: Maps physical patient attributes (EVA, ADM, local pain) to CIF/ICF codes.
- Examples: `src/data/cifEngine.js`.
- Pattern: Pure functions returning classification arrays.

**Static Dictionaries:**
- Purpose: Holds domain evidence and clinical reference models.
- Examples: `src/data/cif.js`, `src/data/evidence.js`.

## Entry Points

**Web Entry:**
- Location: `src/main.jsx`
- Triggers: Browser loading the application.
- Responsibilities: Mounts React application into the DOM container `root`.

## Error Handling

**Strategy:** Exception raising and standard JavaScript catch blocks inside asynchronous handlers.

## Cross-Cutting Concerns

**Validation:**
- Reference check validations for joint movements implemented in `src/screens/Dashboard.jsx`.

**Authentication:**
- Placed in `src/App.jsx` but currently lacks route guard implementation.

---

*Architecture analysis: 2026-06-23*
*Update when major patterns change*
