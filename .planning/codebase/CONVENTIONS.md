# Coding Conventions

**Analysis Date:** 2026-06-23

## Naming Patterns

**Files:**
- `PascalCase.jsx` for React component screens.
- `PascalCase.css` for corresponding screen stylesheets.
- `camelCase.js` for data libraries, utilities, and helper modules.

**Functions:**
- `camelCase` for all standard functions and hooks.
- React component names are `PascalCase`.

**Variables:**
- `camelCase` for variables and references.
- `UPPER_SNAKE_CASE` for global styling tokens or constants (e.g. `C`, `F`, `REF` in `src/screens/Dashboard.jsx`).

## Code Style

**Formatting:**
- Multi-line indentation using 2 spaces.
- Semi-colons used at line completions.
- Inline styles defined in UI components using static token mappings.

**Linting:**
- Configured using ESLint (`eslint.config.js`).
- Commands: `npm run lint` execution to audit code health.

## Import Organization

**Order:**
1. External packages (React, React hooks, Router components).
2. Data engines and dictionaries.
3. Component stylesheets (e.g., `./Login.css`).

## Error Handling

**Patterns:**
- Try/catch blocks around network requests or browser api triggers.
- In-place condition checks returning defaults.

## Logging

**Framework:**
- Native browser `console.log` and `console.error` outputs.

## Comments

**When to Comment:**
- Section boundaries (e.g. `// ── Design tokens ──`).
- Non-obvious domain behavior (e.g., calculations, reference rules).

---

*Convention analysis: 2026-06-23*
*Update when patterns change*
