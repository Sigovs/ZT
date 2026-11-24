# ZT Automotive Collection — Homepage v2: creative and media plan

24 November 2026 · `prototype/thirty-four-home-v2/` · built on the approved "Thirty-Four Degrees" hero

## The idea

**The 34° line opens the page and closes it. Between those two cuts, ZT is shown as a house with rooms: people, craft, two addresses in Charlotte and a group behind them.**

Version 1 carried one geometry through every section, and every section was about a car. In v2 the diagonal is a device with three jobs only: it frames the film in the hero, it is where a marque room starts, and it turns the ground to paper before the enquiry. Everything else is built square, and each section has its own subject.

## Rhythm of the page

| # | Section | Register | Ground | Subject | Diagonal? | Film? |
|---|---|---|---|---|---|---|
| 1 | Hero | Cinematic | Dark | The Collection | Yes, the bar | Yes |
| 2 | Marques | Interactive | Dark | Five marques, their showrooms | Start of the expansion only | No |
| 3 | The house | Editorial | Paper | ZT Automotive, its people and history | No | No |
| 4 | In the collection | Functional | Dark | Cars for sale | One chamfered window | No |
| 5 | Ownership | Cinematic, vertical | Dark | Craft and service | No | Yes |
| 6 | Buy, sell, trade | Commercial | Paper | Three actions | No | No |
| 7 | Showrooms | Architectural | Dark | Two addresses, the group | No | Yes |
| 8 | Journal | Typographic | Dark | News, community, social | No | No |
| 9 | Enquire | Monumental | Paper | One action | Yes, the ground wipe | No |

Three films on the whole page. Only the hero's loads with the page.

## Media research

### Footage found and used

| File | What it is | Source | Length, size | Used in |
|---|---|---|---|---|
| `assets/video/hero.mp4` | Czinger 21C Spyder at dusk on a desert road, five shots | czinger.com, home page film (`/assets/home/spyder-hero-1080.mp4`) | 18.7 s, 1.8 MB, 1280×720 | Hero bar |
| `assets/video/craft.mp4` | A coachline painted by hand, three shots | Rolls-Royce newsroom, "The pursuit of perfection: craftsmanship at the Home of Rolls-Royce" (press b-roll PF0009969) | 19.0 s, 0.9 MB, 1280×720 | Ownership |
| `assets/video/showroom.mp4` | McLaren Charlotte showroom, reception and building, slowed to half speed | charlottemclaren.com, home page film | 18.3 s, 1.7 MB, 1280×720 | Showrooms, Kenley Lane door |

All three were cut and re-encoded (H.264, no audio track, fast-start). Nothing was generated, retouched or colour-graded. Each has a poster frame taken from the film itself.

### Footage found and not used

| Footage | Source | Why not |
|---|---|---|
| Rolls-Royce Spectre gold detail loop (5.7 s) | rollsroycemotorcarscharlotte.com | Too short to loop without the cut showing; kept as a candidate for a Rolls-Royce room |
| Czinger Charlotte film: concours, Monterey, pit lane (30 s) | czingerclt.com | Good material for an events story once ZT has events of its own to pair it with |
| Czinger history film (12 s) | czingerclt.com | Engineers and laptops; reads as a factory film, not the Collection |
| Rolls-Royce craft b-roll: wood, leather, paint, embroidery (four films, 5 to 7 minutes each) | Rolls-Royce newsroom | Held in reserve; the coachline was chosen because it is dark, slow and reads at any crop |
| Midwest Automotive Designs Sprinter film | luxsprintervanforsale.com | Off the page's subject |
| Local WORK folders | `C:\____WORK` | Other clients' films (Bentley, Ferrari Cauley, Chicago Motor Cars and others). None belong to ZT, so none were used |

Not found: any official Ferrari, McLaren or Koenigsegg film that can be downloaded from their public sites (McLaren and Ferrari stream through players; Koenigsegg links to Vimeo). ZT Automotive's own site has no film.

### Photography found and used

| Subject | Files | Source |
|---|---|---|
| ZT people | `people-service-team.jpg` | ZT Automotive Facebook, supplied in the mood board |
| ZT people | `people-handshake.jpg`, `people-team.jpg`, `people-cheque.jpg` | ztautogroup.com (About history, Foundation) |
| Architecture | `kenley-workshop.jpg` | A frame from McLaren Charlotte's film |
| Architecture | `tryon-facade.jpg` | ztautogroup.com, Locations page |
| Place | `charlotte-rooftop.jpg` | charlottemclaren.com, home page slide |
| Cars | everything else in `assets/img/` | Manufacturer photography already in the project (`assets/oem/SOURCES.md`) |
| Secondary brand marks | `assets/network/*.svg`, `midwest.webp` | ztautogroup.com, the wordmarks ZT uses in its own brand list |

### Permissions

ZT works with these marques as an authorised dealer, and three of the sources are ZT's own dealership websites. That makes use likely, not cleared. Before public launch:

- Rolls-Royce newsroom material is released for editorial use. A dealer homepage is commercial use and needs sign-off through the dealer channel.
- The Czinger film is from Czinger's own site; ask Czinger for the master and for permission.
- McLaren Charlotte's film and photographs belong to the dealership, which ZT now owns; confirm who shot them.
- ZT's photographs are small (750 px wide). They are set small on purpose. A shoot of the Charlotte showrooms and the people in them is the largest single improvement available to this page.

## Section by section

### 1 · Hero — cinematic introduction

- **Purpose.** Say what this is in one screen: the Collection, five marques, Charlotte.
- **Concept.** The approved bar becomes a window. Behind the same 34° cut, a film runs instead of a still.
- **Composition.** Unchanged from the baseline: the monumental word, the bar across it, the index of five marks lower left. The word still sits under the bar.
- **Media.** `hero.mp4`. It opens on the lit car against a pink sky, so the first frame reads, then falls to the blue dusk shots.
- **Second layer.** The same film is drawn into a 64×36 canvas and stretched across the whole hero behind the word at 34% opacity. It is no longer a picture, only a slow change of light. One video element feeds both layers.
- **Interaction.** Hovering a marque wipes its photograph into the bar along the bar's own axis, as before; the readout now names the real showroom and address instead of a placeholder price. Leaving the index returns the bar to the film. A "Pause film" control sits lower right.
- **Phone.** A still: the film's poster frame. No download, no control.
- **Reduced motion / no script.** The poster frame in a fixed bar.
- **Transition.** The bar slides out along its axis and the five columns rise, as approved.
- **Performance.** `preload="metadata"`; 1.8 MB; the film pauses when the hero leaves the screen, when the tab is hidden and when a marque room is open.

### 2 · Primary marques — columns that open into rooms

- **Purpose.** Give each marque its own place and connect it to a real showroom.
- **Concept.** A column is a door. Clicked, its photograph expands to the full screen (GSAP Flip, so the crop travels continuously from the narrow column to the wide frame) and the diagonal lets go: the room is a plain full-bleed photograph with an editorial block of text.
- **Content of a room.** The marque's mark; the showroom's name; its address; one sentence in the showroom's own words where one exists; the models that showroom lists; three actions: see the marque in the collection, open the showroom's site, call.
- **Personality.** Each room is its own photograph and its own composition: the text sits on whichever side the car is not. Rolls-Royce reads from the right; the others from the left.
- **Moving between rooms.** A row of five marks at the foot. The next photograph wipes in at 56°, the perpendicular of the bar, the one place inside a room where the angle returns.
- **Closing.** Escape or Close. The photograph is fitted back into its column (Flip.fit).
- **Film.** None. Five auto-playing films behind five columns would be a slideshow. The column photographs are strong enough.
- **Phone.** The five stacked 34° bands from v1; a tap opens the same room, composed bottom-up.
- **Accessibility.** The room is a dialog: the page behind is inert, focus moves to Close and returns to the column, Escape closes.
- **Ferrari.** No ZT source lists a Ferrari showroom. The room says so.

### 3 · The house — About ZT

- **Purpose.** The portal belongs to a group. Say who they are, with facts.
- **Concept.** The opposite of the hero: paper ground, a square twelve-column grid, a statement, two photographs of people, and numbers.
- **Composition.** A statement in ZT's own words set large across nine columns. Below it, a large photograph of a service team on the left and a narrow text column on the right with a small second photograph under it. Then five figures on one rule, a seven-step timeline on another, and four values in ZT's words.
- **Media.** `people-service-team.jpg`, `people-handshake.jpg`. No cars.
- **Motion.** Photographs open upward out of their frames, once. The figures roll up. The timeline's rule is drawn by the scroll and each year arrives as the line reaches it. Text does not move.
- **Phone.** One column; the large photograph goes full-bleed; the timeline becomes a ruled list.
- **Transition.** A straight edge from the dark monolith to paper. No diagonal.
- **Facts.** All from ztautogroup.com: founded 2014, Badar Family Office, the 2026 Charlotte acquisition, the timeline, the values, "18 dealerships and 20 brands" and five states, No. 98 in the Automotive News Top 100.

### 4 · In the collection — inventory

- **Purpose.** Find a car. Usability first.
- **Concept.** Kept from v1 because it works: a monumental index of model names, a marque filter and one chamfered photograph window.
- **Media.** Static manufacturer photography. No film, no decorative motion.
- **Added.** A row of links to today's real inventory at McLaren Charlotte, Rolls-Royce Motor Cars Charlotte and Koenigsegg Charlotte, since the listings on this page are examples.
- **Removed.** The separate model line-up (the diagonal filmstrip). It repeated the inventory. Each marque's models now live in its room.

### 5 · Ownership — care, after the keys

