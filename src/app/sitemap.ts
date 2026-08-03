import type { MetadataRoute } from "next";
import { site, nav } from "@/lib/site";
import { companies, articles } from "@/lib/data";
import { capabilities } from "@/lib/agency";
import { guidedPaths } from "@/lib/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = nav.map((n) => ({
    url: `${site.url}${n.href === "/" ? "" : n.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: n.href === "/" ? 1 : 0.8,
  }));

  const companyRoutes = companies.map((c) => ({
    url: `${site.url}/companies/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${site.url}/articles/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  // The agency's own funnel pages. The client portal is deliberately
  // excluded — it's noindex.
  const agencyRoutes = ["/agency/start", "/agency/book"].map((href) => ({
    url: `${site.url}${href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const capabilityRoutes = capabilities.map((c) => ({
    url: `${site.url}/agency/capabilities/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const pathRoutes = [
    { url: `${site.url}/start`, priority: 0.9 },
    ...guidedPaths.map((p) => ({ url: `${site.url}/start/${p.slug}`, priority: 0.8 })),
  ].map((r) => ({
    ...r,
    lastModified: now,
    changeFrequency: "monthly" as const,
  }));

  return [
    ...staticRoutes,
    ...pathRoutes,
    ...agencyRoutes,
    ...capabilityRoutes,
    ...companyRoutes,
    ...articleRoutes,
  ];
}
