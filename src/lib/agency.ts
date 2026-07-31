/* ============================================================
   Maby Agency — the build arm of Maby Connect.

   Everything the agency surfaces (capabilities, stack, process,
   engagement models, the project configurator and the booking
   flow) is modelled here so the pages stay presentational.
   ============================================================ */

export const agency = {
  name: "Maby Agency",
  parent: "Maby Connect",
  tagline: "We build the thing you can't stop thinking about.",
  promise:
    "Maby Agency is the build arm of Maby Connect — the team behind Channels Realty, Surlink, Ttip and Groceries. We take products from a sentence on a napkin to something real, shipped and used.",
  email: "build@mabyconnect.com",
  responseTime: "Under 24 hours",
} as const;

/* ------------------------------------------------------------
   Capabilities — what we actually build
   ------------------------------------------------------------ */

export type Capability = {
  slug: string;
  name: string;
  short: string;
  /** One-line hook used on cards. */
  tagline: string;
  description: string[];
  /** Concrete things a client walks away with. */
  deliverables: string[];
  /** Named product types we've built or can build in this lane. */
  builds: string[];
  stack: string[];
  timeline: string;
  from: string;
  /** Displayed as the card's numeral. */
  index: string;
};

export const capabilities: Capability[] = [
  {
    slug: "web-product-engineering",
    name: "Web & Product Engineering",
    short: "Web apps",
    tagline: "Production web products, not prototypes.",
    description: [
      "The core of what we do: full-stack web products built to carry real users, real money and real load from day one.",
      "We architect the data model first, then build outward — typed end to end, tested where it counts, and deployed on infrastructure that scales without a rewrite.",
    ],
    deliverables: [
      "Architecture & data model document",
      "Full-stack application, typed end to end",
      "Admin dashboard & role-based access",
      "CI/CD pipeline and staging environment",
      "Handover documentation & code walkthrough",
    ],
    builds: [
      "SaaS platforms",
      "Internal dashboards & admin panels",
      "Booking & scheduling systems",
      "Customer portals",
      "Content platforms & CMS",
      "Landing pages that convert",
    ],
    stack: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Tailwind", "Vercel"],
    timeline: "4–12 weeks",
    from: "$4,000",
    index: "01",
  },
  {
    slug: "blockchain-web3",
    name: "Blockchain & Web3",
    short: "Blockchain",
    tagline: "Chains, contracts and tokens — from scratch.",
    description: [
      "We build on-chain systems from first principles: your own chain, your own token, your own contracts — audited patterns, no copy-paste forks that break in production.",
      "From a single ERC-20 to a full L1 with its own validator set, block explorer and bridge, we've shipped across EVM, Solana and Cosmos.",
    ],
    deliverables: [
      "Smart contracts with full test coverage",
      "Tokenomics & contract specification",
      "Deployment scripts & verified sources",
      "Web3 frontend with wallet connection",
      "Pre-audit review & gas optimisation report",
    ],
    builds: [
      "Layer 1 & Layer 2 chains from scratch",
      "Token launches (ERC-20, SPL, BEP-20)",
      "DEXs & AMM protocols",
      "Staking, vesting & rewards contracts",
      "NFT collections & marketplaces",
      "Launchpads & presale platforms",
      "Custodial & non-custodial wallets",
      "Block explorers & on-chain analytics",
      "Cross-chain bridges",
    ],
    stack: ["Solidity", "Rust", "Foundry", "Hardhat", "ethers.js", "viem", "wagmi", "Anchor", "The Graph"],
    timeline: "6–20 weeks",
    from: "$8,000",
    index: "02",
  },
  {
    slug: "fintech-banking",
    name: "Fintech & Banking",
    short: "Bank apps",
    tagline: "Money moves. We build the rails.",
    description: [
      "Banking-grade products: ledgers that balance to the cent, payments that reconcile, and compliance built in rather than bolted on.",
      "We've built payment flows across African and global rails — cards, transfers, virtual accounts, crypto on-ramps — with double-entry accounting underneath.",
    ],
    deliverables: [
      "Double-entry ledger & reconciliation engine",
      "Payment provider integrations",
      "KYC/AML onboarding flow",
      "Transaction monitoring & audit trail",
      "Security review & threat model",
    ],
    builds: [
      "Neobank & wallet apps",
      "Payment gateways & checkout flows",
      "Virtual accounts & card issuing",
      "Crypto on/off-ramps",
      "Remittance & cross-border transfer",
      "Lending & credit scoring platforms",
      "Savings, thrift & investment apps",
      "Merchant & POS dashboards",
    ],
    stack: ["Node.js", "PostgreSQL", "Redis", "Paystack", "Flutterwave", "Stripe", "Plaid", "Docker"],
    timeline: "8–24 weeks",
    from: "$10,000",
    index: "03",
  },
  {
    slug: "mobile-applications",
    name: "Mobile Applications",
    short: "Mobile",
    tagline: "One codebase. Both stores. No compromises.",
    description: [
      "Native-feeling mobile apps for iOS and Android, built once and shipped to both stores — with offline support, push notifications and biometric auth as standard.",
      "We handle the whole path: build, store listing, review submission and the first post-launch patch.",
    ],
    deliverables: [
      "iOS & Android builds",
      "App Store & Play Store submission",
      "Push notifications & deep linking",
      "Offline-first data layer",
      "Crash reporting & analytics",
    ],
    builds: [
      "Consumer marketplace apps",
      "Fintech & wallet apps",
      "Delivery & logistics apps",
      "Booking & service apps",
      "Community & social apps",
    ],
    stack: ["React Native", "Expo", "TypeScript", "Reanimated", "Firebase", "RevenueCat"],
    timeline: "6–16 weeks",
    from: "$7,000",
    index: "04",
  },
  {
    slug: "marketplaces-platforms",
    name: "Marketplaces & Platforms",
    short: "Marketplaces",
    tagline: "Two-sided products that actually clear.",
    description: [
      "Marketplaces are hard: you're building two products at once and neither works without the other. We've done it — Surlink connects people to vetted Pros, Groceries moves food across borders.",
      "Matching, trust, escrow, disputes, payouts and the supply-side tooling that keeps the other half of the market showing up.",
    ],
    deliverables: [
      "Supply & demand side applications",
      "Matching & ranking engine",
      "Escrow, split payments & payouts",
      "Ratings, reviews & trust system",
      "Dispute resolution workflow",
    ],
    builds: [
      "Service marketplaces",
      "Product & commerce marketplaces",
      "Rental & booking platforms",
      "Logistics & delivery networks",
      "Real estate platforms",
      "Freelance & talent platforms",
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Elasticsearch", "Stripe Connect", "Mapbox"],
    timeline: "8–20 weeks",
    from: "$9,000",
    index: "05",
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    short: "AI",
    tagline: "Agents that do the work, not demos.",
    description: [
      "AI that earns its place in the product: support agents that resolve tickets, pipelines that read documents, systems that make decisions and explain them.",
      "We build with evaluation harnesses from the start, so you know the thing actually works before it touches a customer.",
    ],
    deliverables: [
      "Agent or pipeline in production",
      "Retrieval layer over your own data",
      "Evaluation suite & quality benchmarks",
      "Cost & latency monitoring",
      "Guardrails and human-in-the-loop review",
    ],
    builds: [
      "Customer support agents",
      "Document & contract intelligence",
      "RAG over private knowledge bases",
      "Workflow & back-office automation",
      "Recommendation engines",
      "AI product features (search, drafting, summarising)",
    ],
    stack: ["Claude API", "TypeScript", "Python", "LangGraph", "pgvector", "Modal"],
    timeline: "3–10 weeks",
    from: "$5,000",
    index: "06",
  },
  {
    slug: "brand-design",
    name: "Brand & Product Design",
    short: "Design",
    tagline: "Identity, interface and the feeling between them.",
    description: [
      "The difference between a product people tolerate and one they tell their friends about is design — and it starts before a single screen is drawn.",
      "Positioning, naming, identity, then a design system your engineers can actually build from.",
    ],
    deliverables: [
      "Brand identity & logo system",
      "Design system & component library",
      "High-fidelity product screens",
      "Interactive prototype",
      "Motion & interaction spec",
    ],
    builds: [
      "Brand identity from scratch",
      "Product & app UI design",
      "Design systems",
      "Marketing sites & pitch decks",
      "Rebrands & redesigns",
    ],
    stack: ["Figma", "Framer Motion", "Rive", "Tailwind", "Blender"],
    timeline: "2–8 weeks",
    from: "$2,500",
    index: "07",
  },
  {
    slug: "growth-launch",
    name: "Growth & Launch",
    short: "Growth",
    tagline: "Shipped is the start, not the finish.",
    description: [
      "A product nobody knows about isn't a product. We build the launch alongside the build — waitlists, content, community and the analytics to tell you what's working.",
      "Maby Connect runs communities across crypto and tech. We bring that same playbook to your launch.",
    ],
    deliverables: [
      "Launch plan & timeline",
      "Waitlist & referral mechanics",
      "Analytics & conversion tracking",
      "Community setup & moderation playbook",
      "First 90 days growth report",
    ],
    builds: [
      "Product launches",
      "Waitlist & referral systems",
      "Community building (Telegram, Discord, X)",
      "Content & SEO foundations",
      "Analytics instrumentation",
    ],
    stack: ["PostHog", "Plausible", "Resend", "Telegram API", "Discord.js"],
    timeline: "Ongoing",
    from: "$1,500/mo",
    index: "08",
  },
];

/* ------------------------------------------------------------
   The stack — grouped for the "how we build" section
   ------------------------------------------------------------ */

export const stackGroups = [
  {
    label: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "React Native"],
  },
  {
    label: "Backend",
    items: ["Node.js", "NestJS", "Python", "Go", "GraphQL", "tRPC", "REST"],
  },
  {
    label: "Blockchain",
    items: ["Solidity", "Rust", "Foundry", "Hardhat", "Anchor", "ethers.js", "viem"],
  },
  {
    label: "Data",
    items: ["PostgreSQL", "MongoDB", "Redis", "Prisma", "Elasticsearch", "pgvector"],
  },
  {
    label: "Infrastructure",
    items: ["Vercel", "AWS", "Docker", "Kubernetes", "Cloudflare", "GitHub Actions"],
  },
  {
    label: "Payments",
    items: ["Stripe", "Paystack", "Flutterwave", "Plaid", "Circle", "Web3 wallets"],
  },
] as const;

