# Maby Connect

The digital headquarters of **Matthew Adeleye** — known online as **Maby Connect** —
a founder building companies, communities and products that create global impact
across crypto, technology, real estate and faith.

A dark, minimal, typography-led brand experience built to feel premium, timeless
and world-class.

---

## Tech stack

- **Next.js 16** (App Router, React Server Components, Server Actions)
- **TypeScript**
- **Tailwind CSS v4** (design tokens via `@theme`)
- **Framer Motion** — reveals, parallax, page transitions, magnetic buttons
- **Lenis** — smooth momentum scrolling
- **lucide-react** — icons
- Dynamic **Open Graph** images & favicon via `next/og`
- Fully static / SSG, SEO-ready (sitemap, robots, JSON-LD, manifest)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Project structure

```
src/
  app/                     # App Router routes
    page.tsx               # Home
    about/                 # About + interactive timeline
    companies/             # Company index + [slug] detail pages
    projects/              # Projects
    communities/           # Communities + join channels
    foundation/            # Jenmec Foundation
    media/                 # Talks, podcasts, features
    articles/              # Blog index + [slug] reading view
    contact/               # Contact form (Server Action)
    layout.tsx             # Root layout, metadata, providers
    template.tsx           # Per-navigation page transition
    sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx, icon.tsx
  components/
    layout/                # Navbar, Footer
    providers/             # SmoothScroll (Lenis)
    sections/              # Home + About composed sections
    ui/                    # Reusable primitives (Reveal, AnimatedText,
                           #   MagneticButton, Marquee, Cursor, Portrait, …)
  lib/
    site.ts                # Site config, nav, socials
    data.ts                # All content (companies, articles, communities…)
    utils.ts               # cn()
public/
  portrait-placeholder.svg # Editorial placeholder shown until a real photo is added
```

## Adding the real portrait

Every portrait on the site is rendered through `src/components/ui/Portrait.tsx`,
which shows an elegant designed placeholder until a real photo is present.

**To use the real portrait, simply drop the image at:**

```
public/portrait.jpg
```

The component probes for it on load and swaps it in automatically — no code
change required. A tall (3:4 / 4:5), high-contrast, minimally-edited photo works
best. To use a different filename, pass `src` to `<Portrait src="/your-file.jpg" />`.

## Wiring the contact form

The contact form uses a **Server Action** at `src/app/contact/actions.ts`.
It currently validates input and logs the enquiry on the server. To make it
live, integrate an email/CRM provider (e.g. Resend, Postmark, or a webhook) at
the `TODO` marker inside `submitContact`.

## Editing content

Almost all copy lives in `src/lib/data.ts` and `src/lib/site.ts` — companies,
projects, communities, articles, media, the timeline, social links and contact
details. Update those files to change what the site says; the pages render from
them.

## Design system

Colours and type are defined as tokens in `src/app/globals.css`:

- Background `#070707` · Surface `#111111` · Accent `white` · Gold `#D6B35A`
- Fluid display type, generous spacing, film-grain overlay, glass morphism
- Respects `prefers-reduced-motion` throughout
