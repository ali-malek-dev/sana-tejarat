# Design — "The Maquette"

## Concept

The site is a **porcelain scale model of a port** (an architectural maquette)
sitting on a navy plinth in a dark room. Among hundreds of white and navy containers,
exactly **one is brass: the visitor's shipment**. Scrolling follows that container
through the process the consultancy sells:

| Chapter | Story time `u` | What the model does | What the card says |
|---|---|---|---|
| Hero | 0 | Whole model on its plinth; the import ship is approaching | Headline, consultation CTA, "the brass container is yours" |
| واردات (imports) | 1 | Ship sails in; tugs push it onto the berth | Order registration, currency allocation, transport |
| تخلیه (unloading) | 2 | Crane hoists the brass box onto a truck | Shipping documents, discharge, loading |
| ترخیص (customs) | 3 | Truck crosses the yard, gets scanned at the gate, barrier lifts | Declaration, valuation/tariff, inspection, clearance |
| صادرات (exports) | 4 | A second brass box is loaded; the export ship leaves | Export documents, loading, departure |
| Overview | 5 | Camera rises to a top-down plan view | "One clear path", link to services |

Each card's step list ticks (✓) at the moment the model performs that step, so the
text and the 3D tell the same story.

### Why this and not a globe

Glowing globes with trade arcs are what every logistics template ships. A maquette says
*planned, precise, under control*, which is the consultancy's actual promise, and it
stays formal: matte porcelain, no neon, no particles. The 3D is the one bold element;
everything else on the page is quiet.

### Brass is a semantic colour

Brass (`#C8A050`) means **"yours / your action"**: the client's containers, the route marker,
ticked steps and the primary CTA. Nothing decorative is ever brass. Keep it that way.

## Tokens

| Name | Hex | Role |
|---|---|---|
| Navy 950 | `#081629` | Stage background, footer |
| Navy 900 | `#0F2440` | Plinth, calculator section, headings on light |
| Navy 700 | `#1D3A63` | Navy containers, links |
| Porcelain 50 / 100 | `#F4F6F8` / `#ECEFF2` | Light sections, model material |
| Steel 400 / 600 | `#9AA8B8` / `#55667C` | Secondary text |
| Brass 500 / 300 | `#C8A050` / `#E0C58C` | The client's shipment; CTA |

Source of truth: `src/styles/main.css` (`:root`) and `src/constants/palette.ts` (3D).

**Type.** Display is **Noto Kufi Arabic** (variable). Kufic letterforms are built on a grid,
which echoes stacked containers. Body is **IBM Plex Sans Arabic**: engineered and corporate,
and clearly distinct from the Kufi. Both are self-hosted via Fontsource. Do not use Google
Fonts, which is slow or blocked for many Iranian visitors. The body is 17px with a 1.9 line-height
(Persian script needs the extra leading).

**Layout.** RTL. On desktop the chapter cards sit on the right (inline-start) and the camera's
view offset pushes the action into the left two-thirds. On mobile the card docks at the bottom
and the view shifts up. Below the story, sections use hairline rules (a services *index*, a stats
*ledger*, a news bulletin) rather than a grid of identical cards.

## Motion

- **One orchestrated moment**: on load the camera settles down onto the model (2.6s).
- Everything else is **scroll-driven and scrubbable**. `world.apply(u)` is a pure function
  of story time, so scrolling back plays everything in reverse correctly.
- Camera damping smooths wheel steps; the camera eases between stops so it rests while a card is read.
- `prefers-reduced-motion`: no intro, no damping, and each chapter shows its finished state
  (`SETTLED_U`) instead of animating.

## Performance budget

- All geometry is procedural (no model files): containers are `InstancedMesh`es.
- Renders **on demand**: the loop stops when the camera settles or the story leaves the viewport.
- three.js is lazy-loaded (`import()`), so the HTML/CSS/text paint first. The main JS is about 3 KB gzipped
  and the 3D chunk about 150 KB gzipped.
- Shadow map is 4096 on desktop and 2048 on small screens; DPR is capped at 2 (1.5 on small screens).

## Fallbacks and accessibility

- No WebGL: the chapters are real HTML and read as a normal page over the navy gradient.
- The canvas and route rail are `aria-hidden`; all content is in the DOM.
- Visible focus (brass outline), skip link, and the mobile menu closes on Esc.

## Ideas parked for later

- Inner service pages open on their chapter's camera stop (reusing the same scene).
- Hover a container in the overview to reveal a mini case study.
- Tilt-shift depth of field and ambient occlusion (N8AO) for a stronger "miniature" look, if the performance budget allows.
- A day/night toggle (the cranes' floodlights already exist as masts).
