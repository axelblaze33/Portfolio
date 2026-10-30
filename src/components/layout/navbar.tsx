"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CommandPaletteTrigger } from "@/components/layout/command-palette";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Monogram } from "@/components/ui/icons";
import { navItems, site, type NavId } from "@/data/site";

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<NavId>("home");

  useEffect(() => {
    if (!enabled) return;
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as NavId);
        }
      },
      // A thin band across the middle of the viewport decides the active section.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Mobile menu: lock scroll, close on Escape, keep focus inside.
  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = [
        toggle,
        ...panelRef.current.querySelectorAll<HTMLElement>("a, button"),
      ].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const solid = scrolled || open;

  // The mobile panel is a sibling of <header>, not a child: the header's
  // backdrop-filter would otherwise become the containing block for the
  // fixed panel and collapse it to the header's height.
  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid
            ? "border-b border-line bg-bg/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent"
        }`}
      >
        <nav aria-label="Primary" className="container-page flex h-[4.5rem] items-center justify-between gap-4">
          <Link
            href="/#home"
            className="flex items-center gap-2.5 font-medium tracking-tight"
            onClick={() => setOpen(false)}
          >
            <Monogram className="size-8 text-fg" />
            <span className="hidden text-[15px] sm:inline">{site.name}</span>
            <span className="sr-only sm:hidden">{site.name} — home</span>
          </Link>
  
          <ul className="hidden items-center gap-1 rounded-full border border-line bg-surface/60 p-1 backdrop-blur lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <Link
                    href={`/#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative z-10 block rounded-full px-4 py-2 text-sm transition-colors ${
                      isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {isActive && (
                    <m.span
                      layoutId="nav-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-line-strong bg-surface-strong"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
  
          <div className="flex items-center gap-2">
            <CommandPaletteTrigger />
            <ThemeToggle />
            <Link
              href="/#contact"
              className="hidden min-h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-accent-ink transition-transform hover:-translate-y-0.5 active:scale-95 sm:inline-flex"
            >
              Let&apos;s Talk
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-line text-fg lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

        <AnimatePresence>
          {open && (
            <m.div
              ref={panelRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-line bg-bg/95 backdrop-blur-xl lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="container-page flex flex-col py-6">
                {navItems.map((item, i) => (
                  <m.li
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05 }}
                    className="border-b border-line"
                  >
                    <Link
                      href={`/#${item.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === item.id ? "true" : undefined}
                      className="flex items-center justify-between py-4 text-2xl font-semibold tracking-tight sm:py-5 sm:text-3xl [@media(max-height:30rem)]:py-2.5 [@media(max-height:30rem)]:text-xl"
                    >
                      {item.label}
                      <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                    </Link>
                  </m.li>
                ))}
              </ul>
              <div className="container-page pb-10">
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent text-base font-medium text-accent-ink"
                >
                  Let&apos;s Talk <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </m.div>
          )}
        </AnimatePresence>
    </>
  );
}
