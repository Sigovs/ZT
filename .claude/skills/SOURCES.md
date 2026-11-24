# Project-local Creative Skills — sources and overrides

Four third-party skills installed in this project at `.claude/skills/`. Restored on 23 Nov 2026 from Alex's original Creative Skills installation report (Mac session), at the exact upstream commits that report names.

## Upstream

Repository: https://github.com/MengTo/Skills — author Meng To.

| Skill (folder) | Upstream path | Commit | `SKILL.md` blob |
|---|---|---|---|
| Image First Grid Layout (`image-first-grid-layout`) | `agent-skills/web-design/image-first-grid-layout` | `8d789c622d4e7c7a711e2607ce674f1b5547aaf2` (7 Jul 2026) | `0db1d1e9a06c9967cebfafbc3885d7e71123300f` |
| Agency Grid Layout Minimal (`agency-grid-layout-minimal`) | `agent-skills/web-design/agency-grid-layout-minimal` | `8d789c622d4e7c7a711e2607ce674f1b5547aaf2` (7 Jul 2026) | `2731b7a5aec6177e4162f2ab1e54c0793434c96b` |
| Split Layout Technical (`split-layout-technical`) | `agent-skills/web-design/split-layout-technical` | `8d789c622d4e7c7a711e2607ce674f1b5547aaf2` (7 Jul 2026) | `406722079067f9f8d45069f727bdf28f9e582f71` |
| Build Awwwards Quality Sites (`build-awwwards-quality-sites`) | `agent-skills/web-design/build-awwwards-quality-sites` | `61239697f14661e2bbc962f0eadc3df5d5488583` (25 Jul 2026) | `cdf06063574a31b9f7b1b39673a5eff866d931dc` |

Source links:

- https://github.com/MengTo/Skills/tree/8d789c622d4e7c7a711e2607ce674f1b5547aaf2/agent-skills/web-design/image-first-grid-layout
- https://github.com/MengTo/Skills/tree/8d789c622d4e7c7a711e2607ce674f1b5547aaf2/agent-skills/web-design/agency-grid-layout-minimal
- https://github.com/MengTo/Skills/tree/8d789c622d4e7c7a711e2607ce674f1b5547aaf2/agent-skills/web-design/split-layout-technical
- https://github.com/MengTo/Skills/tree/61239697f14661e2bbc962f0eadc3df5d5488583/agent-skills/web-design/build-awwwards-quality-sites

## What was installed

- Each skill is one file, `SKILL.md`. At the pinned commits the three layout skills consist of that file only.
- **Left out:** `agents/openai.yaml` of Build Awwwards Quality Sites (an interface file for another agent host). No scripts, demo folders or dependencies exist at the pinned commits, and none were installed.
- **Upstream text is unmodified.** In each `SKILL.md`, everything above the line `ZT PROJECT OVERRIDE — START` is byte-identical to the upstream blob listed above. To check one: cut the file at that marker (and the blank line before it) and run `git hash-object` on the result.
- All files were read in full before installation. They are Markdown instructions only.

## Licence

MIT, © 2026 Meng To. The full text is in `LICENSE-MengTo-Skills.txt`, copied from the upstream `LICENSE` at commit `6123969`. MIT permits copying, modification and redistribution provided the notice is kept, which that file does.

One detail on the three layout skills: at commit `8d789c6` the upstream README still said "License: TBD". The MIT licence was added the same day in commit `963fb12ccb88567c09a665c8c4dc8ee22655c098`, and the three `SKILL.md` files are byte-identical at `8d789c6`, at `963fb12` and at the upstream head on 23 Nov 2026 (same blob IDs). The content installed here is therefore content upstream publishes under MIT.

## ZT overrides — reconstructed

**These override blocks are reconstructed.** The override text written on the Mac was not recovered; neither it nor the skills were ever committed to this repository. Each block restates the requirements listed in the original installation report, as Alex supplied them on 23 Nov 2026:

1. Global `TASTE.md` and approved project decisions take precedence.
2. Treat each skill as a creative technique, not a rigid template.
3. Preserve creative freedom and avoid generic AI-generated layouts.
4. Authentic OEM photography only. No paid image generation without approval.
5. Inter and the current prototype's Inter Tight typography are permitted. Replace monospace labels with Inter where appropriate.
6. Lucide icons instead of Solar.
7. Lenis scrolling and GSAP motion.
8. Rosso is available for primary actions, but not mandatory in every composition.
9. Build Awwwards Quality Sites only: prioritise its visual thesis, strongest first-screen principle and reject list.

Each `SKILL.md` carries points 1–8 (and 9 where it applies) in a block appended after the upstream text. Under each block, a short list headed "Where this applies in the text above" names the upstream lines the override changes. Those reading notes were written at restoration and are not from the original report.

## Related, not installed here

- **Frontend Design (Anthropic)** was active as a plugin on the Mac, not as a project-local skill. It is a per-machine plugin install and is not stored in this repository.
- **High End Visual Design (Leon Lin)** was deliberately not installed: its mandatory visual styling conflicted with ZT. Do not add it.

## Machine setup (Windows and Mac)

Nothing in this folder depends on a machine path. Three things live outside the repository and are set up per machine:

- **Global Design DNA** (`TASTE.md`, its `skills/` and `.claude/rules/design-dna.md`). It lives in Alex's `design_dna` folder, whose location differs per machine; the global session-start hook prints the resolved path at the top of each session. It outranks everything here and is never edited from this project.
- **Plugins:** Frontend Design, the Figma plugin and MCP connection, and the GSAP skills.
- **Local-only files:** `.claude/settings.local.json` (ignored by Git) and the `jarvis/` folder (kept out of Git until Alex approves committing it).

GSAP, ScrollTrigger and Lenis are loaded by the prototypes from CDNs; no local install is needed.
