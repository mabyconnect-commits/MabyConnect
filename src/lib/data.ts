/* ============================================================
   Central content model for Maby Connect
   ============================================================ */

export type Company = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  year: string;
  status: "Live" | "Building" | "Scaling" | "Coming Soon";
  summary: string;
  description: string[];
  highlights: string[];
  accent?: boolean;
  url?: string;
  role?: string;
};

export const companies: Company[] = [
  {
    slug: "channels-realty",
    name: "Channels Realty Innovation Ltd",
    tagline: "Real estate every class can afford.",
    category: "Real Estate",
    year: "2022",
    status: "Scaling",
    role: "Co-Founder",
    summary:
      "The channel that bridges real estate businesses to the right people — making property accessible from as little as ₦20,000.",
    description: [
      "Channels Realty Innovation acts as a channel and a bridge: connecting real estate businesses to the people and the targeted audiences they're trying to reach.",
      "In doing so, we make property accessible across every class — you can get in from as little as ₦20,000, dismantling the barriers that have long kept real estate out of reach for most people.",
      "Trusted advisory, flexible structures and genuine transparency turn what once felt intimidating into something achievable for everyone.",
    ],
    highlights: [
      "Bridge for real estate businesses",
      "Reach the right audience",
      "Start from as low as ₦20,000",
      "Accessible to every class",
    ],
    url: "https://channels.realty",
    accent: true,
  },
  {
    slug: "surlink",
    name: "Surlink",
    tagline: "Find a Pro for any service, near you.",
    category: "Technology · Marketplace",
    year: "2023",
    status: "Building",
    summary:
      "A service marketplace connecting people to a trusted Pro nearby — for any service, at the level of quality they want.",
    description: [
      "Surlink connects people who need a Pro to Pros around them — for any service, from plumbing and styling to repairs, tutoring and beyond.",
      "It's not just about finding someone nearby. It's about finding the right someone: you choose the quality you want, and Surlink matches you to a Pro who meets that spec.",
      "Under the hood we're building the infrastructure of local trust — reputation, reliability and reach in one place, so getting help is fast, safe and effortless.",
    ],
    highlights: [
      "Any service, one platform",
      "Matched to a Pro nearby",
      "Choose your quality standard",
      "Reputation & trust built in",
    ],
    url: "https://surlink.org",
  },
  {
    slug: "ttip",
    name: "Ttip",
    tagline: "Money that moves like a message.",
    category: "Crypto · Fintech",
    year: "2025",
    status: "Building",
    summary:
      "An app to convert crypto to any local currency and back, tip family and friends, and send money anywhere — just by username.",
    description: [
      "Ttip turns crypto into money you can actually spend and share. Convert crypto to any local currency, convert local currency back to crypto, and move value across borders without the friction.",
      "Tip family and friends, or send money anywhere in the world — instantly and easily — using nothing more than someone's Ttip username. No long account numbers. No borders. No waiting.",
      "It's money that moves like a message: simple, personal and universal.",
    ],
    highlights: [
      "Crypto ↔ local currency",
      "Send by @username",
      "Tip family & friends",
      "Borderless transfers",
    ],
    url: "https://ttip.site",
    accent: true,
  },
  {
    slug: "groceries",
    name: "Groceries",
    tagline: "Gift food to the people you love — anywhere.",
    category: "Food · Commerce",
    year: "2023",
    status: "Live",
    summary:
      "A food brand that lets you gift family and friends food subscriptions from any part of the world — raw ingredients and ready-made dishes alike.",
    description: [
      "Groceries is a food brand built around a simple, warm idea: let people gift food. From any part of the world, you can send family and friends a food subscription that keeps them fed and cared for.",
      "We deal in all kinds of food — both raw ingredients for the kitchen and ready-made dishes — and Groceries gets you tailored dishes that fit your needs, not a one-size-fits-all menu.",
      "It's love, delivered: convenience, quality and reach for families at home and abroad.",
    ],
    highlights: [
      "Giftable food subscriptions",
      "Send from anywhere in the world",
      "Raw & ready-made dishes",
      "Tailored to your needs",
    ],
    url: "https://whygroceries.com",
  },
  {
    slug: "maby-academy",
    name: "Maby Academy",
    tagline: "Learn to build. Learn to grow.",
    category: "Education",
    year: "2025 →",
    status: "Coming Soon",
    summary:
      "The learning arm of Maby Connect — a place to gain the skills behind everything built here. More details soon.",
    description: [
      "Maby Academy is the education sub-brand of Maby Connect: being built as a place to learn the skills behind everything under this roof — building, crypto, business and personal growth.",
      "The full experience and curriculum are on the way. This page will grow into the home of Maby Academy as it takes shape.",
      "Want to be first in line when it opens? Reach out and I'll keep you posted.",
    ],
    highlights: [
      "Skills to build & earn",
      "Crypto & web3",
      "Business & strategy",
      "Faith & personal growth",
    ],
    accent: true,
  },
  {
    slug: "future-ventures",
    name: "Future Ventures",
    tagline: "The next companies, already in motion.",
    category: "Incubation",
    year: "2025 →",
    status: "Building",
    summary:
      "A pipeline of products in crypto, technology and community — built with the same conviction and care.",
    description: [
      "Future Ventures is the home for what comes next — the ideas being researched, prototyped and launched under the Maby Connect umbrella.",
      "From launchpads and web3 products to community infrastructure, each venture is built to solve a real problem and to help people grow.",
      "If you're building something bold, this is where partnership begins.",
    ],
    highlights: ["Web3 & launchpads", "Community infrastructure", "Selective partnerships"],
  },
];

