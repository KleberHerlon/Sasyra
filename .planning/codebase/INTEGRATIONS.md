# External Integrations

**Analysis Date:** 2026-06-23

## APIs & External Services

**Speech Recognition:**
- Browser Web Speech API (SpeechRecognition / webkitSpeechRecognition) - Used for speech-to-text dictation in `src/screens/Dashboard.jsx`.
  - Integration method: Native browser API.

## Data Storage

**Databases:**
- Supabase Database - Intended as primary data store.
  - Client: `@supabase/supabase-js`
  - Connection: Initialized in `src/lib/supabase.js`.

**File Storage:**
- None currently configured.

**Caching:**
- None currently configured.

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Configured via the Supabase client SDK in `src/lib/supabase.js`.
  - Current state: Simulating authentication with a `setTimeout` mock inside `src/screens/Login.jsx` instead of calling actual Supabase APIs.

## Monitoring & Observability

**Error Tracking:**
- None.

**Analytics:**
- None.

**Logs:**
- Browser console logging.

## CI/CD & Deployment

**Hosting:**
- Not currently configured.

**CI Pipeline:**
- Not currently configured.

## Environment Configuration

**Development:**
- Required env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Secrets location: Loaded from client environments or fallback mock strings in `src/lib/supabase.js`.

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- None.

---

*Integration audit: 2026-06-23*
*Update when adding/removing external services*
