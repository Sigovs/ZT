# ZT Automotive Collection — Design DNA (project)

**Status:** Foundations **v1.1**. v1.0 was approved by Alex and frozen as the working baseline on 23 Nov 2026. v1.1 is Alex's change of the dark canvas to `#191D21`, with the dark ladder re-solved.
**Source of truth:** Figma file `NkR9bvaMl2D0hUMfB6mOLv` (ZT AUTO GROUP), page **"Foundations · v1.1"**, frame `8:3`. The archived Figma draft (page "Archive · Foundations draft (Figma)") is reference only and is superseded.
**Companion files (this folder):** `design-tokens.json` · `tokens.css` · `DESIGN_DECISIONS.md` · `QA_REPORT.md`.

> Read this before any design or build work on ZT. It is the project layer only. Alex's global Design DNA (`/Users/alex/Desktop/WORK/design_dna/TASTE.md`, its `skills/` and `.claude/rules/design-dna.md`) still governs and outranks this file on every invariant. Never edit the global files from this project.

---

## 1. What this is

A **new** luxury and exotic automotive portal for ZT Automotive Group, built from scratch. It is not a redesign of the existing corporate site; that site is a source of facts only. Hero marques: **McLaren, Rolls-Royce, Koenigsegg, Czinger, Ferrari**. The mainstream dealer network is a secondary route.

**Governing idea:** *The portal is a dark private gallery. Its architecture stays exact and quiet, so the car is the only thing with light on it.*

Every section, component and state should be able to say how it serves that sentence.

## 2. Design Read (locked for v1.0)

| | |
|---|---|
| Mandate | **REBRAND for the portal** — own visual identity per the brief. Fixed carriers: the ZT name, the red "Z" mark. ZT corporate identity and OEM requirements are respected. |
| Style mode | **HYBRID** (no dialect was named by Alex) |
| Anchor | `cinematic-industrial` — colour, image behaviour, depth, motion |
| Contrast | `refined-elegance` — typography, interval, geometry, containers |
| Signature | `technical-luxury` — specification and price data only |
| Unifying principle | The interface is a gallery's architecture; the car is the exhibit. |
| Dimensionality | **ABSENT** at foundations level. Depth comes from light and tone, not scenes. Re-declare per page. |

**Control map**

| Domain | Owner |
|---|---|
| Composition, grid | refined-elegance (proportion and interval) |
| Hierarchy, density | cinematic-industrial (image dominant, type subordinate) |
| Typography voices | refined-elegance (didone display + quiet grotesque — two voices) |
| Spacing, rhythm | refined-elegance |
| Colour, contrast | cinematic-industrial (narrow, low-chroma, dark ground, one accent) |
| Image behaviour | cinematic-industrial |
| Containers, geometry | refined-elegance (near-square, few containers, no decorative shadow) |
| Depth, materiality | cinematic-industrial (light and tone) |
| Motion | cinematic-industrial (few, weighted, decelerating entrances) |
| Information presentation | technical-luxury (specs and prices as evidence, tabular figures) |
| Task means, CTA rank | the governing idea + usability, never a dialect |

### Not used — `auction-editorial`

Alex has not named it for ZT (TASTE.md §2, 2026-10-25). Its devices stay out unless he names it:
mono micro-labels and mono data voice · italic "signature word" in headlines · 2px hover lift · 8px travel ceiling · spec plates as a house device · "one committed gesture" as a default.

## 3. Colour

