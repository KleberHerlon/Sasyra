# Codebase Concerns

**Analysis Date:** 2026-06-23

## Tech Debt

**Giant monolithic Dashboard screen:**
- Issue: `src/screens/Dashboard.jsx` is a monolithic file (over 122KB, 1690 lines) containing multiple components (LogoSVG, NumericDrum, EvaSlider, TagSelect, SingleSelect, SessionCounter, AudioField, MRCSelect, GonioRow, TestCard, etc.), design tokens, and domain logic.
- Why: Rapid feature assembly.
- Impact: Hard to maintain, high complexity, and difficulty in testing sub-components.
- Fix approach: Split `Dashboard.jsx` into separate components within the `src/components/` directory, moving design tokens to a common files location.

**Mocked Authentication Flow:**
- Issue: `src/screens/Login.jsx` uses a `setTimeout` simulator for login success instead of authenticating with Supabase.
- Why: Early design stage.
- Impact: Security is not enforced; any input bypasses credentials verification.
- Fix approach: Integrate the exported client from `src/lib/supabase.js` to sign in users.

**Empty component and context folders:**
- Issue: `src/components/` and `src/contexts/` directories are empty.
- Why: Initial scaffold setup without modularization.
- Impact: Architecture does not leverage React's reuse and context propagation models.
- Fix approach: Move shared UI structures and global state (e.g. patient selection, session logs) to these directories.

## Known Bugs

**Unused code causing ESLint errors:**
- Symptoms: `npm run lint` fails with errors:
  - `Logo` is assigned a value but never used in `Dashboard.jsx` (or old `App.jsx` code path).
  - `i` is defined but never used in `Dashboard.jsx`.
  - `localDor` is defined but never used in `src/data/cifEngine.js`.
- Trigger: Running lint script.
- Workaround: None, build fails under strict CI lint environments.
- Fix: Clean up the unused declarations or pass them appropriately to matching calls.

## Security Considerations

**Fallback Supabase Credentials:**
- Risk: Client configuration file `src/lib/supabase.js` hardcodes fallback strings for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Current mitigation: None.
- Recommendations: Require environment definitions at load time and display errors if missing.

## Performance Bottlenecks

**Large Component Payload:**
- Problem: Large single module bundle size due to monolithic files.
- Measurement: Monolith files (>120KB) loaded on initial view rendering.
- Cause: Component code size.
- Improvement path: Code-splitting and lazy-loading screens with React Router.

## Fragile Areas

**SpeechRecognition support check:**
- File: `src/screens/Dashboard.jsx`
- Why fragile: Speech recognition relies on native browser support checking `window.SpeechRecognition || window.webkitSpeechRecognition`. Can break in environments where these globals are undefined or restricted.
- Common failures: Errors on non-supported browsers if checks are missing.

## Scaling Limits

**Local Memory State Storage:**
- Current capacity: Simulated memory queues in the frontend.
- Limit: Lost on page refresh.
- Scaling path: Persistence in Supabase database.

## Dependencies at Risk

- None identified.

## Missing Critical Features

**Persisted Sessions and Patients:**
- Problem: Patients list, evaluations, and logs are kept in local component state. Refreshing browser clears all data.
- Current workaround: Manually re-entering data.
- Implementation complexity: High (requires database tables schema definition and Supabase connection integration).

## Test Coverage Gaps

**Zero test coverage:**
- What's not tested: Entire code.
- Risk: Changes in logic or UI rendering can cause regressions without detection.
- Priority: High.
- Difficulty to test: Requires setting up Vitest or Jest.

---

*Concerns audit: 2026-06-23*
*Update as issues are fixed or new ones discovered*
