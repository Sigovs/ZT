# ZT Automotive Collection — where things stand (23 Nov 2026)

Figma file: https://www.figma.com/design/NkR9bvaMl2D0hUMfB6mOLv/ZT-AUTO-GROUP

## Pages
| Page | What it is | Status |
|---|---|---|
| Foundations · v1.1 (frame 8:3) | Tokens, styles, grids, motion. Dark canvas #191D21. | Approved, frozen |
| 02 — Homepage Exploration | Concepts A/B (AI imagery, Bodoni) | Rejected |
| 03 — Homepage Reset | C1–C3, real OEM photos, Inter (v1.2 type proposal) | Superseded |
| 04 — Creative Recombination | R1–R3 | Superseded |
| 05 — Creative Pattern Library | 11 pattern cards | Reference |
| 06 — Final Creative Exploration | F1 After Dark, F2 Catalogue, F3 Marque Worlds. **Alex's official OEM logos sit to the right of F3 (nodes 86:1185–86:1203).** | Judged "AI-assembled" |
| 07 — Art Direction Studies | Studies 01–06 + "Brand sources" board (logo clones 98:79 / 98:82 / 98:91 / 98:92 / 98:97, ZT marks) | 01, 04 and 06 picked |
| 08 — Art Direction Studies II | Studies 07 Ascent, 08 Colonnade, 09 Raking Light, 10 Five Bars (two viewports each, 1920) | **Awaiting Alex's feedback** |

## Direction so far
- **Primary directions:**
  - 01 "Thirty-Four Degrees": the ZT monogram's parallel bars at 34° become the photo-masking device.
  - 04 "Monolith": five marque columns, monochrome, with the focused marque in colour.
  - 06 "Anamorphic" is used selectively.
- **ZT identity:**
  - Shield-Z monogram + "ZT AUTOMOTIVE / DRIVEN BY EXCELLENCE" (MOOD BOARD/logo/logo.jpeg).
  - Knockouts are in `assets/brand/`; read `assets/brand/SOURCES.md`.
  - An official vector is still needed.
- **Logos:** never search for, redraw or substitute the five OEM logos. Reuse Alex's canvas copies.
- **Photography:** `assets/oem/` holds manufacturer photography for internal exploration only (see `assets/oem/SOURCES.md`; Rolls-Royce is editorial-only).
- **Placeholders and copy:** prices, years, mileage and counts are placeholders, and all copy is a draft. Never invent services, locations or stock.
- **Taste system:** Alex's global Design DNA (`design_dna/TASTE.md`) applies. Lenis goes on every web build.

## Figma scripting gotchas
- Lock the constraints of cloned logo groups to MIN before resizing any parent frame, or the logos stretch.
- The McLaren logo is a single VECTOR with no children.
- Ferrari's horse path is white in the source file.
- Put a light section's content in a child frame with its own explicit variable mode.

## Next
Alex chooses among studies 07–10. Then a full homepage is built in the chosen direction. HTML only after approval.
