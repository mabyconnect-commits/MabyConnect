import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PortalSignIn from "@/components/agency/PortalSignIn";
import PortalDashboard from "@/components/agency/PortalDashboard";
import { DEMO_ACCESS_CODE, getWorkspace } from "@/lib/portal";
import { demoEnabled, readSession, sessionCookieName } from "@/lib/portal-auth";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Client Portal — Maby Agency",
  description:
    "Track your build, download deliverables, review invoices and see exactly where your project stands.",
  alternates: { canonical: "/agency/portal" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Client Portal — Maby Agency",
    description: "Track your build, download deliverables and review invoices.",
    url: `${site.url}/agency/portal`,
  },
};

/** Session state is read per request, so this page can't be prerendered. */
export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const store = await cookies();
  const session = readSession(store.get(sessionCookieName())?.value);
  const workspace = session ? getWorkspace(session.workspace) : null;

  return (
    <div className="relative min-h-dvh">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -top-1/4 left-1/2 h-[50vw] w-[50vw] -translate-x-1/2 rounded-full bg-gold/[0.05] blur-[130px]" />
      </div>

      <div className="container-x pt-36 pb-32 md:pt-44">
        <Link
          href="/agency"
          className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Maby Agency
        </Link>

        <div className="mt-12">
          {workspace ? (
            <PortalDashboard workspace={workspace} />
          ) : (
            <PortalSignIn demoCode={demoEnabled() ? DEMO_ACCESS_CODE : undefined} />
          )}
        </div>
      </div>
    </div>
  );
}