/* ------------------------------------------------------------
   Process
   ------------------------------------------------------------ */

export const process = [
  {
    phase: "01",
    name: "Discover",
    duration: "Week 0",
    summary: "We pull the real problem out of the brief.",
    detail:
      "A working session where we interrogate the idea — who it's for, what it must do, what it must never do. You leave with a written scope, a fixed price and a delivery date, before any money moves.",
    outputs: ["Product brief", "Scope & fixed quote", "Delivery timeline"],
  },
  {
    phase: "02",
    name: "Architect",
    duration: "Week 1",
    summary: "Data model, system design, and the plan to build it.",
    detail:
      "We design the schema, the services and the integration surface up front. This is the step most teams skip, and it's the reason their v2 is a rewrite instead of a release.",
    outputs: ["System architecture", "Data model", "API contract", "Design direction"],
  },
  {
    phase: "03",
    name: "Build",
    duration: "Weeks 2–10",
    summary: "Weekly shipping, in the open.",
    detail:
      "You get a staging link from week one and a demo every Friday. No black boxes, no month-long silences — you watch it get built and steer as it goes.",
    outputs: ["Weekly builds", "Friday demos", "Live staging environment"],
  },
  {
    phase: "04",
    name: "Launch",
    duration: "Launch week",
    summary: "Production, monitored, with a human on call.",
    detail:
      "Deployment, load testing, monitoring, store submission where relevant — and someone watching the dashboards the night you go live.",
    outputs: ["Production deployment", "Monitoring & alerts", "Launch plan"],
  },
  {
    phase: "05",
    name: "Scale",
    duration: "Ongoing",
    summary: "We stay until you don't need us.",
    detail:
      "Post-launch support, iteration on real usage data, and hiring or training your in-house team to take the wheel when you're ready.",
    outputs: ["Support retainer", "Iteration roadmap", "Team handover"],
  },
] as const;

