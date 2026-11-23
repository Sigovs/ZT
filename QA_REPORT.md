# ZT Automotive Collection — Foundations v1.0 QA Report

**Result:** v1.0 approved by Alex on 23 Nov 2026. **v1.1** (dark canvas `#191D21`) was re-measured; every dark pair passes AA. See §3.
**Artefact:** Figma `NkR9bvaMl2D0hUMfB6mOLv`, page "Foundations · v1.1", frame `8:3` (1440 × ~8,900, locked).
**Method:** Three reviews, each by a separate agent that did not build the page. They ran in sequence, as TASTE.md §0 rule 8 requires, on the Figma render (`get_screenshot`, with variable modes kept). All measurements were read-only from the file. The builder fixed findings between rounds. Each critic was capped at 3 rounds; every one closed in 2.
**Not applicable:** the web gate scripts (`gates/*.mjs`), because no browser page exists yet. Their checks (TOUCH / EDGE / CLIP / GONE, contrast, type floor) were reproduced on Figma geometry.

---

## 1. Summary

| Reviewer | Rounds | Verdict | Objective findings fixed | Left to Alex |
|---|---|---|---|---|
| design-critic | 2 / 3 | ready | 5 defects, 9 issues, 2 regressions from the fixes | 1 (car on the page): decided, none |
| spacing-critic | 2 / 3 | ready | 1 defect, 6 issues, 1 naming issue | 2 (spacer, 1440–1920 section): decided |
| composition-color-critic | 2 / 3 | ready | 1 defect, 5 issues, 1 swatch layout issue | 2 (rosso/300 tone, a photo): decided |

When a later critic changed shared tokens (`type/title`, `space/section`, `bg/raised`, `bg/sunken`, `border/accent`, `status/danger`), the earlier critics' findings were rechecked. None reopened.

## 2. Findings and dispositions

### design-critic

| # | Type | Finding | Fix |
|---|---|---|---|
| 1 | Defect | The Spacing chart clipped its last rows; 200 and 240 drew at the same length. | Rebuilt: 1px = 1 unit, labels set to auto width. |
| 2 | Defect | `space/0` and `space/72` were missing from the chart. | Added. |
| 3 | Defect | "Reduced motion resolves to instant" was claimed but not implemented. | Added ZT Motion mode **Reduced**. |
| 4 | Defect | "Primitives hidden from pickers" was only partly true. | All 101 primitives now have scopes `[]`. TIMING and EASING can't take scopes (a Figma limit), and the page now says so. |
| 5 | Defect | The italic signature word came from auction-editorial. | Removed; 2 italic styles deleted; specimen copy rewritten. |
| 6 | Issue | The body specimen contradicted its own measure claim. | Fixed at 580px (≈ 70 characters). |
| 7 | Issue | Light `bg/sunken` and `bg/raised` were the same colour. | Re-solved (see colour, I2 and I3). |
| 8 | Issue | Danger looked the same as the accent. | Separate vermilion signal colour. |
| 9 | Issue | 430 gaps and paddings were raw numbers. | All bound to variables. |
| 10 | Issue | Type-spec lines started with "·". | Intentional break after the face name. |
| 11 | Issue | The pill sample broke the label baseline. | Centred in a 72px slot. |
| 12 | Preference | No car on the page. | Alex: keep the page free of photography. |
| 16–17, N1, N2 | Issue | Mode labels, placeholder icons, header wrap, redundant px column. | Fixed. |

### spacing-critic

| # | Type | Finding | Fix |
|---|---|---|---|
| D1 | Defect | `type/title` = `type/lead` at 768 and 1920. | Title is now 24 at 768 and 28 at 1920. |
| I1 | Issue | Label-to-content gap was no bigger than the row gap in 7 blocks. | Label gap 16; rows 8 or 12. |
| I2 | Issue | Second columns missed alignment by 8px. | Both at `inline/lg`. |
| I3 | Issue | The swatch grid ended 4px short of the column. | Fill width. |
| I4 | Issue | The Apply / Extend row broke the 3-column grid. | Apply spans 2 columns; Extend starts at column 3. |
| I5 | Issue | Masthead and footer baselines were offset. | Baseline alignment. |
| I6 | Issue | Mobile section step was 64 against 56. | `space/section` mobile = 80. |
| N1 | Issue | Vertical stacks were bound to `inline/*` tokens. | Axis-correct tokens; added `stack/2xs` and `inline/xl`. |
| N2 | Preference | The ending was lopsided. | Extend copy shortened. |
| P1 | Preference | An invisible 302px spacer. | Alex: replace. Now the `grid/offset-3` token. |
| P3 | Preference | Section stays 160 from 1440 to 1920. | Alex: keep. |

### composition-color-critic

