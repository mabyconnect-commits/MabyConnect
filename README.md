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

## Maby Agency

The build arm of Maby Connect lives at `/agency`:

| Route | What it is |
| --- | --- |
| `/agency` | Landing page — capabilities, stack, process, engagements, proof, FAQ |
| `/agency/capabilities/[slug]` | Deep spec per discipline (8 of them) |
| `/agency/start` | Project configurator — a survey that produces a scope, timeline and budget band |
| `/agency/book` | Appointment booking with a working calendar |
| `/agency/portal` | Client portal — milestones, deliverables, invoices, activity |

Content lives in `src/lib/agency.ts`; portal workspaces in `src/lib/portal.ts`.

## Email delivery

The contact form, project briefs and bookings all send through
`src/lib/email.ts`, which posts to Resend's REST API (no SDK to install).
Each submission emails the agency inbox — with `reply-to` set to the enquirer,
so hitting reply just works — and sends a confirmation to the person who
submitted.

Set these to switch it on:

```
RESEND_API_KEY=…
AGENCY_FROM_EMAIL="Maby Agency <build@mabyconnect.com>"   # verified sender
AGENCY_NOTIFY_EMAIL=build@mabyconnect.com                 # where enquiries land
```

Without them the site still accepts submissions — it logs them server-side
instead of emailing, so nothing breaks in development or preview deploys.
Delivery is best-effort by design: a provider outage can never reject an
enquiry the user already completed.

## Client portal access

Access codes are verified **on the server** and exchanged for an HMAC-signed,
`httpOnly` session cookie (7 days). No code or workspace data reaches the
browser until sign-in succeeds, so a wrong code reveals nothing.

```
PORTAL_SESSION_SECRET=…            # openssl rand -base64 32
PORTAL_CLIENTS='[{"code":"NW-4821","workspace":"northwind","label":"Northwind Labs"}]'
PORTAL_DISABLE_DEMO=1              # optional — hides the public demo login
```

`workspace` must match a key in the `workspaces` registry in
`src/lib/portal.ts`. A public demo login (`MABY-DEMO`) is enabled by default so
prospects can tour the portal; it opens a clearly-labelled sample workspace.

When the client list outgrows an environment variable, swap `clients()` and
`verifyCode()` in `src/lib/portal-auth.ts` for database lookups — the session
handling and every component stay as they are.

## Deploying to Vercel

The project is a standard Next.js app and deploys with zero configuration:

1. Push this branch to GitHub and **Import** the repo in Vercel (it auto-detects
   Next.js — no build settings needed).
2. Optional but recommended: set `NEXT_PUBLIC_SITE_URL` to your final domain so
   canonical/Open Graph/sitemap URLs are correct. In production Vercel otherwise
   derives it from `VERCEL_PROJECT_PRODUCTION_URL` automatically.
3. Deploy. That's it — no database is required.
4. To turn on email and the client portal, add the variables from the two
   sections above under **Settings → Environment Variables**.

See `.env.example` for every variable, all of them optional.

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
