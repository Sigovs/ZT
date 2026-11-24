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
Interactive prototype "Thirty-Four Degrees" (hero + second screen, GSAP + ScrollTrigger + Lenis): `prototype/thirty-four/index.html`. Earlier Figma studies are preserved.

v2 (experimental, `prototype/thirty-four-v2/`): baseline hero + monolith, then 3 · In the collection (monumental listing index + chamfered window), 4 · Driven by excellence (monogram bars), 5 · Enquire + footer. Baseline `prototype/thirty-four/` is frozen. Live index: https://sigovs.github.io/ZT/

Homepage (`prototype/thirty-four-home/`, 24 Nov 2026): the full homepage built on the frozen baseline — hero and monolith unchanged, then inventory discovery (filter + chamfered window), the model line-up (a filmstrip travelling along the 34° line), ownership (the monogram's three bars: Service, Finance, Sell or trade), the network and enquiry on an ivory ground, mega menu and footer. Responsive: phones and portrait tablets (≤ 900px) have their own composition. Live: https://sigovs.github.io/ZT/prototype/thirty-four-home/
- `base.css` is the baseline stylesheet, byte-identical to `prototype/thirty-four/styles.css`; `main.js` is the baseline script plus the phone branch; everything new is in `home.css` and `home.js`.
- Facts on the page come from ztautogroup.com (read 23 Nov 2026): the three Charlotte showrooms and their addresses, the group dealership list, the group telephone line, and the service / finance / sell-or-trade offer. Listings, prices, counts, hours and email are placeholders or "to be confirmed".
- Open: Ferrari and Czinger have no confirmed location; ZT's own pages disagree on the dealership count (16 / 18 / 20 listed), so the page states no count.

Homepage v2 (`prototype/thirty-four-home-v2/`, 24 Nov 2026): a separate revision; v1 is untouched. The page is now a group portal, not a model catalogue. Hero and monolith as approved, with film in the bar; then The house (About ZT, on paper), In the collection, Ownership (a tall craft film and four real service routes), Buy / sell / trade, Showrooms (two Charlotte addresses as two doors, then the group by state), Journal (press, Foundation, social) and Enquire. Live: https://sigovs.github.io/ZT/prototype/thirty-four-home-v2/
- Read `prototype/thirty-four-home-v2/CREATIVE_MEDIA_PLAN.md` first: the idea, every section's purpose, every film and photograph with its source, and the permissions still to clear.
- Files: `base.css` (baseline, unchanged), `home.css` (v1's stylesheet minus the line-up and the three bars), `v2.css` (everything new), `main.js` (hero; the default plate is a film), `home.js` (menu, films, marque rooms with GSAP Flip, doors, scroll motion).
- The 34° line is used in three places only: the hero bar, the start of a marque room, the paper wipe before Enquire.
- Mega menu: five marques first; below a rule, all group dealerships by brand, each linking to its own site (source: ztautogroup.com Locations by make, 24 Nov 2026).
- Facts added from ZT's own sites: Czinger Charlotte is at 1316 South Tryon St (czingerclt.com); showroom telephone numbers; service, consignment, trade and finance pages; press items and dates; the Foundation. Ferrari still has no ZT source.
- Films are official footage re-cut for the prototype (Czinger, Rolls-Royce newsroom, McLaren Charlotte). None is cleared for public use.

Homepage v3 (`prototype/thirty-four-home-v3/`, 24 Nov 2026): v2 plus six refinements; v2 is untouched. Live: https://sigovs.github.io/ZT/prototype/thirty-four-home-v3/
- Read the top of `prototype/thirty-four-home-v3/CREATIVE_MEDIA_PLAN.md` for what changed and why.
- Hero: the marque list is gone. A broken line of five strokes along the bar's edge chooses the film; only the chosen marque's mark is shown. `?hero=strokes|type|none` shows the alternatives that were tried.
- Marques: columns open in place (no overlay, no Flip). Phones: the band grows taller.
- The House: one architectural photograph, a two-line headline, the figures as a sentence, history as a seven-year line.
- New: the three-bar interlude (Driven / by / Excellence) between Buy, sell, trade and Showrooms; "Beyond the showroom" social filmstrip before Enquire (curated stills, not a live feed).
- Files: `v3.css` holds everything v3 adds; `main.js` and `home.js` are v3's own copies.
- Still open: no official film for Koenigsegg or Ferrari; no verified Instagram account for Koenigsegg Charlotte, Czinger Charlotte or Ferrari; the designer's overall verdict is positive but the homepage is not approved.

Homepage v4 (`prototype/thirty-four-home-v4/`, 24 Nov 2026): v3 with section 4 replaced by Inventory; v3 is untouched. Live: https://sigovs.github.io/ZT/prototype/thirty-four-home-v4/
- Read the top of `prototype/thirty-four-home-v4/CREATIVE_MEDIA_PLAN.md`.
- Real stock from the Charlotte showrooms, snapshot of 24 Nov 2026. `assets/stock/` holds the profiles.
- Files: `v4.css` holds everything v4 adds; `home.js` is v4's own copy (the inventory block is new).
- Figma, page "09 — Homepage v3 · Layers": the working desktop frame "index adjustments" (136:464) has the new section in place of 04; "Homepage v4 · Phone 390" (142:1066) is the phone. The v3 frames are kept.
- Open: Alex's verdict on the section; clean masters of the stock photographs.