/* ------------------------------------------------------------
   Engagement models
   ------------------------------------------------------------ */

export const engagements = [
  {
    name: "Sprint",
    price: "From $2,500",
    unit: "2 weeks",
    best: "Validating fast",
    summary:
      "A focused two-week push. Prototype, MVP slice, design system or technical spike — one clear outcome, delivered.",
    includes: [
      "One senior builder, dedicated",
      "Daily progress updates",
      "Working deliverable at the end",
      "Fixed price, no overruns",
    ],
    featured: false,
  },
  {
    name: "Product Build",
    price: "From $8,000",
    unit: "6–16 weeks",
    best: "Going to market",
    summary:
      "The full path from brief to launched product. Architecture, build, launch and the first month of support included.",
    includes: [
      "Full team: engineering, design, QA",
      "Weekly demos & staging access",
      "Launch support & monitoring",
      "30 days post-launch support",
      "Complete handover & documentation",
    ],
    featured: true,
  },
  {
    name: "Embedded Partner",
    price: "From $4,000/mo",
    unit: "Monthly",
    best: "Building continuously",
    summary:
      "We become your product team. Continuous delivery, roadmap ownership and a seat in your standups.",
    includes: [
      "Dedicated squad",
      "Roadmap & delivery ownership",
      "Slack / Telegram access",
      "Monthly strategy review",
      "Pause or stop any month",
    ],
    featured: false,
  },
] as const;

