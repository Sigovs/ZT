# ZT Automotive Collection — where things stand (23 Nov 2026)

Figma file: https://www.figma.com/design/NkR9bvaMl2D0hUMfB6mOLv/ZT-AUTO-GROUP

## Start here (24 Nov 2026, end of day, Mac)

- `git pull --ff-only`, then read `CLAUDE.md` (feedback log) and this file. Newest homepage: `prototype/thirty-four-home-v5/`. Work there; v4 and older stay as they are.
- Live: https://sigovs.github.io/ZT/ (all versions), https://sigovs.github.io/ZT/prototype/thirty-four-home-v5/. Local: `python3 -m http.server 4173` in the project root.
- When css or js changes, raise the `?v=` number in `index.html`, and for the map also the one in `home.js`.
- Map files in v5: `map.js`, `map.css`, `assets/map/`. How the data was made: `tools/map/`.
- 25 Nov 2026, v5: a landing that is whole from the first paint, the menu on a click on "Brands" only, the map on the full screen with its navigation in a card. Figma page 10 shows v5 before these three changes.
- Next, if Alex wants it: small screens (at 1024 px and on phones some city names lie on land), Safari, Firefox and a real phone, a phone copy of v5 in Figma.
- Open questions for Alex: his verdict on v5; "Pause film" in Ownership and Showrooms, keep or remove; one red (#FF2D55) or the Rosso of the Foundations; a design-hook pass over v4 (tight type, layout transitions) or not.
- Jarvis: the connector is on both computers. Report #3 is the v4 map; commits and pushes are recorded by its hooks. A correction to #3: pin height in the v4 map is not only the number of dealerships, two pins are taller to part their labels.
- Alex decides every push and every Figma write.

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

Homepage v4, later the same day (24 Nov 2026), edited in place in `prototype/thirty-four-home-v4/`:
- Hero: a two-line slogan, a sheet of glass round the bar, a better Czinger film; the pagination, film credit and pause control are gone from view.
- Inventory on #CACACA, the House and the other light grounds on #DFDFDF (tokens `--paper-2`, `--paper` in `v4.css`); car cards with a "View Details" plate and save / share / text.
- "Since 2014. 18 dealerships, 20 brands, 5 states." stands on one left edge and slides in with the scroll. Alex keeps the figures; ZT will confirm them.
- Showrooms: the interactive 3D map of the five states (`map.js`, `map.css`, `assets/map/`). Alex likes its visual direction: do not change it in place. Known: phone labels overlap, and Escape does not work after a click on the model.
- The fullscreen menu was rejected and reverted; its pictures are in `review/menu-scenes-2026-11-24/`.

Map experiment "Arrive in Charlotte" (`prototype/thirty-four-home-v4-charlotte/`, 24 Nov 2026): a full copy of v4 with a new map. NOT approved. Compare: `prototype/thirty-four-home-v4-charlotte/compare.html`.
- Scroll carries the camera along the 34th parallel, through cloud, to the two Charlotte addresses. A click on a state zooms in, a click outside or Escape zooms out; the list opens in place.
- Relief from real elevation, clouds that part in a zoom, a border that takes fire and cools, city names on a straight line with one bend. No dealership counts, no arcs, no pins, no logos in the panel (Alex). Ferrari has no confirmed showroom, so it is not on the map.
- Sources are in the header of its `map.js`. Not tested: Safari, Firefox, a real phone, a slow laptop.
- Figma: page "10 — Homepage v5 · Layers" (152:5) is the whole of v5 at 1920 as layers (152:43), with three map states (Florida 152:840, North Carolina 152:961, Charlotte 152:1078). "ZT Home v3" has new variables `paper` #DFDFDF, `paper-2` #CACACA, `signal` #FF2D55. Inter stands in for Inter Tight; the map's 3D surface is a picture layer, everything on it is editable. Figma does not read WebP: the cars use the PNGs uploaded for v4. On page 09 only "index adjustments" (136:464) was changed, at Alex's word: the grounds of 06 and 11 and the two light bars of 07 use `paper`. Phone not done.

Homepage v5 (`prototype/thirty-four-home-v5/`, 24 Nov 2026): v4 with the "Arrive in Charlotte" map, made from the experiment at Alex's request. v4 and the experiment folder are untouched. Work on the new map continues in v5. Compare with v4: `prototype/thirty-four-home-v5/compare.html`. Not approved.