- **Purpose.** Service is a reason to buy here. Show care, then give four real routes to it.
- **Concept.** A tall film of hands. A portrait frame on the left opens sideways from a slit as the section arrives, then stays in place while the right column scrolls past it.
- **Composition.** Split: five columns of film, seven of text. Heading, four ruled service rows, then a wide photograph of the real service hall at Kenley Lane.
- **Media.** `craft.mp4` (coachline painting, Rolls-Royce); `kenley-workshop.jpg`.
- **Honesty.** The film shows the maker's craft at Goodwood, not ZT's workshop, and the caption says so. The workshop photograph is ZT's own.
- **Services.** McLaren Charlotte service centre and its number; Koenigsegg Charlotte factory-authorised service and parts; Rolls-Royce service appointments; McLaren Roadside Assistance. Each row opens the showroom's page.
- **Phone.** Film full-bleed and still until played; rows stack.
- **Performance.** The film has no source until it is 160 px from the viewport and plays only while on screen.

### 6 · Buy, sell, trade

- **Purpose.** The commercial section. Three verbs, each with its actions.
- **Concept.** Typographic and plain, on paper: Buy, Sell, Trade set at monumental size in three ruled columns, each followed by one line and the real links.
- **Media.** One photograph of a ZT team, set small with its caption. No cars.
- **Actions.** Finance applications, consignment and trade valuation at McLaren Charlotte and Rolls-Royce Motor Cars Charlotte; ZT's own "Sell my car". "Browse the collection" is the one filled button and turns Rosso on hover.
- **Motion.** The three verbs are set letter by letter, once.
- **Phone.** Three stacked blocks, each verb the width of the screen.

### 7 · Showrooms — two doors

- **Purpose.** Where the cars are, and how the Collection sits inside the group.
- **Concept.** The five marques live at two addresses, so the section is two doors. The open one takes most of the width and shows its showrooms; the other waits in monochrome. Hover, focus or tap swaps them.
- **Composition.** "Charlotte" at monumental size; two full-height panels edge to edge; a wide photograph of the Charlotte skyline; then the group's dealerships by state.
- **Media.** `showroom.mp4` behind 6010 Kenley Lane (interior, reception, building at dusk); `tryon-facade.jpg` behind 1316 South Tryon Street; `charlotte-rooftop.jpg`.
- **Typography.** The street number is set in the lightest weight, very large; the street name beneath it in the heaviest.
- **Information.** Showroom name, website and telephone for McLaren, Koenigsegg, Rolls-Royce and Czinger; Midwest Automotive Designs at Kenley Lane; directions.
- **Motion.** The pair of doors widens from an inset block to the full width as it enters. The skyline photograph drifts slightly.
- **Phone.** The doors stack and open downward.
- **Open point.** The South Tryon photograph is 833 px wide. It holds at this size only because it is darkened.

### 8 · Journal

- **Purpose.** Show that the group is active, and where to follow it.
- **Concept.** Type only. Four dated press items as a ruled list, the Foundation beside them, four social links below.
- **Media.** One photograph: a Ron Carter Cares donation.
- **Content.** The four items on ZT's own press page, with their dates. The Foundation's line and the Ron Carter Cares programme. Events: none are published, so the block says so and is marked as a placeholder.
- **Not done.** Lifestyle and event imagery. There is no confirmed ZT event to show, and manufacturer event footage would imply one.

### 9 · Enquire

- **Purpose.** One action.
- **Concept.** Kept from v1: the ground turns to paper along the 34° line and the word Enquire is set in a skewed frame. This is the diagonal's last appearance.
- **Changed.** The telephone numbers are now the showrooms' own, with the group line last.

### Mega menu

- **Primary.** Five marque columns across the top: photograph, mark, showroom name, "In the collection" and "Showroom site". Clicking a mark opens its room. The photograph is the only preview and is a still, so the menu opens instantly.
- **Sections.** A single column of page sections at the right, ending in Enquire.
- **Secondary.** Below a rule, in smaller type and lower contrast: "ZT Automotive · the group's dealerships". Twelve brand blocks, each headed by the brand's wordmark as ZT shows it, each listing its dealerships with city and state. Eighteen links, each to the dealership's own website, plus "Search all group inventory".
- **Source.** ztautogroup.com, Locations and Locations by make, read 24 November 2026.
- **Fit.** 853 px tall at 1440×900. On phones the menu scrolls and the brand list becomes rows.

### Footer

Four ruled columns: marques, the Collection's sections, ZT Automotive, follow. Functional, dark, no imagery.

## Rules the films follow

- Muted, looping, inline. No audio track in the files.
- One control per film, labelled "Pause film" or "Play film", reachable by keyboard.
- Reduced motion and phones: the poster frame, until the visitor presses play.
- A film plays only while it is on screen and the tab is visible. Never two at once in practice: the three are far apart.
- Without script the page shows the poster frames and loses nothing else.

## What would improve it most

1. A photo and film shoot at both Charlotte addresses: architecture, interiors, people.
2. Cleared masters of the three films, or ZT's own.
3. A decision on Ferrari.
4. Real inventory data in place of the eight example listings.