/* ------------------------------------------------------------
   Project configurator — the pre-consultation survey
   ------------------------------------------------------------ */

export type ConfigOption = {
  value: string;
  label: string;
  hint?: string;
  /** Capability slugs this answer points toward. */
  signals?: string[];
  /** Rough weeks and budget weighting this answer contributes. */
  weight?: number;
};

export type ConfigStep = {
  id: string;
  question: string;
  helper: string;
  multi?: boolean;
  options: ConfigOption[];
};

export const configSteps: ConfigStep[] = [
  {
    id: "kind",
    question: "What are we building?",
    helper: "Pick the closest thing. We'll refine it together on the call.",
    options: [
      {
        value: "web",
        label: "A web app or platform",
        hint: "SaaS, dashboard, portal",
        signals: ["web-product-engineering"],
        weight: 2,
      },
      {
        value: "mobile",
        label: "A mobile app",
        hint: "iOS and Android",
        signals: ["mobile-applications"],
        weight: 3,
      },
      {
        value: "chain",
        label: "Something on-chain",
        hint: "Token, contracts, a whole chain",
        signals: ["blockchain-web3"],
        weight: 4,
      },
      {
        value: "fintech",
        label: "A fintech or bank product",
        hint: "Payments, wallets, lending",
        signals: ["fintech-banking"],
        weight: 4,
      },
      {
        value: "marketplace",
        label: "A marketplace",
        hint: "Two-sided, buyers and sellers",
        signals: ["marketplaces-platforms"],
        weight: 4,
      },
      {
        value: "ai",
        label: "An AI product or agent",
        hint: "Automation, agents, RAG",
        signals: ["ai-automation"],
        weight: 2,
      },
    ],
  },
  {
    id: "stage",
    question: "Where are you starting from?",
    helper: "There's no wrong answer — it just changes where we begin.",
    options: [
      {
        value: "idea",
        label: "An idea in my head",
        hint: "Nothing built yet",
        signals: ["brand-design"],
        weight: 1,
      },
      {
        value: "designs",
        label: "Designs or a spec",
        hint: "I know what it looks like",
        weight: 0,
      },
      {
        value: "mvp",
        label: "Something already live",
        hint: "Needs rebuilding or extending",
        weight: 1,
      },
      {
        value: "team",
        label: "A team that needs help",
        hint: "Extra hands or expertise",
        weight: 0,
      },
    ],
  },
  {
    id: "features",
    question: "What does it need to do?",
    helper: "Select everything that applies — this drives the estimate most.",
    multi: true,
    options: [
      { value: "auth", label: "Accounts & authentication", weight: 1 },
      { value: "payments", label: "Take payments", signals: ["fintech-banking"], weight: 2 },
      { value: "wallet", label: "Crypto wallets or tokens", signals: ["blockchain-web3"], weight: 3 },
      { value: "realtime", label: "Real-time / chat / live updates", weight: 2 },
      { value: "admin", label: "Admin dashboard", weight: 1 },
      { value: "maps", label: "Maps, location or logistics", weight: 2 },
      { value: "ai", label: "AI features", signals: ["ai-automation"], weight: 2 },
      { value: "mobile", label: "Mobile apps", signals: ["mobile-applications"], weight: 3 },
      { value: "integrations", label: "Third-party integrations", weight: 1 },
      { value: "multi", label: "Multi-tenant / white label", weight: 2 },
    ],
  },
  {
    id: "timeline",
    question: "When does it need to exist?",
    helper: "Honest answers get honest plans.",
    options: [
      { value: "asap", label: "Yesterday", hint: "Under 6 weeks", weight: 2 },
      { value: "quarter", label: "This quarter", hint: "6–12 weeks", weight: 0 },
      { value: "half", label: "Within 6 months", hint: "Room to do it properly", weight: -1 },
      { value: "exploring", label: "Still exploring", hint: "Scoping and planning", weight: -1 },
    ],
  },
  {
    id: "budget",
    question: "What's the budget range?",
    helper: "We'll tell you straight whether it's enough for what you want.",
    options: [
      { value: "under5", label: "Under $5,000" },
      { value: "5-15", label: "$5,000 – $15,000" },
      { value: "15-40", label: "$15,000 – $40,000" },
      { value: "40plus", label: "$40,000+" },
      { value: "unsure", label: "Not sure yet", hint: "Help me work it out" },
    ],
  },
];

