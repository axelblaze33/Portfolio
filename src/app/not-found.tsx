import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pt-28 pb-16">
      <div className="container-page">
        <div className="glass mx-auto max-w-xl overflow-hidden rounded-2xl font-mono text-sm shadow-card">
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
            <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
            <span className="size-2.5 rounded-full bg-[#28c840]/80" />
            <span className="ml-2 text-xs text-fg-subtle">~/portfolio — zsh</span>
          </div>
          <div className="space-y-1.5 p-5 leading-relaxed">
            <p>
              <span className="text-accent-3">➜</span> <span className="text-accent">~</span> cd ./this-page
            </p>
            <p className="text-[#f87171]">error 404: route not found</p>
            <p className="text-fg-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
            <p className="caret pt-2">
              <span className="text-accent-3">➜</span> <span className="text-accent">~</span>{" "}
            </p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Lost in the universe.</h1>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/">
              <ArrowLeft className="size-4" aria-hidden="true" /> Back to home
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