export type Project = {
  title: string;
  domain: string;
  year: string;
  blurb: string;
};

export const projects: Project[] = [
  {
    title: "Maby Academy",
    domain: "Education",
    year: "2025",
    blurb:
      "The learning arm of Maby Connect — teaching the skills behind everything built here. In development; more soon.",
  },
  {
    title: "Memecoin Research Desk",
    domain: "Crypto",
    year: "2024",
    blurb:
      "Deep on-chain research and market analysis identifying early opportunities and separating signal from noise.",
  },
  {
    title: "Token Launchpad",
    domain: "Web3",
    year: "2024",
    blurb:
      "End-to-end launchpad design — from tokenomics and UX to go-to-market — helping projects launch with credibility.",
  },
  {
    title: "Product Design Sprints",
    domain: "Product",
    year: "2023",
    blurb:
      "Rapid design and validation for early-stage startups turning raw ideas into shippable, testable products.",
  },
  {
    title: "Brand & Positioning",
    domain: "Strategy",
    year: "2023",
    blurb:
      "Refined the identity, narrative and positioning of multiple ventures into clear, ownable brands.",
  },
  {
    title: "Growth & Go-To-Market",
    domain: "Consulting",
    year: "2022",
    blurb:
      "Advised startups on strategy and scaling — from first users to sustainable, repeatable growth.",
  },
  {
    title: "Community Systems",
    domain: "Community",
    year: "2022",
    blurb:
      "Designed and grew engaged online communities with rituals, structure and a genuine sense of belonging.",
  },
];

export type Platform = "WhatsApp" | "Telegram";

export type Community = {
  name: string;
  purpose: string;
  description: string;
  channel: Platform;
  cta: string;
  href: string;
};

export const communities: Community[] = [
  {
    name: "AllRound Growth",
    purpose: "Grow in every area of life.",
    description:
      "Faith. Finance. Business. Health. Relationships. A community built to help you become whole — not just successful.",
    channel: "WhatsApp",
    cta: "Join AllRound Growth",
    href: "https://chat.whatsapp.com/CsYAZTqWGUw1yFV55VrdaT",
  },
  {
    name: "The Praying Community",
    purpose: "Seeking God together through prayer.",
    description:
      "A gathering of believers who pray, encourage and grow in faith together. Everything begins here.",
    channel: "WhatsApp",
    cta: "Join The Praying Community",
    href: "https://chat.whatsapp.com/DDVkFK6m5rl85garNxoXIq",
  },
];

export type Channel = {
  name: string;
  platform: Platform;
  description: string;
  href: string;
};

/** Every other room to join — updates and crypto. */
export const channels: Channel[] = [
  {
    name: "Online Updates With Maby",
    platform: "WhatsApp",
    description: "Stay in the loop on everything I'm building — announcements, drops and news.",
    href: "https://chat.whatsapp.com/IPKh96qS1H73OJ9z5S5DjU",
  },
  {
    name: "Maby D'Speculator",
    platform: "Telegram",
    description: "My crypto degen channel — memecoin research, calls and on-chain signal.",
    href: "https://t.me/MabyDSpeculator",
  },
  {
    name: "Maby Lounge",
    platform: "Telegram",
    description: "The crypto lounge — a room to trade, talk markets and learn together.",
    href: "https://t.me/+IMPPY91eYAk1NTdk",
  },
];

export type TimelineItem = {
  year: string;
  title: string;
  body: string;
};

export const timeline: TimelineItem[] = [
  {
    year: "Foundation",
    title: "First, a lover of God",
    body: "Everything I build comes from that foundation. Faith is not a category of my life — it is the ground beneath all of it.",
  },
  {
    year: "University of Calabar",
    title: "Applied Geophysics",
    body: "I studied the science of the earth — learning to read complex systems, gather signal from noise, and think in models. It shaped how I build.",
  },
  {
    year: "The Builder Emerges",
    title: "Companies & communities",
    body: "I began building — real estate, technology, commerce and community — driven by a simple conviction: solve real problems and help people grow.",
  },
  {
    year: "Crypto & Web3",
    title: "Trading, research, building",
    body: "Professional trader, memecoin researcher and web3 builder. I design products and launchpads at the frontier of what money is becoming.",
  },
  {
    year: "Impact",
    title: "Foundation & philanthropy",
    body: "Jenmec Foundation — feeding the hungry, supporting children, creating opportunity. I am because we are.",
  },
  {
    year: "The Future",
    title: "Building what's next",
    body: "More companies. More communities. More people helped to grow — financially, spiritually and personally. The work has only begun.",
  },
];

