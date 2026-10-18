# Roadmap

## Phase 0: prototype ✅ (2026-10-18)
- [x] Brief extracted from the original design
- [x] 3D concept and token system ([DESIGN.md](DESIGN.md))
- [x] Static homepage prototype: procedural port, six-chapter scroll story, services, about,
      news, duty calculator, contact, footer; responsive, reduced-motion and no-WebGL fallbacks
- [ ] Published preview URL (free static host); see README → Publishing

## Phase 1: review with the owner
- [ ] Walk through the preview on desktop and phone
- [ ] Collect: logo SVG, real stats/contact/socials, calculator rules, English yes/no
- [ ] Adjust copy and the camera framing per her feedback

## Phase 2: WordPress theme
- [ ] `theme/sana-tejarat/` scaffold; Vite builds into `theme/sana-tejarat/assets/dist` with a manifest
- [ ] `front-page.php` from `index.html`; Customizer panel for contacts, stats and chapter texts
- [ ] `single.php`, `archive.php` (news/articles with category filter), `page.php`, `search.php`, `404.php`
- [ ] Contact Form 7 markup styled to match; WP-Parsidate for Jalali dates
- [ ] WordPress Playground blueprint so the owner can try the admin dashboard for free

## Phase 3: depth
- [ ] Service pages open on their chapter's camera stop
- [ ] Remaining calculators (tariff lookup by HS code, freight estimate) once the data source is known
- [ ] English version (Polylang)
- [ ] Optional visual upgrades from DESIGN.md → "Ideas parked"

## Phase 4: launch (owner's decision on host and domain)
