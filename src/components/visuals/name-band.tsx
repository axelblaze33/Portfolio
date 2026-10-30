"use client";

import { m, useScroll, useTransform } from "motion/react";
import { Fragment, useRef } from "react";
import { site } from "@/data/site";

const roles = site.title.split("|").map((s) => s.trim());

function Row({ items, className }: { items: string[]; className: string }) {
  // Repeat enough times that the row always overflows the viewport while it slides.
  const repeated = [...items, ...items, ...items];
  return (
    <p className={`flex w-max items-center gap-[0.35em] whitespace-nowrap ${className}`}>
      {repeated.map((item, n) => (
        <Fragment key={n}>
          <span>{item}</span>
          <span className="text-[0.4em] text-accent">✦</span>
        </Fragment>
      ))}
    </p>
  );
}

/** Oversized name and title that slide in opposite directions as the page scrolls. */
export function NameBand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const forward = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const backward = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);

  return (
    <div ref={ref} aria-hidden="true" className="relative overflow-hidden py-2 select-none sm:py-6">
      <m.div style={{ x: forward }}>
        <Row
          items={[site.name]}
          className="text-outline text-[clamp(3.5rem,12vw,11rem)] leading-[1] font-semibold tracking-[-0.05em] uppercase"
        />
      </m.div>
      <m.div style={{ x: backward }} className="-mt-[0.1em]">
        <Row
          items={roles}
          className="text-gradient pb-[0.15em] font-serif text-[clamp(2.75rem,9vw,8.5rem)] leading-[1.05] tracking-[-0.02em] italic"
        />
      </m.div>
    </div>
  );
}
