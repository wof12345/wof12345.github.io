# Space refactor plan

Branch: `space-refactor` (off `prod`).

The home page becomes one fixed 3D scene. The page itself never scrolls. Wheel,
touch and keyboard input move the camera between fixed points in space
("stations"). Each station shows one overlay of content, and the earth and moon
fall further into the background at each one.

The identity changes from "Software Engineer" to **Builder**.

---

## 1. Entry sequence

| t (ms)       | What happens                                                                            |
| ------------ | --------------------------------------------------------------------------------------- |
| 0            | Blank black screen. Canvas mounted, textures loading, nothing visible.                  |
| 500          | Earth fades in (~0.7 s). Surface rotates, clouds drift on a separate layer.             |
| 1500         | Moon fades in (~0.7 s), already orbiting.                                               |
| 2900         | Both **recede**: camera eases back (~2 s), planets slide right.                         |
| 2900 → ~9s   | Stars pop in one by one over ~6 s, then twinkle.                                        |
| 2900 → ~6.5s | Hero reveals one item every 320 ms: photo, name, "Builder", tagline, each social, hint. |

If textures are still loading at 500 ms, the timeline waits for them, so the
earth never shows untextured. With `prefers-reduced-motion`, the sequence goes
straight to the end state.

## 2. Navigation model: stations, not scroll

`html`/`body` get `overflow: hidden` on `/`. Input is turned into a station index:

- **Wheel:** deltas are added up past a threshold, then one step is taken.
- **Touch:** a vertical swipe over 50 px takes one step.
- **Keys:** ↓ / PageDown / Space go forward, ↑ / PageUp go back, Home / End jump.
- **Lock:** after each move, input is ignored for 1.5 s (content swap plus most
  of the camera ease). The first visit to a station also locks until its
  staggered reveal finishes. Wheel deltas are dropped while locked, so trackpad
  inertia can't queue a step.
- **Direction:** stations already passed sit above and stations ahead sit
  below. Scrolling down, content leaves upward and the next station rises in.
  Scrolling up, both move down.
- **First-visit reveal:** `[data-reveal]` children with `--i` animate in one
  after another, only the first time.
- **Dot nav:** on each move a short line travels from the old dot to the new
  one, then a ring draws around the target, starting from where the line
  arrived. The label fades in last.
- **Inner scroll exception:** if the event is inside a `[data-scrollable]`
  element that can still scroll that way, the element scrolls and the station
  stays put.

| #   | Station    | Camera z | Planets                    | Overlay                                         |
| --- | ---------- | -------- | -------------------------- | ----------------------------------------------- |
| 0   | Home       | 11       | right of centre, full size | Photo, name, "Builder", one-liner, socials      |
| 1   | Builder    | 17       | up-right, smaller          | What I build: Agents · System design · Platform |
| 2   | Experience | 23       | further up-right           | Company timeline → `/company/[id]`              |
| 3   | Projects   | 30       | further back, top-right    | Project cards from `projects.json`              |
| 4   | About      | 40       | tiny, far away             | Short bio, quick facts, contact links           |

Company pages (`/company/[id]`) use the same look without three.js: a 2D
twinkling starfield, the company drawn as a lit sphere in its colour with an
orbiting moon, highlights, related projects, and links to the previous and
next company.

Camera and planet targets live in one `stations.js` table, so adding a station
means adding a row of data and an overlay component.

## 3. Architecture

```
src/lib/space/
  engine.js          three.js scene: renderer, earth, moon, stars, damped tweening
  stations.js        station table (id, label, camera + planet targets)
  timeline.js        intro timings (single source of the ms values above)
  navigation.js      wheel / touch / key → station index, with lock + threshold
  SpaceCanvas.svelte mounts engine, forwards `phase` + `station`
  StationDots.svelte right-edge dot navigation
src/lib/layouts/space/
  HeroStation.svelte
  BuilderStation.svelte
  ProjectsStation.svelte
  AboutStation.svelte
src/lib/data/builder.js  skills from work experience (agents, system design)
src/routes/+page.svelte  orchestrates phase + station, renders overlays
static/textures/         earth (albedo, normal, specular, clouds), moon
```

- **Engine** is plain JS with no Svelte, so it can be tested and reused. It
  exposes `setPhase(phase)`, `setStation(i)`, `resize()` and `dispose()`. Every
  animated value has a `current` and a `target`, and each frame moves current
  toward target with exponential damping. There is no tween library, and changes
  that interrupt each other blend smoothly.
- **Earth:** a Phong sphere with albedo, normal and specular maps. A cloud
  sphere slightly larger than the earth rotates faster than the surface. A
  Fresnel atmosphere shell, drawn on its back side with additive blending,
  gives the glow.
- **Moon:** a Standard material with the moon map, on a tilted orbit around the earth.
- **Stars:** a single `Points` cloud of about 4k stars, with a shader that has a
  per-star `appear` delay and twinkle phase. They fade in from a `uStarsStart`
  uniform, so the pop-in costs nothing on the CPU.
- **Overlays** are plain DOM above the canvas. Each station fades and slides
  based on whether it is active, so text stays crisp, selectable and accessible.

## 4. Content: "Builder"

Taken from the InnovationWithin work history (`innovationwithin-cv.json`):

- **Agents & AI pipelines:** event-driven AI correction detection in Lambda, an
  opt-in auto-correction and analysis flow, a hardened AI insight-generation ECS
  worker, a versioned prompt library, OpenAI / Portkey.
- **System design:** monolith split into domain modules, a standalone webhook
  service (SQS vs HTTP handoff), DynamoDB → relational migration, idempotent and
  retry-safe workers.
- **Performance & platform:** ~530 ms cut per correction click through per-layer
  profiling, the Node 18 → 24 rollout across Lambda and ECS, and CloudWatch
  instrumentation.

## 5. Phases

1. **Template (this branch, now):** engine, intro timeline, four stations, dot
   nav, placeholder-quality overlays wired to the real data.
2. **Content pass:** final copy, one station per featured project (or a
   horizontal rail inside Projects), CV link, contact.
3. **Polish:** loading progress, mobile layout tuning, sun lens flare, earth
   night-lights shader, sound toggle (optional).
4. **Cleanup:** remove the old layouts and components (`Home`, `Projects`,
   `About`, `Parallax`, `Building/*`, `Planet`, `Star`, the animated entity set)
   once nothing imports them. Update SEO `jobTitle` to "Builder".
5. **Perf:** cap DPR at 2, pause rendering when the tab is hidden, use smaller
   textures on mobile, and lazy-load three.js so the first paint stays empty and
   fast.

## 6. Risks / open questions

- **Accessibility:** with no page scroll, keyboard navigation and the dot nav
  are required, and content must stay reachable when WebGL is missing (fallback:
  overlays stacked in plain scroll).
- **Mobile Safari:** overscroll and pull-to-refresh need `overscroll-behavior: none`
  and `touch-action: none` on the stage.
- **Blog, company and other routes:** keep the current look for now, or move
  them to the space background later?
