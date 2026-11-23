# ZT Automotive Collection — Design Decisions

The log for Foundations v1.0. Each entry records the decision, why it was made, and the alternative it beat. New decisions are appended with a date and an approver. v1.0 is frozen; any change after it becomes v1.1 and needs Alex's approval.

Source: Figma `NkR9bvaMl2D0hUMfB6mOLv`, page "Foundations · v1.0 (approved)". See `DESIGN_DNA.md` for the rules and `QA_REPORT.md` for the evidence.

---

## v1.2 (proposed) — typography reset, 23 Nov 2026 (requested by Alex)

| # | Decision | Reason |
|---|---|---|
| T6 | **Bodoni Moda removed from the proposal.** Display and body use one contemporary sans: **Inter** (primitive `font/family/sans`, system `font/sans`). | Alex's direction: confident, clean sans, no fashion-magazine serif. Helvetica Neue, Neue Haas Grotesk and Suisse Int'l are not installed or licensed in this Figma, so Inter stands in, as Alex allowed. Swap the primitive when a licensed face arrives. |
| T7 | 14 new text styles, `ZT v1.2/…`, with sizes still bound to `ZT Layout`. Hierarchy comes from weight and tracking: Display/H1–H3 Medium with −3% to −1% tracking; Title and Price Semi Bold; labels Semi Bold uppercase +6–12%; body Regular. | One family, strong hierarchy, controlled tracking. |
| T8 | v1.1 styles (`ZT/…`) are kept untouched for reference until v1.2 is approved. | Alex asked to preserve v1.1. |

## v1.1 — 23 Nov 2026 (requested by Alex)

| # | Decision | Reason |
|---|---|---|
| V1 | **Dark page background `bg/canvas` → `#191D21`** (primitive `neutral/900`). | Alex's call: a softer graphite-blue canvas instead of near-black `#101112`. |
| V2 | Dark ladder re-solved around it: `surface` `#1F2428` (`neutral/850`), `raised` Graphite `#292C30` (`neutral/800`), `sunken` Obsidian `#101112` (`neutral/950`). | It keeps the depth order: sunken < canvas < surface < raised. Obsidian and Graphite stay from Alex's board. |
| V3 | All dark pairs re-measured. Lowest: danger on raised 4.79:1, border/strong on raised 3.25:1. | AA still holds (see `QA_REPORT.md` §3). |

Light mode is unchanged. `neutral/1000` Carbon stays a primitive and is no longer used by any semantic token.

## Approved by Alex — 23 Nov 2026

| # | Decision | Reason |
|---|---|---|
| A1 | **Foundations v1.0 approved and frozen as the working baseline.** | Passed three independent reviews (design, spacing, composition/colour). |
| A2 | **No automotive photography on the Foundations page.** | The page documents the system and has no use for an exhibit. A real image arrives with the homepage and must have recorded provenance. |
| A3 | **Keep the current Rosso tokens until official ZT brand colours are confirmed.** | The palette is conceptual by the client's own note. When the brand colours land, only primitives change. |
| A4 | **Keep the separate vermilion danger colour** (`#E8774A` / `#A93A12`). | Danger must never read as the brand accent. It always carries an icon and a label. |
| A5 | **Keep `space/section` at 160px at both 1440 and 1920.** | Section air stays constant on wide screens; the margin carries the extra width. |
| A6 | **Replace the invisible 302px spacer with grid alignment.** | Done with the responsive token `grid/offset-3` (0 / 0 / 182 / 238 / 326 / 408). The lede still starts at x 406; the composition is unchanged. |
| A7 | **Adopt Lucide Icons**: 1.5px stroke at every size (`absoluteStrokeWidth`), sizes 16 / 20 / 24 / 32. | One outline set, with a stroke that matches the Hanken Grotesk stem. |
| A8 | **Do not start the homepage** until Alex approves the next phase. | — |

## Direction decisions — 23 Nov 2026

| # | Decision | Reason | Rejected alternative |
|---|---|---|---|
| D1 | **Style mode HYBRID.** Anchor cinematic-industrial, contrast refined-elegance, signature technical-luxury (data only). | No dialect was named. HYBRID is the default, and the brief's principles ("cinematic, architectural, editorial · refined, confident, restrained · strong grid, generous negative space · purposeful motion") split cleanly across these three. | **auction-editorial**, used in v0.1 without Alex naming it. That breaks TASTE.md §2 (2026-10-25), so it was removed. |
| D2 | **Governing idea:** "a dark private gallery; the architecture is exact and quiet so the car is the only thing lit." | It gives every later section a test it can fail. | "Luxury, premium, cinematic": names a mood, not an idea. |
| D3 | **Mandate: REBRAND for the portal.** ZT name and the Z mark carry through. | The brief says "establish its own visual identity"; the existing site is reference only. | REDESIGN of the corporate site: the brief rules it out. |
| D4 | **Dark-first.** Light is a re-solved alternate. | Cinematic-industrial anchor; photography carries the light. | Light-first on the Ivory ground. It drifts toward a cream ground, which is banned by default (color-taste I8). |

## Colour — 23 Nov 2026

