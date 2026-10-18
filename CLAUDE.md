# Sana Tejarat — project rules

Website for a Tehran import/export/customs consultancy. Owner is non-technical; the
end product is a **WordPress theme**. Today the repo is the static prototype of the homepage.
Read `docs/BRIEF.md` and `docs/DESIGN.md` before changing anything visual.

## Stack
- Vite + TypeScript (strict) + three.js. No UI framework.
- `index.html` is the reference markup and must stay portable to PHP templates: no
  JS-rendered content. JS only enhances (3D stage, steps, calculator, menu).
- Fonts are self-hosted via Fontsource (Noto Kufi Arabic for display, IBM Plex Sans Arabic for body).
  Never add Google Fonts or other CDNs (unreliable from Iran).

## Layout of `src/`
- `constants/`: palette, port layout (metres), story beats and camera stops. Tune here, not inline.
- `scene/`: procedural model builders (`build-*.ts`), `world.ts` (pure `apply(u)` choreography),
  `stage.ts` (renderer, camera, on-demand loop).
- `story/`: scroll → story time `u` (chapter i is centred at u = i), step ticks, route rail.
- `ui/`: calculator, menu, contact form.

## Invariants
- **Brass means "the client's"**: only the client's containers, the route marker, done-steps and the
  primary CTA. Never use brass decoratively, in 3D or CSS.
- `world.apply(u)` must stay a pure function of `u` (scrubbable both ways). No per-frame state.
- The stage renders on demand; don't add an always-on animation loop.
- Persian copy uses proper characters: ZWNJ in compounds (`می‌کنیم`), `ی`/`ک` (not Arabic `ي`/`ك`),
  Persian digits in visible text.
- RTL: use logical properties (`inset-inline-*`, `margin-inline-*`, `padding-inline-*`), never left/right.
- Respect `prefers-reduced-motion` (see `SETTLED_U`) and keep the no-WebGL fallback readable.

## Verify
`npm run build` must pass (it runs `tsc --noEmit`). For visual changes, screenshot desktop (1440×900)
and mobile (390×844) at several story positions; WebGL works in headless Chrome with SwiftShader.
