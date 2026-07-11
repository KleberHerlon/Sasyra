# AGENTS.md — SASYRA

React 19 + Vite 8 SPA for clinical physiotherapy/physical-education assessment.
pt-BR product (default locale), i18n ready. PWA installable.

## Branch & deploy workflow (PRODUÇÃO)

- **`main`** = PRODUÇÃO. Deploy automático para GitHub Pages (`https://kleberherlon.github.io/Sasyra/`) via GitHub Actions a cada push.
- **`develop`** = ambiente de testes. **Todas as alterações devem ser feitas aqui.** Nunca commite direto na `main`.
- Fluxo: `develop` → testar local (`npm run dev` + `npm test`) → abrir PR `develop` → `main` → aprovar → merge → deploy automático.
- `main` está protegida: exige 1 aprovação de PR, sem push direto.

## Commands

- `npm run dev` — Vite dev server on :5173. Proxies `/api` → `http://localhost:3001` (see `vite.config.js`).
- `npm run server` — Express AI proxy on :3001 (`server/proxy.js`). Run separately from `dev` for full functionality.
- `npm run dev:all` — starts both, but uses `&` (shell-dependent). On Windows run `npm run server` and `npm run dev` in two terminals for reliability.
- `npm run build` — `vite build` → `dist/`. The express server also serves `dist/` if present (SPA fallback).
- `npm test` — `vitest run`. **This is the verification gate** (618 tests, 19 files, all green).
- `npm run test:watch` — watch mode.
- Single test: `npx vitest run src/data/__tests__/cardioScales.test.js`
- By name: `npx vitest run -t "calcLawton"`
- `npm run lint` — `eslint .`. **Fails with ~336 pre-existing errors** (mostly `no-unused-vars`/`no-undef` across `src/screens/*`). Do NOT assume your change broke lint; check the diff, not the total. Lint is not currently gating.
- No TypeScript, no typecheck step.

## Architecture

- `src/App.jsx` (~2900 lines) is the app shell + router. Imports specialty screens from `src/screens/`.
- **Ortopedic fisio** (the original module) has no dedicated screen — it renders `src/Assessment.jsx` directly. This is the gold-standard assessment; other specialties compare against it.
- Each specialty has its own `src/screens/<Area>.jsx` and reuses the shared anamnesis component `src/components/GeneralAssessment.jsx` (BodyMap + pain characterization + Yellow Flags, persists to `{module}_general_{sid}` in localStorage). Neuro was the last to adopt it.
- Shared UI primitives (`Section`, `Row`, `Field`, `EvaSlider`, `TagSelect`, `SingleSelect`, `MRCRow`, `GonioRow`, `PaywallModal`, `useMediaQuery`, `MUSCLES`, `JOINTS`, `MVMT`, design-token `C` object mapping CSS vars) live in `src/components.jsx`. Prefer these over reinventing.
- Specialty scales are extracted to `src/data/<area>Scales.js` (e.g. `geriatriaScales.js`, `cardioScales.js`, `pediatriaScales.js`, `dentoScales.js`, `neuroScales.js`, `oncologyScales.js`, `dermatoScales.js`, `uroScales.js`, `sportsScales.js`, `rheumatologyScales.js`, `peScales.js`) with a co-located test in `src/data/__tests__/`. Central scale registry is `src/scales.js` (uses a `simpleScale` helper). When adding a scale, follow this split — do not inline scale math in screen components.
- Module registry: `src/data/modules.js` (`FISIO_SUB_MODULES` + `FISIO_MODULE_MAP`). Screen wiring lives in `App.jsx` `FISIO_SCREEN_MAP`.
- Cross-module data handoff ("Ponte de Transição"): `src/data/transitionBridge.js` (`encaminharParaPE`, `receberDeFisio`).
- `src/lib/supabase.js` is the only Supabase client.

## Environment & data modes (critical)

Two independent env-driven modes; both have graceful fallbacks:

1. **Supabase (optional, frontend).** Set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` in root `.env` (gitignored). Without them, `src/lib/supabase.js` exports `null` and `src/data/supabaseService.js` falls back to **localStorage** for every read/write (guarded by `IS_CONFIGURED()`). The app runs fully offline/local. Schema + RPCs live in `supabase/migration_001_schema.sql`, `migration_002_scale.sql`; code calls RPCs `sasyra_batch_insert_assessment` and `sasyra_migrate_from_localstorage`.
2. **Anthropic AI proxy (optional, backend).** Set `ANTHROPIC_API_KEY` in `server/.env` (gitignored). Without it `/api/anthropic` returns 500 and `/api/health` reports `keyConfigured: false`. The proxy enforces a Portuguese-BR evidence-based physio system prompt with prompt caching, a quota check, and token tracking persisted to `server/data/*.json` via `server/memoryStore.js`.

Never commit `.env`, `server/.env`, or `server/data/`.

## Testing quirks

- Vitest config restricts tests to `src/**/*.test.js`. The root `tests/` dir is **empty** — ignore it. Real tests are in `src/data/__tests__/` and `src/integrations/__tests__/`.
- Test environment is `node` (not jsdom) — no `window`/`document`/`localStorage` globals. Tests that need them mock localStorage (see `transitionBridge.test.js` for the pattern).
- Integration tests (`src/integrations/__tests__/integrations.test.js`) assert that Google Calendar / WhatsApp no-op gracefully when unconfigured — they log to stdout by design.

## Conventions

- **Before any code change, read `SIMULACAO_PERSONAS.md`** — it holds the user-research priorities (top contras/pros) that guide what to fix or build next. This is a team rule, not optional.
- Commit style: conventional commits (`feat:`, `fix:`, `chore:`, `lint:`), Portuguese descriptions — see `git log`.
- UI language is Portuguese (pt-BR default); user-facing strings should go through i18n (`src/i18n/locales/{pt-BR,en}.json`, key persisted in localStorage `sasyra_lang`).
- Design system uses CSS custom properties (`--green`, `--surface`, ...); the `C` token object in `src/components.jsx` and `App.jsx` references them. Match existing module colors per `src/data/modules.js`.
- `scripts/test-*.mjs` (Playwright) and `gerar-pdf.mjs` (Puppeteer) are ad-hoc smoke/PDF scripts; Playwright/Puppeteer are NOT in `package.json` deps — run via `npx` if needed. Not part of CI.
- `src/src/` is an empty leftover directory; ignore it.

## Notes worth keeping

- Top user-reported contras still open: (1) data only in localStorage without backend, (2) no native mobile app for students, (3) no Google Calendar/WhatsApp integration wired with real credentials, (4) IA cost on basic plans. Area-specific support (pediatria, neuro, crossfit) is already implemented — don't re-add.
- Reference docs in repo root: `SASYRA_FEATURES.md`, `PARECER_TECNICO_SASYRA.md`, `CUSTOS_INFRAESTRUTURA.md`, `PROMPT_IMPLEMENTACAO.md`, `TODO.md`.