| # | Decision | Reason | Rejected alternative |
|---|---|---|---|
| C1 | Neutrals anchored on Alex's proposed Obsidian / Graphite / Titanium / Stone / Ivory, extended into a 14-step ladder, plus Carbon `#08090A`, Paper `#FAFAF8` and white. | They are Alex's own direction for the project. | The Figma draft relabelled `#555A5F` as "Titanium". Kept Alex's `#777A7C`. |
| C2 | Single accent, **Rosso**, derived from the red Z mark and desaturated toward oxblood. Per mode: `bg/accent` `#A8322A` dark (lifts off near-black), `#8C2620` light. | The accent has to come from something the project contains (color-taste). Intent only: primary action, focus, selected state. | One fixed red in both modes: on dark it disappears into near-black. |
| C3 | Dark `border/accent` set to rosso/400 `#C8564A`. | rosso/500 measured 2.45–2.99:1 on dark grounds, below the 3:1 non-text minimum. | — |
| C4 | Danger moved from rosso to a separate **vermilion signal** primitive. | Accent and danger shared a hue (3–6°), so the primary CTA and a destructive action looked alike. | rosso/400 for danger: 4.4:1, and still the same hue. |
| C5 | Light ladder re-solved: `bg/raised` is white `#FFFFFF` with the overlay shadow; `bg/sunken` is `#E8E6E1`. | The mirrored ladder put "raised" darker than the page. Stone as sunken failed status text (3.83:1) and border/strong (2.81:1). | Stone `#D4D0C7` as a semantic ground. It stays a primitive only. |
| C6 | `text/tertiary` neutral/400 dark / neutral/600 light; the lowest pair is 4.53:1 on light sunken. | — | — |

## Typography — 23 Nov 2026

| # | Decision | Reason | Rejected alternative |
|---|---|---|---|
| T1 | **Two voices:** Bodoni Moda (display) and Hanken Grotesk (everything else). | A role is not a voice. Tabular figures in Hanken cover data, so a mono face has no job of its own. | IBM Plex Mono as a third voice: it was an auction-editorial expression. |
| T2 | Bodoni only at **≥ 32px** (Display, H1, H2). H3 is set in Hanken Medium. | A high-contrast display face stops reading well below about 40px; 32 is the floor, verified in the render. | Bodoni H3 at 24–32px. |
| T3 | **No italic signature word.** The two italic styles were deleted. | It is auction-editorial typography D2 and on the slop list. | — |
| T4 | Font sizes bound to `ZT Layout` modes: one style per role, and the size changes with the viewport mode. | Fewer styles, and no desktop/mobile style pairs to drift apart. | The draft's 22 `ZT/Type/Desktop|Mobile` styles. Deleted. |
| T5 | `type/title` raised to 24 at 768 and 28 at 1920. | It tied with `type/lead` in two modes, which breaks the rank order. | — |

## Layout and spacing — 23 Nov 2026

| # | Decision | Reason |
|---|---|---|
| L1 | **6 viewport modes:** 375 / 390 / 768 / 1024 / 1440 / 1920. Taken from the Figma draft and extended with type and section tokens. | Covers small phones and small desktop. One collection drives grid, type and section rhythm. |
| L2 | Mobile margin **16** (the draft's value; v0.1 had 20). | Matches the 16px side gutter standard at phone width. |
| L3 | `space/section` mobile raised from 64 to **80**. | 64 against 56 for `section-tight` was too small a step to read. |
| L4 | Gap tokens follow their axis: `inline/*` for horizontal, `stack/*` for vertical. Added `stack/2xs` (4) and `inline/xl` (40). | Semantic correctness. Every gap and padding on the page is bound to a variable. |
| L5 | `breakpoint/min-width` for the 1440 mode is **1280**. | The desktop layout should apply from 1280; 1440 is the design width. |

## Motion — 23 Nov 2026

| # | Decision | Reason |
|---|---|---|
| M1 | **Native Figma TIMING and EASING variables** (`ZT Motion`), replacing v0.1's number and string tokens. | Directly bindable in prototypes. (Figma does not allow scopes on these types.) |
| M2 | Added `cinematic` 1200ms: hero reveal, once per page. | The anchor allows one weighted, slow event. |
| M3 | **Reduced** mode: every duration resolves to `instant`. | Reduced motion is a mode, not just a note. CSS mirrors it with `prefers-reduced-motion`. |
| M4 | Removed `hover-lift` (2px) and `max-travel` (8px). | auction-editorial expressions. |
| M5 | Lenis on every web build, from the first build. | Alex's standing instruction (global CLAUDE.md). It overrides the build standard's native-scroll default. |

## Surfaces, imagery, icons — 23 Nov 2026

| # | Decision | Reason |
|---|---|---|
| S1 | One effect style, `ZT/Elevation/Overlay`, used only in light mode on `bg/raised`. Draft styles 00 (flat) and 01 (cards) were deleted. | Depth cues should match real layering. No decorative shadows. |
| S2 | Radius: media 0, controls and tags 2, card 4, modal 8, pill 999. | Machined edges; photography is never rounded. |
| S3 | Fixed image ratios 16:9 / 3:2 / 4:5 / 1:1. | Very different photographs still read as one collection. |

## Merge record — 23 Nov 2026

Two Foundations existed: v0.1, built by Claude, and a draft built directly in Figma that extended the same variables. They were merged into one system.

- **Kept from the draft:** the ZT Layout 6-mode collection, native ZT Motion, the `ZT/Grid/375–1920` styles, icon size and stroke tokens, image ratios, `space/container/*`, and the Overlay shadow.
- **Removed as duplicates or conflicts (68 items):**
  - `brand/*`, `text/muted`, `status/error`, `space/component/inset/*`;
  - line-height primitives;
  - `ZT/Type/*` (22 styles);
  - elevation 00 and 01;
  - v0.1's `Responsive` collection and number/string motion tokens;
  - the 4 fixed v0.1 grid styles;
  - the mono family.
- **Repaired:** scopes on every scopeable variable (the draft had left them on "all scopes"), code syntax added, stale descriptions corrected.
- The draft page was **archived, not deleted**: "Archive · Foundations draft (Figma)".
