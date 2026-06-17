---
title: Building this site
date: 2024-08-20
excerpt: The stack and design choices behind this portfolio — Svelte 5 runes, Tailwind v4, and a static deploy to GitHub Pages.
tags:
  - svelte
  - tailwind
  - portfolio
---

The site you're reading this on is a single-page portfolio that scrolls top-to-bottom. Here's a quick tour of how it's built.

## Stack

- **SvelteKit** with `adapter-static` for the build, deployed to GitHub Pages
- **Svelte 5** runes (`$state`, `$derived`, `$effect`, `$props`) throughout
- **Tailwind CSS v4** for styling, with a custom palette per section
- **mdsvex** for this blog you're reading right now

## Layout

The portfolio has three scroll sections:

1. A **hero** with my photo and a staggered text intro
2. A **timeline of projects**, alternating left/right as you scroll
3. An **about** section with bio, skills, and experience

Each project card slides in via `IntersectionObserver` when it enters the viewport — cheap to wire up in Svelte 5, and reads better than a plain fade.

## Adding a post

Drop a `.md` file in `src/posts/` with frontmatter:

```yaml
---
title: Your post title
date: 2024-09-01
excerpt: A one-line summary for the index page.
tags:
  - tag-one
---

Markdown body goes here.
```

The blog index picks it up automatically and a `/blog/your-post` route is generated at build time.