- **Dark first.** Dark is the default theme. Light is a re-solve, not a flip: in light, `bg/raised` is the lightest step (pure white with the overlay shadow) and `bg/sunken` the darkest.
- **Dark canvas `#191D21`** (v1.1, Alex): a graphite-blue rather than near-black. Dark ladder: `bg/sunken` Obsidian `#101112` < `bg/canvas` `#191D21` < `bg/surface` `#1F2428` < `bg/raised` Graphite `#292C30`.
- **Neutral world, one accent.** Neutrals are anchored on Alex's proposed palette: Obsidian `#101112`, Graphite `#292C30`, Titanium `#777A7C`, Stone `#D4D0C7`, Ivory `#F5F4F0`. Light canvas is Paper `#FAFAF8` (near-neutral). No beige or cream ground.
- **Rosso** is the only accent. It is derived from the red "Z" mark and desaturated toward oxblood. It marks intent only: the primary action (one per view), focus, the selected state. Never decoration.
  - `bg/accent` `#A8322A` dark / `#8C2620` light · `text/accent`, `border/focus` `#E0928A` dark / `#8C2620` light · `border/accent` `#C8564A` dark / `#8C2620` light.
  - **Provisional** until official ZT brand colours arrive. Then only primitives change.
- **Danger is vermilion, not Rosso:** `#E8774A` dark / `#A93A12` light (16–17° hue vs Rosso 3–6°). Danger always carries an **icon and a label**.
- **Never meaning by hue alone.** A selected state adds a second carrier: weight 1.5, a check mark or a tone step.
- **Input edges** use `border/strong` (≥3.4:1). `border/subtle` and `border/default` are decorative only.
- **Text over photography:** `bg/image-scrim` assists and cannot guarantee AA. Legibility is fixed at the image layer — grade, composition, a reserved text zone — and measured on the composited render.
- Every semantic pair passes WCAG AA in both modes (see `QA_REPORT.md`). Any palette change re-runs that table.

## 4. Typography

Two voices. No third face, no mono.

| Voice | Face | Weights | Role |
|---|---|---|---|
| Display | **Bodoni Moda** | 400 | Hero line, H1, H2 — **never below 32px** |
| Body | **Hanken Grotesk** | 300 / 400 / 500 | Everything read or used: H3, titles, body, labels, buttons, data |

13 text styles (`ZT/…` in Figma, `.zt-…` in CSS). Sizes of the first seven follow the ZT Layout mode.

| Style | Face · weight | Size 375 → 1920 | Line height · tracking |
|---|---|---|---|
| Display/Hero | Bodoni 400 | 48 · 48 · 72 · 80 · 96 · 112 | 96% · −2% |
| Heading/H1 | Bodoni 400 | 40 · 40 · 48 · 56 · 64 · 80 | 100% · −1.5% |
| Heading/H2 | Bodoni 400 | 32 · 32 · 40 · 40 · 48 · 56 | 105% · −1% |
| Heading/H3 | Hanken 500 | 24 · 24 · 28 · 28 · 32 · 32 | 120% · −1% |
| Title/Default | Hanken 500 | 20 · 20 · 24 · 24 · 24 · 28 | 125% · −0.5% |
| Body/Lead | Hanken 300 | 18 · 18 · 20 · 20 · 20 · 24 | 145% · 0 |
| Body/Default | Hanken 400 | 16 · 16 · 16 · 18 · 18 · 18 | 160% · 0 |
| Body/Small | Hanken 400 | 14 | 150% · 0 |
| Label/Eyebrow | Hanken 500, UPPER | 14 | 120% · +10% |
| Label/Button | Hanken 500, UPPER | 14 | 100% · +8% |
| Data/Spec | Hanken 400, tabular | 16 | 140% · 0 |
| Data/Price | Hanken 500, tabular | 24 | 120% · −1% |
| Data/Caption | Hanken 400 | 14 | 140% · +1% |

Rules:
- **14px floor** for anything functional, at every breakpoint.
- No italic emphasis word in headlines.
- Measure: lead ≤ 60ch, body ≤ 68ch.
- Eyebrows: ≤ 5 words, and not above every heading.
- Prices, mileage and specs always use tabular figures.
- Line breaks are intentional. Never start a line with a separator.
- Type rank holds in every mode: display > h1 > h2 > h3 > title > lead ≥ body.

