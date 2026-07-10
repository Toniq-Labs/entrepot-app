# AGENTS.md

Frontend for [entrepot.app](https://entrepot.app) — a React 17 (CRA + `react-app-rewired`)
NFT marketplace on the Internet Computer.

## Build

-   `npm install` — install dependencies (Node 16.15.0 is pinned in `.nvmrc`; newer majors
    may work for local dev but the build/deploy pipeline uses 16).
-   `npm start` — run the dev server (`react-app-rewired start`).
-   `npm run build` — production build. Runs `scripts/build.js pre`/`post` to inject the
    `@toniq-labs/design-system` fonts, then `react-app-rewired build`.

`config-overrides.js` adds Node core polyfills (crypto, stream, http, buffer, …) required
by the `@dfinity` packages.

## Test

-   No unit/integration test suite exists yet. `npm test` runs the CRA test runner (react-scripts).
-   CI (`.github/workflows/ci-checks.yml`) currently only enforces Prettier formatting.

## Formatting

-   **Run `npm run format` before pushing.** Config in `.prettierrc.js`
    (printWidth 100, single quotes, no bracket spacing, trailing commas).
-   `npm run test:format` checks formatting without writing.

## Deploy

-   **Netlify** is the deploy target. Config in `netlify.toml`: `npm run build`, publishes
    `build/`, Node 20, an SPA catch-all redirect (`/* -> /index.html`) so react-router deep
    links work, and baseline security headers.
-   Fleek has been retired (workflow + `@toniq-labs/fleek-iterative-deploy` dep removed).

## Conventions & gotchas

-   Global app state lives in `src/App.js` and is prop-drilled (no Redux/Context).
-   IC integration is centralized in `src/ic/extjs.js`; Candid IDLs in `src/ic/candid/*.did.js`.
-   Untrusted, API-sourced HTML (collection `blurb`) must be run through
    `src/utils/sanitizeHtml.js`; untrusted URLs through `src/utils/safeUrl.js`.
-   Convert user-entered ICP amounts to e8s with `src/utils/icpAmount.js` (`icpToE8s`),
    never `BigInt(Math.floor(x * 1e8))` (floating-point precision loss).
-   Shared `useInterval` hook lives in `src/hooks/useInterval.js`.