| # | Type | Finding | Fix |
|---|---|---|---|
| D1 | Defect | Dark `border/accent` measured 2.45–2.99:1, below 3:1. | rosso/400: 3.80–4.64:1. Selected state requires a second carrier. |
| I1 | Issue | Accent and danger shared a hue (3–6°). | Vermilion signal: 16–17°. |
| I2 | Issue | Light ladder was mirrored; "raised" was darker than the page. | `bg/raised` = white plus overlay shadow. |
| I3 | Issue | Stone as sunken failed status text and border/strong. | `bg/sunken` = `#E8E6E1`. |
| I4 | Issue | No border colour was named for input edges. | `border/strong` documented. |
| I5 | Issue | The scrim's limits were not documented. | Rule added: legibility is held at the image layer. |
| N | Issue | An orphan swatch row. | Swatches grouped by family on 8 columns. |
| P1 | Preference | rosso/300 reads salmon. | Alex: keep current Rosso until brand colours arrive. |
| P2 | Preference | A photograph on the page. | Alex: no photography on Foundations. |
| — | Preference | Danger reads orange rather than red. | Alex: keep vermilion. |

## 3. Contrast (v1.1, both modes, composited)

Dark grounds (v1.1): canvas `#191D21` / surface `#1F2428` / raised `#292C30` / sunken `#101112`. The dark column was re-measured by the builder for v1.1; the v1.0 values were measured by composition-color-critic.

Grounds in order: canvas / surface / raised / sunken.

| Pair | Dark | Light |
|---|---|---|
| text/primary | 15.40 / 14.23 / 12.74 / 17.18 | 18.09 / 17.18 / 18.90 / 15.16 |
| text/secondary | 8.92 / 8.24 / 7.38 / 9.95 | 10.30 / 9.79 / 10.77 / 8.63 |
| text/tertiary | 6.15 / 5.68 / 5.09 / 6.86 | 6.67 / 6.33 / 6.97 / 5.59 |
| text/accent | 6.98 / 6.45 / 5.78 / 7.78 | 8.33 / 7.91 / 8.70 / 6.98 |
| text/on-accent on bg/accent | 6.05 | 7.91 |
| text/inverse on bg/inverse | 17.18 | 17.18 |
| status/success | 7.91 / 7.30 / 6.54 / 8.82 | 5.64 / 5.36 / 5.90 / 4.73 |
| status/warning | 8.09 / 7.47 / 6.69 / 9.02 | 5.67 / 5.39 / 5.93 / 4.75 |
| status/danger | 5.79 / 5.34 / 4.79 / 6.45 | 6.09 / 5.78 / 6.36 / 5.10 |
| status/info | 7.79 / 7.20 / 6.45 / 8.69 | 6.31 / 5.99 / 6.59 / 5.29 |
| border/strong (non-text) | 3.92 / 3.62 / 3.25 / 4.37 | 4.14 / 3.93 / 4.32 / 3.46 |
| border/focus (non-text) | 6.98 / 6.45 / 5.78 / 7.78 | 8.33 / 7.91 / 8.70 / 6.98 |
| border/accent (non-text) | 3.94 / 3.64 / 3.26 / 4.40 | 8.33 / 7.91 / 8.70 / 6.98 |

- Nothing is below 4.5:1 for text or 3:1 for non-text.
- `text/disabled` (2.71 / 2.64) is exempt and must never carry live information.
- `border/subtle` and `border/default` (1.54 / 1.43) are decorative only and documented as such.

## 4. Page geometry and bindings (final)

- **Geometry:** TOUCH 0 · EDGE 0 · CLIP 0 · GONE 0, across about 970 nodes and 499 text nodes.
- **Type:** smallest text 14px; no italic.
- **Bindings:** fills, strokes, gaps (all) and paddings (all) bound to variables. No unmapped spacing values.
- **Sections:** all 8 follow one structure: a rule, 40, a 302 label column, 24, then the 954 content column. Air is bottom-heavy (96 at the top, 160 at the bottom).

## 5. Token sweep (ZT Layout, all 6 modes)

- `grid/container` = viewport − 2 × margin in every mode (343 / 358 / 704 / 928 / 1280 / 1600).
- Margin, gutter, section, section-tight, block and all type sizes never decrease as the viewport grows.
- `space/section` > `section-tight` > `block` in every mode.
- Type rank display > h1 > h2 > h3 > title > lead ≥ body holds in every mode.
- Body ≥ 16 and Bodoni sizes ≥ 32 in every mode.
- ZT System spacing resolves to 4, 8, 12, 16, 24, 32, 40, 48 and 64.

## 6. Export verification

- **Counts:** `design-tokens.json` and `tokens.css` are generated from one script built on the Figma variable export. Totals match Figma: 101 primitives + 27 colour + 39 system + 17 layout + 10 motion primitives + 10 motion = **204 variables**. Also 13 text styles, 8 grid styles and 1 effect style.
- **CSS:** braces balanced. The CSS was not run through a validator.
- **Layout in CSS:** mobile values on `:root`, then `min-width` 768 / 1024 / 1280 / 1920. Mobile 375 and 390 share one block; only container width differs, and `--grid-container` handles that fluidly.

## 7. Not verified

- Text over real photography: there are no images yet.
- Real component states (focus, hover, selected, error) and keyboard behaviour: there are no components yet.
- The Foundations page rendered in the mobile modes: it is a fixed 1440 document. The responsive tokens were verified by values.
- Desirability is Alex's call (Gate 5). He approved on 23 Nov 2026.
