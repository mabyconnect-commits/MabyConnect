"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { nav, socials, site } from "@/lib/site";
import ArrowLink from "@/components/ui/ArrowLink";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink">
      {/* Oversized CTA */}
      <div className="container-x py-24 md:py-32">
        <p className="eyebrow mb-6">Let&apos;s build</p>
        <Link href="/contact" className="group block">
          <h2 className="display text-[clamp(2.5rem,11vw,9rem)] leading-[0.9] text-white">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                Something
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="block text-gradient-gold"
              >
                Great Together
              </motion.span>
            </span>
          </h2>
          <span className="mt-8 inline-flex items-center gap-2 text-lg text-white/60 transition-colors group-hover:text-white">
            {site.email}
            <span className="text-gold">↗</span>
          </span>
        </Link>
      </div>

      <div className="hairline" />

      <div className="container-x grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <Logo className="h-6 w-6" />
            <span className="flex items-baseline gap-1.5">
              <span className="display text-base text-white">Maby</span>
              <span className="display text-base text-white/60">Connect</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
            {site.tagline}
          </p>
          <p className="mt-4 text-xs text-faint">{site.location}</p>
        </div>

        <div>
          <p className="eyebrow mb-5">Explore</p>
          <ul className="space-y-2.5">
            {nav.slice(1, 6).map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5">More</p>
          <ul className="space-y-2.5">
            {nav.slice(6).map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-5">Connect</p>
          <ul className="space-y-2.5">
            {socials.map((s) => (
              <li key={s.label}>
                <ArrowLink href={s.href} external>
                  {s.label}
                </ArrowLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hairline" />

      <div className="container-x flex flex-col items-start justify-between gap-3 py-8 text-xs text-faint md:flex-row md:items-center">
        <p>
          © {new Date().getFullYear()} {site.person}. All rights reserved.
        </p>
        <p className="font-mono tracking-wider">
          Built from foundation, not ambition.
        </p>
      </div>
    </footer>
  );
}