## 5. Spacing and layout

- **Scale:** 4-point base, mostly 8. Primitives run 0 → 240.
- **Component tokens (ZT System):**
  - `space/inline/*` for horizontal gaps: 4 / 8 / 16 / 24 / 40.
  - `space/stack/*` for vertical gaps: 4 / 8 / 16 / 24 / 40 / 64.
  - `space/inset/*` for padding: 12 / 24 / 40.
  - `space/container/gap` 32 · `space/container/inset` 48.
- Internal gaps are smaller than external ones. A label sits 16 above its content; rows inside it sit 8 or 12 apart.
- More air below a block than above it.

**ZT Layout modes**

| Token | 375 | 390 | 768 | 1024 | 1440 | 1920 |
|---|---|---|---|---|---|---|
| breakpoint/min-width | 0 | 0 | 768 | 1024 | 1280 | 1920 |
| grid/columns | 4 | 4 | 8 | 12 | 12 | 12 |
| grid/gutter | 16 | 16 | 24 | 24 | 24 | 32 |
| grid/margin | 16 | 16 | 32 | 48 | 80 | 160 |
| grid/container | 343 | 358 | 704 | 928 | 1280 | 1600 |
| grid/offset-3 | 0 | 0 | 182 | 238 | 326 | 408 |
| space/section | 80 | 80 | 96 | 128 | 160 | 160 |
| space/section-tight | 56 | 56 | 72 | 80 | 96 | 112 |
| space/block | 32 | 32 | 40 | 48 | 56 | 64 |

- `space/section` is held at 160 from 1440 to 1920 by decision.
- `grid/offset-3` is the start of column 4 (3 columns + 3 gutters). It aligns ledes and content columns to the grid; never use an empty spacer frame.
- Grid styles: `ZT/Grid/375 … 1920` hold fixed values. `ZT/Grid/Responsive` is bound to ZT Layout. `ZT/Grid/Baseline 8` is the 8px baseline.

## 6. Surfaces

- **Radius:**
  - `none` / `media` 0 — photography is never rounded;
  - `control` 2 · `tag` 2 · `card` 4 · `modal` 8 · `pill` 999.
  - Containers are rare; separate with tone and hairlines.
- **Border width:** `hairline` 1 · `emphasis` 1.5 (selected) · `focus` 2 with a 2px offset. The focus ring is always visible.
- **Elevation:** one shadow only, `ZT/Elevation/Overlay` (y 12, blur 32, 16% Carbon).
  - It is for surfaces that truly sit above the page (mega menu, dialogs, drawers), on `bg/raised`, in light mode only.
  - Dark mode uses no shadow: `bg/raised` + `border/default`.

## 7. Imagery and icons

- **The car is the subject.** Fixed frame ratios: `cinematic` 16:9 (editorial bands, hero) · `landscape` 3:2 (inventory cards) · `portrait` 4:5 · `square` 1:1 (detail crops).
- **Only approved or properly sourced imagery.** Unconfirmed OEM assets are banned (brief). Generated imagery follows the global `generated-imagery` skill (GI1–GI9): disclosed, provenance recorded, no baked-in type.
- **The Foundations page carries no automotive photography** (decision).
- **Icons: Lucide.**
  - Outline, `stroke-width 1.5` with `absoluteStrokeWidth` (1.5px at every size), round caps and joins, `currentColor`.
  - Sizes 16 (inline with 14–16px text) · 20 (default: nav, buttons) · 24 (standalone controls) · 32 (feature marks only).
  - One set only. An icon never carries meaning alone: it has a visible label or an accessible name.

## 8. Motion

