/* ============================================================
   Guided paths — tailored intake for every venture.

   Someone arrives knowing what they want but not how to start.
   Each path asks a handful of questions in that venture's own
   language, then returns a tailored recommendation plus the next
   concrete step — before they ever have to talk to anyone.
   ============================================================ */

export type PathOption = {
  value: string;
  label: string;
  hint?: string;
  /** Outcome keys this answer votes for. */
  votes?: string[];
};

export type PathStep = {
  id: string;
  question: string;
  helper: string;
  multi?: boolean;
  options: PathOption[];
};

export type PathOutcome = {
  key: string;
  title: string;
  summary: string;
  /** What actually happens next, in order. */
  steps: string[];
  /** Honest caveat — shown in every outcome. */
  note?: string;
};

export type GuidedPath = {
  slug: string;
  /** Verb-first, as the person would say it. */
  intent: string;
  title: string;
  intro: string;
  /** Which company this routes into. */
  company?: string;
  companyName: string;
  accent: string;
  eyebrow: string;
  steps: PathStep[];
  outcomes: PathOutcome[];
  fallbackOutcome: string;
  /** Where they go after submitting. */
  cta: { label: string; href: string };
};

/* ------------------------------------------------------------ */

export const guidedPaths: GuidedPath[] = [
  {
    slug: "real-estate",
    intent: "I want to invest in real estate",
    title: "Real estate, without the gatekeeping.",
    intro:
      "Property is the most common thing people want in and the least often explained honestly. Six questions and you'll know which route actually fits you — and what it costs to start.",
    company: "channels-realty",
    companyName: "Channels Realty Innovation",
    accent: "#D97742",
    eyebrow: "Channels Realty",
    steps: [
      {
        id: "goal",
        question: "What do you actually want property to do for you?",
        helper: "There's no wrong answer. Different goals need completely different routes.",
        options: [
          {
            value: "hold",
            label: "Grow my money over time",
            hint: "Buy, hold, let it appreciate",
            votes: ["land-banking", "long-term"],
          },
          {
            value: "income",
            label: "Earn monthly income",
            hint: "Rent or shortlets paying me",
            votes: ["shortlets", "buy-to-rent"],
          },
          {
            value: "flip",
            label: "Buy low, sell higher, fairly soon",
            hint: "Turn capital around",
            votes: ["land-flipping"],
          },
          {
            value: "live",
            label: "Own somewhere to live in",
            hint: "A home, eventually",
            votes: ["buy-and-build", "long-term"],
          },
          {
            value: "develop",
            label: "Build and develop property",
            hint: "Put up structures",
            votes: ["develop", "buy-and-build"],
          },
          {
            value: "unsure",
            label: "Honestly, I don't know yet",
            hint: "Show me the options",
            votes: ["long-term"],
          },
        ],
      },
      {
        id: "capital",
        question: "What can you comfortably start with?",
        helper: "Comfortably means it wouldn't hurt you if it were tied up for a while.",
        options: [
          { value: "under100k", label: "Under ₦100,000", hint: "Entry level — yes, this is possible", votes: ["land-banking"] },
          { value: "100k-1m", label: "₦100,000 – ₦1,000,000", votes: ["land-banking", "land-flipping"] },
          { value: "1m-5m", label: "₦1,000,000 – ₦5,000,000", votes: ["land-flipping", "buy-to-rent"] },
          { value: "5m-20m", label: "₦5,000,000 – ₦20,000,000", votes: ["buy-and-build", "shortlets"] },
          { value: "20mplus", label: "₦20,000,000+", votes: ["develop", "buy-and-build"] },
        ],
      },
      {
        id: "horizon",
        question: "How long can the money stay in?",
        helper: "This matters more than the amount. Property punishes people who need to exit early.",
        options: [
          { value: "short", label: "Under a year", hint: "I'll need it back", votes: ["land-flipping"] },
          { value: "medium", label: "1 – 3 years", votes: ["land-flipping", "buy-to-rent"] },
          { value: "long", label: "3 – 7 years", votes: ["land-banking", "buy-and-build"] },
          { value: "generational", label: "As long as it takes", hint: "I'm building wealth, not trading", votes: ["land-banking", "develop"] },
        ],
      },
      {
        id: "involvement",
        question: "How hands-on do you want to be?",
        helper: "Some routes need you present. Others genuinely don't.",
        options: [
          { value: "passive", label: "Completely hands-off", hint: "Tell me when something happens", votes: ["land-banking"] },
          { value: "light", label: "Decisions only", hint: "I approve, someone else runs it", votes: ["buy-to-rent", "shortlets"] },
          { value: "hands-on", label: "I want to be involved", hint: "Site visits, choices, the lot", votes: ["buy-and-build", "develop"] },
        ],
      },
      {
        id: "experience",
        question: "Have you done this before?",
        helper: "It changes how much we explain, not what's available to you.",
        options: [
          { value: "never", label: "Never — complete beginner" },
          { value: "once", label: "Once or twice" },
          { value: "experienced", label: "I own property already" },
          { value: "burned", label: "Yes, and it went badly", hint: "We'll be extra careful" },
        ],
      },
      {
        id: "location",
        question: "Where are you looking?",
        helper: "Availability and entry price vary a lot by corridor.",
        options: [
          { value: "lagos", label: "Lagos" },
          { value: "abuja", label: "Abuja" },
          { value: "ogun", label: "Ogun / Lagos corridor", hint: "Where most entry-level land sits" },
          { value: "other-ng", label: "Elsewhere in Nigeria" },
          { value: "diaspora", label: "I'm abroad, buying at home", votes: ["land-banking"] },
          { value: "open", label: "Open — advise me" },
        ],
      },
    ],
    outcomes: [
      {
        key: "land-banking",
        title: "Land banking",
        summary:
          "Buy land in a corridor before development reaches it, hold, let appreciation do the work. The lowest entry point in property and the most forgiving of small budgets — you can start from as little as ₦20,000 through Channels Realty.",
        steps: [
          "We show you the current corridors, their entry prices and why each one is priced the way it is",
          "You verify title documents — we walk you through what to check and why",
          "Payment plan set up, spread over months if that suits you",
          "Documentation issued in your name; you hold while the corridor develops",
        ],
        note: "Appreciation depends on development actually reaching the corridor. Nobody can promise a timeline — anyone who does is selling you something.",
      },
      {
        key: "land-flipping",
        title: "Land flipping",
        summary:
          "Acquire below market, hold briefly, resell into demand. Higher return potential than banking, and materially higher risk — your exit depends on finding a buyer at your price.",
        steps: [
          "We identify parcels priced below the corridor average and explain why they are",
          "Title and encumbrance verification before any money moves",
          "Acquisition, then an agreed hold window",
          "We market it through the Channels Realty network when the window closes",
        ],
        note: "Flipping only works if you can wait for the right buyer. If you'll be forced to sell on a deadline, banking is the safer route.",
      },
      {
        key: "buy-to-rent",
        title: "Buy to rent",
        summary:
          "Acquire a finished or near-finished property and let it. Predictable monthly income, slower capital growth, and a real management burden that someone has to carry.",
        steps: [
          "We match your budget to properties with realistic, evidenced rental demand",
          "You see actual comparable rents in that area — not projections",
          "Acquisition and any finishing work required",
          "Tenanting and management, either yours or arranged",
        ],
        note: "Rental yields in Nigeria are often lower than people expect relative to purchase price. We'll show you the real numbers before you commit.",
      },
      {
        key: "shortlets",
        title: "Shortlets",
        summary:
          "Furnish a property and let it nightly. The highest income per square metre of any residential route, and the most operationally demanding — this is a hospitality business, not passive income.",
        steps: [
          "Location analysis against actual occupancy data for that corridor",
          "Acquisition, then furnishing to the standard the market expects",
          "Listing setup, pricing strategy and calendar management",
          "Ongoing operations — cleaning, turnover, guest handling",
        ],
        note: "Occupancy is seasonal and competitive. Budget for the months where it sits empty and it works; assume every night is booked and it won't.",
      },
      {
        key: "buy-and-build",
        title: "Buy and build",
        summary:
          "Acquire land, then put up a structure — for yourself or to sell. The most control over the outcome, and the most exposure to build costs moving under you.",
        steps: [
          "Land acquisition in a corridor that suits the build you want",
          "Architectural and structural planning with costed stages",
          "Phased build, so you're never committing the whole budget at once",
          "Completion, documentation, and either occupancy or sale",
        ],
        note: "Build costs in Nigeria move with FX and cement pricing. We phase builds specifically so a cost shock pauses the project rather than stranding it.",
      },
      {
        key: "develop",
        title: "Development",
        summary:
          "Multi-unit development for sale or lease. The highest ceiling in property and the least forgiving — it needs real capital, real timelines and genuine appetite for risk.",
        steps: [
          "Feasibility study on a specific site with costed scenarios",
          "Structuring — solo, joint venture, or syndicated with other investors",
          "Land acquisition and approvals",
          "Phased development, then sale or lease of the units",
        ],
        note: "Development is where people lose serious money when the feasibility was optimistic. We'd rather talk you out of a marginal site than take the fee.",
      },
      {
        key: "long-term",
        title: "Long-term hold",
        summary:
          "The straightforward route: acquire a solid asset, hold it, let time and the corridor do the work. Boring, and it's how most property wealth is actually built.",
        steps: [
          "We map your budget against what it genuinely buys right now",
          "Title verification and documentation",
          "Acquisition, with a payment plan if you want one",
          "Annual check-ins on corridor value and whether to hold or move",
        ],
        note: "Property is illiquid. Money that goes in should be money you won't need quickly.",
      },
    ],
    fallbackOutcome: "land-banking",
    cta: { label: "Talk to Channels Realty", href: "https://channelsrealty.online" },
  },

  {
    slug: "hire-a-pro",
    intent: "I need a service professional",
    title: "Find a Pro you can actually trust.",
    intro:
      "Everyone has a story about a bad artisan. Surlink exists because finding someone competent shouldn't be luck. Tell us what you need.",
    company: "surlink",
    companyName: "Surlink",
    accent: "#2AA79B",
    eyebrow: "Surlink",
    steps: [
      {
        id: "service",
        question: "What do you need done?",
        helper: "Pick the closest — Surlink covers far more than this list.",
        multi: true,
        options: [
          { value: "home", label: "Home repairs", hint: "Plumbing, electrical, carpentry", votes: ["urgent-trade"] },
          { value: "beauty", label: "Beauty & styling", votes: ["appointment"] },
          { value: "cleaning", label: "Cleaning", votes: ["recurring"] },
          { value: "tutoring", label: "Tutoring & lessons", votes: ["recurring"] },
          { value: "events", label: "Events & catering", votes: ["appointment"] },
          { value: "tech", label: "Tech & devices", votes: ["urgent-trade"] },
          { value: "auto", label: "Vehicle & auto", votes: ["urgent-trade"] },
          { value: "other", label: "Something else" },
        ],
      },
      {
        id: "urgency",
        question: "When do you need it?",
        helper: "This changes who we match you with more than anything else.",
        options: [
          { value: "now", label: "Today or tomorrow", hint: "It's urgent", votes: ["urgent-trade"] },
          { value: "week", label: "This week", votes: ["appointment"] },
          { value: "flexible", label: "Whenever — I want the right person", votes: ["appointment"] },
          { value: "ongoing", label: "Regularly, ongoing", votes: ["recurring"] },
        ],
      },
      {
        id: "standard",
        question: "What standard are you paying for?",
        helper: "Surlink matches to the level you actually want — being honest here gets you a better match.",
        options: [
          { value: "budget", label: "Cheap and functional", hint: "It just needs to work" },
          { value: "solid", label: "Solid and reliable", hint: "Fair price, done properly" },
          { value: "premium", label: "The best available", hint: "Price is secondary" },
        ],
      },
      {
        id: "role",
        question: "Which side are you on?",
        helper: "Surlink is two-sided — plenty of people arrive wanting to offer services, not book them.",
        options: [
          { value: "customer", label: "I need to hire someone" },
          { value: "pro", label: "I'm a Pro looking for work", hint: "Join the supply side", votes: ["become-pro"] },
          { value: "both", label: "Both, actually" },
        ],
      },
    ],
    outcomes: [
      {
        key: "urgent-trade",
        title: "Urgent trade callout",
        summary:
          "You need someone competent at your door quickly. Surlink matches on proximity first, then on rating — so you get the best available person who can actually reach you.",
        steps: [
          "Post the job with your location and what's wrong",
          "Nearby Pros matching your quality level respond",
          "You see their ratings and history before choosing",
          "Payment held until you confirm the work is done",
        ],
      },
      {
        key: "appointment",
        title: "Booked appointment",
        summary:
          "You have time to pick well. Browse Pros by rating and portfolio, book a slot, and pay through escrow so nobody is out of pocket if it goes wrong.",
        steps: [
          "Browse matched Pros with ratings and past work",
          "Book a time that suits you both",
          "Pay into escrow at booking",
          "Confirm completion and the Pro gets paid",
        ],
      },
      {
        key: "recurring",
        title: "Recurring arrangement",
        summary:
          "Ongoing work — cleaning, tutoring, maintenance. Surlink lets you keep the same Pro and schedule it, so you're not re-hiring every week.",
        steps: [
          "Match with Pros open to recurring work",
          "Trial the first session before committing",
          "Set a repeating schedule you both agree",
          "Pay per session or on a plan",
        ],
      },
      {
        key: "become-pro",
        title: "Join as a Pro",
        summary:
          "Surlink's supply side. You get discovered by people nearby who need exactly what you do, with a reputation that follows you and payment protection on both ends.",
        steps: [
          "Register with your skills, coverage area and rates",
          "Verification — this is what makes customers trust the platform",
          "Start receiving matched job requests",
          "Build a rating that wins you better work",
        ],
      },
    ],
    fallbackOutcome: "appointment",
    cta: { label: "Open Surlink", href: "https://surlink.online" },
  },

  {
    slug: "crypto",
    intent: "I want to understand crypto",
    title: "Crypto that behaves like money.",
    intro:
      "Most people's first crypto experience is confusing and expensive. Tell us where you actually are and we'll point you at the right starting place — including telling you if you shouldn't start.",
    company: "ttip",
    companyName: "Ttip",
    accent: "#4C7DF0",
    eyebrow: "Ttip",
    steps: [
      {
        id: "level",
        question: "How familiar are you with crypto?",
        helper: "Be honest — the wrong starting point is how people lose money.",
        options: [
          { value: "none", label: "Complete beginner", hint: "I've heard of Bitcoin", votes: ["learn-first"] },
          { value: "some", label: "I've bought some before", votes: ["convert"] },
          { value: "active", label: "I trade or hold actively", votes: ["community"] },
          { value: "builder", label: "I want to build in web3", votes: ["build-web3"] },
        ],
      },
      {
        id: "goal",
        question: "What do you want it to do for you?",
        helper: "Different goals, genuinely different tools.",
        options: [
          { value: "send", label: "Send money to people", hint: "Family, friends, across borders", votes: ["convert"] },
          { value: "spend", label: "Turn crypto into spendable money", votes: ["convert"] },
          { value: "grow", label: "Grow my money", hint: "Investment", votes: ["learn-first", "community"] },
          { value: "learn", label: "Understand it properly first", votes: ["learn-first"] },
          { value: "build", label: "Build something on-chain", votes: ["build-web3"] },
        ],
      },
      {
        id: "risk",
        question: "If it dropped 50% next month, what happens to you?",
        helper: "This is the most important question on this page.",
        options: [
          { value: "fine", label: "Nothing — I'd wait it out", votes: ["community"] },
          { value: "uncomfortable", label: "I'd be uncomfortable but fine", votes: ["convert"] },
          { value: "serious", label: "That would seriously hurt", votes: ["learn-first"] },
          { value: "cant", label: "I can't afford to lose anything", votes: ["learn-first"] },
        ],
      },
    ],
    outcomes: [
      {
        key: "learn-first",
        title: "Learn before you put money in",
        summary:
          "Based on your answers, the right first move is understanding — not buying. Crypto is genuinely volatile and people lose real money. Maby Academy covers the fundamentals and the communities let you watch how people actually think before you commit anything.",
        steps: [
          "Start with the crypto fundamentals at Maby Academy",
          "Sit in the Maby Lounge and read for a while — no pressure to trade",
          "Only when you understand what you're buying, start small",
          "Never put in money you need for something else",
        ],
        note: "This is education, not financial advice. Nobody here will tell you what to buy, and you should be suspicious of anyone who does.",
      },
      {
        key: "convert",
        title: "Ttip — crypto that moves like a message",
        summary:
          "You want crypto to be useful, not a bet. Ttip converts between crypto and local currency both ways, and sends money to anyone by username — no account numbers, no borders.",
        steps: [
          "Get on the Ttip early-access list",
          "Convert crypto to your local currency, or the other way",
          "Send to family and friends by username alone",
          "Tip and receive without the usual transfer friction",
        ],
        note: "Ttip is in active build. Conversion rates move with the market — what you convert at is what you get.",
      },
      {
        key: "community",
        title: "The crypto rooms",
        summary:
          "You know your way around. Maby D'Speculator carries on-chain research and memecoin analysis; Maby Lounge is where the trading conversation happens.",
        steps: [
          "Join Maby D'Speculator for research and on-chain signal",
          "Join Maby Lounge for market discussion",
          "Get early notice when Ttip opens",
        ],
        note: "Nothing shared in those rooms is financial advice. Do your own research and size positions you can afford to lose.",
      },
      {
        key: "build-web3",
        title: "Build it with Maby Agency",
        summary:
          "You're not here to buy — you're here to build. Maby Agency builds on-chain systems from scratch: tokens, contracts, DEXs, launchpads, wallets, explorers, and full L1 chains.",
        steps: [
          "Run the project configurator to scope what you're building",
          "Get a budget band and timeline back in about two minutes",
          "Book a technical review to go deep on architecture",
          "Fixed scope, fixed price, before anything starts",
        ],
      },
    ],
    fallbackOutcome: "learn-first",
    cta: { label: "Visit Ttip", href: "https://ttip.site" },
  },

  {
    slug: "food",
    intent: "I want to send food to someone",
    title: "Feed the people you love, from anywhere.",
    intro:
      "Groceries exists because caring for family across distance shouldn't mean wiring money and hoping. Tell us who you're feeding.",
    company: "groceries",
    companyName: "Groceries",
    accent: "#F2764B",
    eyebrow: "Groceries",
    steps: [
      {
        id: "who",
        question: "Who is this for?",
        helper: "Most people arrive here sending, not buying for themselves.",
        options: [
          { value: "family", label: "Family back home", hint: "I'm abroad", votes: ["diaspora-gift"] },
          { value: "friend", label: "A friend, as a gift", votes: ["diaspora-gift"] },
          { value: "self", label: "Myself or my household", votes: ["own-subscription"] },
          { value: "business", label: "My business or staff", votes: ["bulk"] },
        ],
      },
      {
        id: "kind",
        question: "What kind of food?",
        helper: "Groceries handles both raw ingredients and cooked dishes.",
        options: [
          { value: "raw", label: "Raw ingredients", hint: "For their own kitchen", votes: ["own-subscription"] },
          { value: "cooked", label: "Ready-made dishes", hint: "Cooked and delivered", votes: ["diaspora-gift"] },
          { value: "both", label: "A mix of both" },
          { value: "unsure", label: "Whatever suits them best" },
        ],
      },
      {
        id: "frequency",
        question: "One-off or ongoing?",
        helper: "Subscriptions are where Groceries does its best work.",
        options: [
          { value: "once", label: "Just once for now" },
          { value: "monthly", label: "Every month", votes: ["own-subscription", "diaspora-gift"] },
          { value: "weekly", label: "Weekly", votes: ["own-subscription"] },
          { value: "occasions", label: "On occasions", hint: "Birthdays, festive periods" },
        ],
      },
    ],
    outcomes: [
      {
        key: "diaspora-gift",
        title: "Gift a food subscription",
        summary:
          "You're abroad and want to know they're actually eating. Groceries lets you send a food subscription from anywhere in the world — you pay, they receive, no wiring money and wondering.",
        steps: [
          "Tell us who's receiving and where they are",
          "Pick raw ingredients, ready-made dishes, or a mix",
          "Choose the cadence — one-off, monthly or weekly",
          "You pay from wherever you are; delivery happens at their end",
        ],
      },
      {
        key: "own-subscription",
        title: "Your own food plan",
        summary:
          "A recurring plan built around what you actually eat, rather than a fixed hamper. Raw ingredients, ready-made dishes, or both.",
        steps: [
          "Tell us your household size and what you eat",
          "We tailor the basket rather than sending a standard box",
          "Set your delivery cadence",
          "Adjust it as your needs change",
        ],
      },
      {
        key: "bulk",
        title: "Business and bulk",
        summary:
          "Feeding staff or supplying an operation. Different pricing, different logistics, handled directly rather than through the consumer flow.",
        steps: [
          "Tell us headcount and frequency",
          "We quote against volume",
          "Set up a recurring delivery schedule",
          "Adjust as headcount moves",
        ],
      },
    ],
    fallbackOutcome: "diaspora-gift",
    cta: { label: "Visit Groceries", href: "https://whygroceries.store" },
  },

  {
    slug: "learn",
    intent: "I want to learn to build",
    title: "Learn the skills behind all of this.",
    intro:
      "Maby Academy teaches what's actually used to build the companies on this site. Tell us where you're starting and what you want to be able to do.",
    company: "maby-academy",
    companyName: "Maby Academy",
    accent: "#D6B35A",
    eyebrow: "Maby Academy",
    steps: [
      {
        id: "want",
        question: "What do you want to be able to do?",
        helper: "Pick the outcome, not the subject.",
        multi: true,
        options: [
          { value: "build", label: "Build products people pay for", votes: ["builder-track"] },
          { value: "earn", label: "Earn a skill-based income", votes: ["earn-track"] },
          { value: "crypto", label: "Understand crypto and web3", votes: ["crypto-track"] },
          { value: "business", label: "Run a business properly", votes: ["business-track"] },
          { value: "grow", label: "Grow spiritually and personally", votes: ["growth-track"] },
        ],
      },
      {
        id: "level",
        question: "Where are you starting from?",
        helper: "Complete beginners are the majority here.",
        options: [
          { value: "zero", label: "Absolute beginner" },
          { value: "some", label: "I've dabbled" },
          { value: "working", label: "I work in this already", hint: "Levelling up" },
        ],
      },
      {
        id: "time",
        question: "How much time can you actually give it?",
        helper: "Honest answers make for plans you'll finish.",
        options: [
          { value: "few", label: "A few hours a week" },
          { value: "evenings", label: "Most evenings" },
          { value: "fulltime", label: "This is my main focus" },
        ],
      },
    ],
    outcomes: [
      {
        key: "builder-track",
        title: "The builder track",
        summary:
          "Learn to build and ship real products — the same stack used for Surlink, Ttip and the rest. Web, mobile, and the thinking behind what to build in the first place.",
        steps: [
          "Fundamentals: how software actually gets made",
          "Build alongside real project walkthroughs",
          "Ship something small and real",
          "Learn what separates a demo from a product",
        ],
      },
      {
        key: "earn-track",
        title: "The earning track",
        summary:
          "Skills that convert to income fastest, and how to actually get paid for them — pricing, clients, delivery.",
        steps: [
          "Pick a skill with real demand",
          "Get to competence, not just awareness",
          "Learn to find and close clients",
          "Deliver, get paid, repeat",
        ],
      },
      {
        key: "crypto-track",
        title: "The crypto track",
        summary:
          "Crypto and web3 from first principles — how it works, how people actually make and lose money, and how to think about risk before you take any.",
        steps: [
          "Fundamentals: what a blockchain actually is",
          "Wallets, custody and staying safe",
          "How to research rather than follow",
          "Building on-chain, if that's where you're headed",
        ],
        note: "Education only. Nothing in the Academy is financial advice.",
      },
      {
        key: "business-track",
        title: "The business track",
        summary:
          "Running something properly — strategy, structure, money, and the decisions that quietly determine whether a business survives its second year.",
        steps: [
          "Find and validate a real problem",
          "Structure, pricing and unit economics",
          "Getting customers without burning money",
          "Building something that runs without you",
        ],
      },
      {
        key: "growth-track",
        title: "The growth track",
        summary:
          "Faith, discipline and personal growth. The part most business education skips and most builders eventually wish they hadn't.",
        steps: [
          "Foundation: why you're building at all",
          "Discipline and consistency in practice",
          "Community — growing alongside people",
          "Sustaining it over years, not months",
        ],
      },
    ],
    fallbackOutcome: "builder-track",
    cta: { label: "Visit Maby Academy", href: "https://mabyacademy.site" },
  },
];

export function findPath(slug: string) {
  return guidedPaths.find((p) => p.slug === slug) ?? null;
}

/** The guided path that routes into a given company, if there is one. */
export function findPathForCompany(companySlug: string) {
  return guidedPaths.find((p) => p.company === companySlug) ?? null;
}

/** Tally the votes from a set of answers and pick the winning outcome. */
export function resolveOutcome(path: GuidedPath, answers: Record<string, string[]>) {
  const tally = new Map<string, number>();

  for (const step of path.steps) {
    for (const value of answers[step.id] ?? []) {
      const option = step.options.find((o) => o.value === value);
      for (const vote of option?.votes ?? []) {
        tally.set(vote, (tally.get(vote) ?? 0) + 1);
      }
    }
  }

  const winner = [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  return (
    path.outcomes.find((o) => o.key === winner) ??
    path.outcomes.find((o) => o.key === path.fallbackOutcome) ??
    path.outcomes[0]
  );
}