/** Budget bands the configurator maps its score onto. */
export const estimateBands = [
  { max: 4, label: "$3,000 – $8,000", weeks: "4–6 weeks", tier: "Focused build" },
  { max: 8, label: "$8,000 – $18,000", weeks: "6–10 weeks", tier: "Full product" },
  { max: 13, label: "$18,000 – $40,000", weeks: "10–16 weeks", tier: "Platform build" },
  { max: Infinity, label: "$40,000+", weeks: "16–24 weeks", tier: "Ecosystem build" },
] as const;

/* ------------------------------------------------------------
   Booking
   ------------------------------------------------------------ */

export const callTypes = [
  {
    value: "intro",
    name: "Intro call",
    duration: "20 min",
    summary: "Tell us what you're building. We'll tell you if we're the right team.",
    icon: "spark",
  },
  {
    value: "scope",
    name: "Scoping session",
    duration: "60 min",
    summary: "We go deep on requirements and leave with a written scope and a fixed quote.",
    icon: "map",
  },
  {
    value: "technical",
    name: "Technical review",
    duration: "45 min",
    summary: "Existing codebase, architecture or contracts — we review it and tell you the truth.",
    icon: "code",
  },
  {
    value: "partnership",
    name: "Partnership",
    duration: "30 min",
    summary: "Agencies, funds and founders looking to build together long-term.",
    icon: "handshake",
  },
] as const;

/** Times offered each working day, in the founder's local timezone. */
export const bookingSlots = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

export const bookingTimezone = "WAT · West Africa Time (UTC+1)";

/* ------------------------------------------------------------
   Proof & numbers
   ------------------------------------------------------------ */

export const agencyStats = [
  { value: 5, suffix: "+", label: "Products shipped" },
  { value: 4, suffix: "", label: "Industries built in" },
  { value: 24, suffix: "h", label: "Response time" },
  { value: 100, suffix: "%", label: "Code ownership, yours" },
] as const;

export const principles = [
  {
    title: "Fixed scope, fixed price",
    body: "You know the number and the date before we write a line of code. If we get the estimate wrong, that's our problem, not your invoice.",
  },
  {
    title: "You own everything",
    body: "Code, designs, infrastructure, accounts. Full repository access from day one, no licensing games, no hostage situations.",
  },
  {
    title: "Built in the open",
    body: "A staging link from week one and a demo every Friday. You'll never wonder what we're doing with your money.",
  },
  {
    title: "We say no",
    body: "If your idea doesn't need what you're asking for, or we're not the right team, we'll tell you on the first call instead of taking the money.",
  },
] as const;

export const faqs = [
  {
    q: "How fast can you start?",
    a: "Usually within a week of the scoping call. Sprints can sometimes start in days if the scope is clear.",
  },
  {
    q: "Do you work with founders outside Nigeria?",
    a: "Yes — most of our work is remote and global. We run on your timezone for calls and keep async updates flowing in between.",
  },
  {
    q: "Can you really build a blockchain from scratch?",
    a: "Yes. Full L1s with their own validator set, consensus config, explorer and bridge — as well as the more common work: tokens, contracts, DEXs and launchpads.",
  },
  {
    q: "What if I only have an idea?",
    a: "That's the most common starting point. The scoping session exists exactly for this — you leave it with a written spec, a price and a timeline, whether or not you build with us.",
  },
  {
    q: "Who owns the code?",
    a: "You do, completely, from the first commit. You get repository access on day one and every account is created in your name.",
  },
  {
    q: "What happens after launch?",
    a: "Thirty days of support is included in every product build. After that most clients move to a monthly retainer, and some take the code fully in-house — both are fine.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Happily, before the first call if you'd prefer. Just say so when you book.",
  },
] as const;