- **Principle:** motion states a change and stops. Entrances decelerate (`enter`); exits accelerate (`exit`) and are never slower than entrances. Content swaps crossfade rather than travel; repositioning uses `move`, which is weighted.
- **Durations:** `micro` 150 (hover, focus, toggles) · `base` 250 (crossfades, menus, tabs) · `slow` 400 (panels, mega menu, drawers) · `stage` 700 (gallery image swap) · `cinematic` 1200 (hero reveal, once per page) · `instant` 0.
- **Easing:**
  - `enter` cubic-bezier(0.22, 1, 0.36, 1);
  - `exit` cubic-bezier(0.55, 0, 1, 0.45);
  - `move` cubic-bezier(0.65, 0, 0.35, 1);
  - `progress` linear (scrubbed progress only).
- **Reduced motion:**
  - ZT Motion mode **Reduced** (Figma) and `@media (prefers-reduced-motion: reduce)` (CSS) send every duration to 0.
  - The static path is complete and nothing is hidden.
- **Scroll:** Alex's standing instruction is that **every web project ships Lenis from the first build**, with these rules:
  - not constructed under `prefers-reduced-motion: reduce`;
  - `anchors: true`;
  - nested scrollers marked `data-lenis-prevent`;
  - when GSAP is present, Lenis runs on `gsap.ticker` with `autoRaf: false`.

  It goes in before any sticky or scroll-linked work is tuned. Full contract: `DNA90` in the global build standard.

## 9. Accessibility (binding)

- WCAG 2.2 AA contrast in both themes. Text ≥ 4.5:1, non-text ≥ 3:1, both measured on the composited render.
- Functional text ≥ 14px. Body ≥ 16px.
- Focus visible on every interactive element (`border/focus`, 2px, 2px offset). Keyboard parity for every hover or pointer behaviour.
- Touch targets ≥ 44 × 44px.
- No meaning by colour alone. Status = colour + icon + label.
- A reduced-motion path for every animation.
- Text over images is legible at the worst-case region of the image.
- No horizontal page scroll at any width. Mobile is composed separately, not cropped from desktop.
- Data surfaces design loading, empty, error, populated and edge states.

## 10. Content honesty

- No invented prices, counts, dates or guarantees. Placeholders are visibly placeholders (`$000,000`, `0,000 km`, `ZT-0000`).
- Every claim on a shipped page maps to a source (global `content-provenance`, CP1–CP7).

## 11. Using the system

- **Figma:**
  - Set `ZT Color` (Dark / Light), `ZT Layout` (viewport) and, if needed, `ZT Motion` (Default / Reduced) on the outermost frame; children inherit.
  - Pick semantic tokens only; primitives are hidden from pickers.
  - Use a `ZT/` text style, never manual sizes.
- **Code:**
  - Import `tokens.css`. Semantic variables carry no prefix (`--color-bg-canvas`, `--space-stack-md`, `--type-h1`, `--motion-duration-base`). Primitives are `--zt-*`; don't use them in components.
  - Light theme: `<html data-theme="light">`.
  - `design-tokens.json` holds the same data in a DTCG-style structure for build tooling.
- **Changes:** Figma is the source. Change the variable there, re-export, regenerate `tokens.css` and `design-tokens.json`, re-run the QA contrast table, and log the change in `DESIGN_DECISIONS.md`. v1.0 is frozen; changes become v1.1 with Alex's approval.

## 12. Outstanding brand and asset decisions

| Item | Status | What changes when it lands |
|---|---|---|
| Official ZT brand colours and logo files | **Pending from client** | Rosso (and possibly neutrals) primitives only. Semantic names stay. AA table re-run. |
| Hero photography (real or disclosed generated) | Not started | First real image validates `text/on-image` over `bg/image-scrim` on the composited render. |
| OEM asset approvals (McLaren, Rolls-Royce, Koenigsegg, Czinger, Ferrari) | Pending | Nothing OEM is used until confirmed. |
| Final sitemap, dealership routing, inventory architecture | Open in the brief checklist | Drives homepage, SRP and VDP structure. |

**Next phase (blocked until Alex approves starting it):** homepage design, built on these tokens.