export const disciplines = [
  "Crypto",
  "Technology",
  "Real Estate",
  "Community",
  "Product Building",
  "Project Management",
  "Business Strategy",
  "Faith",
  "Philanthropy",
] as const;

export const cryptoRoles = [
  "Professional Crypto Trader",
  "Memecoin Researcher",
  "Web3 Builder",
  "Product Designer",
  "Launchpad Builder",
  "Blockchain Enthusiast",
] as const;

export const stats = [
  { value: 6, suffix: "+", label: "Companies & ventures" },
  { value: 9, suffix: "", label: "Industries" },
  { value: 5, suffix: "", label: "Communities & channels" },
  { value: 1, prefix: "", suffix: "", label: "Foundation", display: "Ubuntu" },
] as const;

export const buildValues = [
  { k: "I build", v: "Companies" },
  { k: "I build", v: "Communities" },
  { k: "I build", v: "Opportunities" },
  { k: "I build", v: "People" },
] as const;

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "build-from-foundation",
    title: "Why I build from foundation, not ambition",
    excerpt:
      "Ambition burns out. Foundation endures. A reflection on building companies that outlast the hype.",
    category: "Philosophy",
    date: "2026-05-12",
    readingTime: "5 min",
    body: [
      "Everything I build begins in the same place: my faith. Before I am a founder, a trader or a builder, I am a lover of God. That is not a footnote — it is the foundation.",
      "Ambition is a good engine but a poor foundation. It gets you moving, but it cannot tell you when to stop, who to serve, or why any of it matters. Foundation can.",
      "When you build from foundation, the questions change. Instead of 'how big can this get?' you ask 'what real problem does this solve, and who does it help grow?' The scale still comes — but it comes as a consequence, not a goal.",
      "That is the quiet secret behind every company under Maby Connect. Real estate that opens doors. Technology that builds trust. Food that reaches home. A foundation that feeds the hungry. Different problems, one root.",
      "Build from foundation. The ambition will take care of itself.",
    ],
  },
  {
    slug: "uber-for-trust",
    title: "Surlink and the infrastructure of local trust",
    excerpt:
      "The next great marketplace isn't about products — it's about trust. Here's how we're building it.",
    category: "Product",
    date: "2026-04-03",
    readingTime: "6 min",
    body: [
      "Every day, millions of people need something done — a pipe fixed, a service rendered, a skill hired. And every day, the hardest part isn't the work. It's trust.",
      "Surlink exists to solve exactly that. Think of it as Uber for service professionals: request, match, and get things done with people you can actually rely on.",
      "But the real product isn't the matching — it's the trust layer underneath it. Reputation. Reliability. Verification. That is the infrastructure most local economies are missing.",
      "When trust becomes searchable, everything changes. A skilled professional in an overlooked neighborhood becomes discoverable. A customer stops gambling on strangers. Value flows to the people who earn it.",
      "That's the future we're building — one trusted connection at a time.",
    ],
  },
  {
    slug: "i-am-because-we-are",
    title: "I am because we are",
    excerpt:
      "On Ubuntu, the Jenmec Foundation, and why impact is the point of everything.",
    category: "Impact",
    date: "2026-02-18",
    readingTime: "4 min",
    body: [
      "There is a word — Ubuntu — that carries an entire philosophy: I am because we are.",
      "It means my humanity is bound up in yours. That success I keep only for myself is not success at all. That the measure of what I build is finally the good it does for others.",
      "The Jenmec Foundation is where this belief becomes action. Feeding the hungry. Supporting children. Creating opportunity where there was none.",
      "Business and impact are not two separate tracks in my life. They are the same track. The companies fund the mission; the mission gives the companies meaning.",
      "I am because we are. Everything I build is an attempt to live that sentence honestly.",
    ],
  },
];

export type MediaItem = {
  title: string;
  type: "Podcast" | "Talk" | "Feature" | "Interview";
  outlet: string;
  date: string;
};

export const mediaItems: MediaItem[] = [
  { title: "Building companies from faith and conviction", type: "Podcast", outlet: "The Builder's Room", date: "2026-06" },
  { title: "Web3, launchpads and the future of ownership", type: "Talk", outlet: "Crypto Futures Summit", date: "2026-05" },
  { title: "Ubuntu in business: profit with purpose", type: "Interview", outlet: "Impact Weekly", date: "2026-03" },
  { title: "Founder spotlight: Maby Connect", type: "Feature", outlet: "Startup Stories", date: "2026-01" },
  { title: "Real estate for everyone", type: "Talk", outlet: "Property & People", date: "2025-11" },
  { title: "From geophysics to founding companies", type: "Interview", outlet: "The Long Game", date: "2025-09" },
];

export const contactTopics = [
  "Business enquiries",
  "Speaking",
  "Partnerships",
  "Investments",
  "Consulting",
] as const;
