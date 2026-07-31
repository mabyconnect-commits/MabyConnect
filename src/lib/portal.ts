/* ============================================================
   Client portal — workspace data.

   Workspaces are keyed by id and resolved after a successful sign in
   (see src/lib/portal-auth.ts). The demo workspace ships so the portal
   can be toured; real client workspaces are added to `workspaces`, or
   fetched from a database once there are enough of them to justify one.
   ============================================================ */

/** The code shown on the sign-in screen so anyone can tour the portal. */
export const DEMO_ACCESS_CODE = "MABY-DEMO";
export const DEMO_WORKSPACE_ID = "demo";

export type Milestone = {
  name: string;
  phase: string;
  status: "done" | "active" | "upcoming";
  date: string;
  detail: string;
};

export type Deliverable = {
  name: string;
  type: string;
  size: string;
  date: string;
};

export type Invoice = {
  ref: string;
  amount: string;
  due: string;
  status: "Paid" | "Due" | "Scheduled";
};

export type Activity = {
  when: string;
  who: string;
  what: string;
};

export type Workspace = {
  id: string;
  /** Marks the sample workspace so the UI can label it honestly. */
  demo: boolean;
  client: string;
  project: string;
  engagement: string;
  started: string;
  launch: string;
  progress: number;
  lead: string;
  staging: string;
  milestones: Milestone[];
  deliverables: Deliverable[];
  invoices: Invoice[];
  activity: Activity[];
  nextCall: { label: string; date: string; time: string };
};

const demoWorkspace: Workspace = {
  id: DEMO_WORKSPACE_ID,
  demo: true,
  client: "Northwind Labs",
  project: "Northwind — Payments Platform",
  engagement: "Product Build",
  started: "12 June 2026",
  launch: "28 August 2026",
  progress: 62,
  lead: "Matthew Adeleye",
  staging: "https://staging.northwind.example",

  milestones: [
    {
      name: "Discovery & scope",
      phase: "01",
      status: "done",
      date: "12 Jun",
      detail: "Requirements locked, fixed quote signed.",
    },
    {
      name: "Architecture & data model",
      phase: "02",
      status: "done",
      date: "19 Jun",
      detail: "Ledger schema, service map and API contract approved.",
    },
    {
      name: "Core ledger & accounts",
      phase: "03",
      status: "done",
      date: "10 Jul",
      detail: "Double-entry ledger live on staging with reconciliation.",
    },
    {
      name: "Payment provider integration",
      phase: "03",
      status: "active",
      date: "In progress",
      detail: "Paystack and Stripe rails wired; card flows in review.",
    },
    {
      name: "Admin dashboard",
      phase: "03",
      status: "upcoming",
      date: "8 Aug",
      detail: "Operations console, roles and audit trail.",
    },
    {
      name: "Security review & launch",
      phase: "04",
      status: "upcoming",
      date: "28 Aug",
      detail: "Threat model, load test, production deploy.",
    },
  ],

  deliverables: [
    { name: "System architecture", type: "PDF", size: "2.4 MB", date: "19 Jun" },
    { name: "Ledger data model", type: "PDF", size: "1.1 MB", date: "19 Jun" },
    { name: "Design system v2", type: "Figma", size: "—", date: "26 Jun" },
    { name: "API contract (OpenAPI)", type: "YAML", size: "184 KB", date: "3 Jul" },
    { name: "Sprint 4 demo recording", type: "Video", size: "88 MB", date: "24 Jul" },
  ],

  invoices: [
    { ref: "INV-0412", amount: "$6,000", due: "12 Jun", status: "Paid" },
    { ref: "INV-0448", amount: "$6,000", due: "17 Jul", status: "Paid" },
    { ref: "INV-0473", amount: "$4,000", due: "21 Aug", status: "Scheduled" },
  ],

  activity: [
    { when: "2h ago", who: "Matthew", what: "Pushed card tokenisation to staging." },
    { when: "Yesterday", who: "Deborah", what: "Uploaded Sprint 4 demo recording." },
    { when: "2 days ago", who: "Matthew", what: "Closed 7 review comments on the ledger PR." },
    { when: "4 days ago", who: "You", what: "Approved the admin dashboard designs." },
    { when: "1 week ago", who: "Samuel", what: "Completed reconciliation test suite." },
  ],

  nextCall: {
    label: "Friday demo",
    date: "Friday, 7 August",
    time: "16:00 WAT",
  },
};

/** Every workspace the portal can serve, keyed by id. */
export const workspaces: Record<string, Workspace> = {
  [DEMO_WORKSPACE_ID]: demoWorkspace,
};

export function getWorkspace(id: string): Workspace | null {
  return workspaces[id] ?? null;
}
