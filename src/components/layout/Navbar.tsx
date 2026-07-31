"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { nav, primaryNav, socials, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import Wordmark from "@/components/ui/Wordmark";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    // Close the overlay menu whenever navigation changes the route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-all duration-500",
          scrolled || open ? "py-3" : "py-5",
          // Once the page scrolls, back the bar so content passing underneath
          // never collides with the wordmark.
          scrolled && !open && "border-b border-line bg-ink/80 backdrop-blur-xl",
        )}
      >
        <div
          className={cn(
            "container-x flex items-center justify-between transition-all duration-500",
          )}
        >
          <Link
            href="/"
            className="group relative z-[95] flex items-center gap-2.5"
            aria-label="Maby Connect — home"
          >
            <Logo className="h-7 w-7 transition-transform duration-500 group-hover:rotate-[-8deg]" />
            <Wordmark className="text-sm sm:text-base" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <div
              className={cn(
                "flex items-center gap-1 rounded-full border px-2 py-1.5 transition-all duration-500",
                scrolled ? "glass border-line" : "border-transparent",
              )}
            >
              {primaryNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
                      active ? "text-ink" : "text-white/60 hover:text-white",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden rounded-full border border-line-strong px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-ink md:inline-block"
            >
              Let&apos;s Connect
            </Link>

            {/* Menu toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative z-[95] flex h-10 w-10 items-center justify-center rounded-full border border-line-strong lg:hidden"
              data-cursor
            >
              <span className="relative flex h-3 w-4 flex-col justify-between">
                <motion.span
                  animate={open ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                  className="block h-px w-full bg-white"
                />
                <motion.span
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  className="block h-px w-full bg-white"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                  className="block h-px w-full bg-white"
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen overlay menu (mobile / tablet) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[85] bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-x flex h-full flex-col justify-center pt-24 pb-12">
              <nav className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{
                      delay: 0.08 + i * 0.04,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between border-b border-line py-4"
                    >
                      <span
                        className={cn(
                          "display text-[clamp(2rem,10vw,3.5rem)] transition-colors",
                          pathname === item.href
                            ? "text-white"
                            : "text-white/50 group-hover:text-white",
                        )}
                      >
                        {item.label}
                      </span>
                      <span className="font-mono text-xs text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 flex flex-wrap gap-x-6 gap-y-2"
              >
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/50 transition-colors hover:text-gold"
                  >
                    {s.label}
                  </a>
                ))}
              </motion.div>
              <p className="mt-6 text-sm text-faint">{site.email}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
