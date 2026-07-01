# Reel Estates

A concept real-estate site with a content-first twist: properties are marketed through short-form video "reels," and the homepage mirrors that with an interactive reel-browsing experience.

The homepage is a single scrolling page covering a hero, a reel preview stage, featured properties (with a shareable detail modal), destination spotlights, the sales team, and a mock consultation-booking flow. All data is static and hand-authored - there is no backend.

See [`CONTEXT.md`](CONTEXT.md) for the domain language and [`docs/adr/`](docs/adr/) for the key design decisions.

## Tech stack

- [**Next.js**](https://nextjs.org/) 16 (App Router)
- [**React**](https://react.dev/) 19
- [**TypeScript**](https://www.typescriptlang.org/) 5 (strict)
- [**framer-motion**](https://www.framer.com/motion/) - animation
- **CSS Modules** + design tokens - styling (no Tailwind / CSS-in-JS)
- [**Vitest**](https://vitest.dev/) + [**Testing Library**](https://testing-library.com/) - unit/component tests
- [**ESLint**](https://eslint.org/) (`eslint-config-next`)

## Getting started

```bash
npm install
npm run dev        # start the dev server at http://localhost:3000
```

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the local dev server           |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint                           |
| `npm test`      | Run the Vitest suite                 |

## Project structure

```
src/
  app/            # App Router entry (layout, page, globals)
  components/     # UI grouped by domain (reel, property, agent, consultation, sections, ui, nav, layout)
  data/           # Static content: properties, reels, agents, spotlights
  lib/            # Types, motion helpers, data utils
  styles/         # Design tokens
public/images/    # Property, agent, and spotlight imagery
docs/             # Design doc and ADRs
```
