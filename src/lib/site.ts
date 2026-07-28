/**
 * Canonical site URL. Resolved at build time so metadata, Open Graph,
 * sitemap and robots always point at the real deployment:
 *   1. NEXT_PUBLIC_SITE_URL — set this to your custom domain (recommended)
 *   2. VERCEL_PROJECT_PRODUCTION_URL — auto-provided by Vercel in production
 *   3. fallback to the intended production domain
 */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://mabyconnect.com")
).replace(/\/$/, "");

export const site = {
  name: "Maby Connect",
  person: "Matthew Adeleye",
  role: "Founder · Builder · Believer",
  url: siteUrl,
  email: "hello@mabyconnect.com",
  phone: "0913 621 4038",
  phoneHref: "tel:+2349136214038",
  tagline: "Building companies. Building communities. Building people.",
  description:
    "Matthew Adeleye — known as Maby Connect — is a founder building companies, communities and products that create global impact across crypto, technology, real estate and faith.",
  location: "Global · Lagos, Nigeria",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Companies", href: "/companies" },
  { label: "Projects", href: "/projects" },
  { label: "Communities", href: "/communities" },
  { label: "Foundation", href: "/foundation" },
  { label: "Media", href: "/media" },
  { label: "Articles", href: "/articles" },
  { label: "Contact", href: "/contact" },
] as const;

export const socials = [
  { label: "X / Twitter", handle: "@OxMaby", href: "https://x.com/OxMaby" },
  { label: "Instagram", handle: "@mabyconnect247", href: "https://www.instagram.com/mabyconnect247" },
  { label: "TikTok", handle: "@mabyconnect01", href: "https://www.tiktok.com/@mabyconnect01" },
  { label: "Facebook", handle: "Maby Connect", href: "https://www.facebook.com/share/1gJxYuUTNP/" },
  { label: "LinkedIn", handle: "Maby Connect", href: "https://www.linkedin.com/in/maby-connect-aa074a276" },
  { label: "Telegram", handle: "@Mabyconnect2000", href: "https://t.me/Mabyconnect2000" },
] as const;
