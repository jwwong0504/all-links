# Dr CS Wong Science Simulations

A responsive KSSM directory of 56 external simulations. The only simulation source is `src/data/simulations.json`; all cards, counts, chapter navigation and subject choices are generated from it. Form 1–3 contain Science; Form 4–5 contain Physics and Chemistry.

## Run locally

Use Node.js 22.12+ and pnpm 11.25.0:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite. To verify and build:

```sh
pnpm lint
pnpm test
pnpm build
pnpm preview
```

`pnpm validate` checks all required fields, HTTPS Netlify URL format, site/URL agreement, duplicates, exact category counts, and the total of 56. Validation runs automatically before every build. The tests also verify that invalid data is rejected.

## Netlify

Ready to deploy using the included `netlify.toml`: build command `pnpm build`, publish directory `dist`, Node 22. Or upload the built `dist` folder manually. This portal only links to the existing simulations and never changes them. External sites' network availability is independent of dataset validation.

For browser checks with the app running, install Chromium once with `pnpm exec playwright install chromium`, then run `pnpm test:browser`. Set `PORTAL_URL` to test a production preview.

Design conventions and the six installed skill sources are documented in `DESIGN.md`. Filters are encoded in the URL for sharing and reload. Additional checks: `node scripts/polish-check.mjs`.
