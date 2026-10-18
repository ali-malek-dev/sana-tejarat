# Sana Tejarat — website

Website for **Sana Tejarat (سنا تجارت)**, a Tehran import/export and customs consultancy.
Persian (RTL) first. The homepage is a scroll-driven 3D story: a porcelain scale model of a
port in which the visitor's shipment is the one brass container.

This repo currently holds the **static prototype** (used for design review). It becomes
a **WordPress theme** in phase 2; see [docs/ROADMAP.md](docs/ROADMAP.md).

| Doc | What's in it |
|---|---|
| [docs/BRIEF.md](docs/BRIEF.md) | The business, audience, content inventory, open questions |
| [docs/DESIGN.md](docs/DESIGN.md) | The 3D concept, tokens, motion, performance, accessibility |
| [docs/WORDPRESS.md](docs/WORDPRESS.md) | Why WordPress, how the owner will edit, theme architecture |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phases and status |

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve dist/
```

Stack: Vite, TypeScript, three.js. No framework; the markup lives in `index.html` so it
ports 1:1 to PHP templates.

## Publishing the preview

Every push to `main` builds and deploys to **GitHub Pages** via
`.github/workflows/deploy.yml`. Follow progress in the repo's *Actions* tab; the live URL is
shown under *Settings → Pages*.
