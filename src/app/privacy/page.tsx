import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How the contact form on ${site.name}'s portfolio handles your information.`,
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "What is collected",
    body: "When you use the contact form, you provide your name, email address, a subject and a message. Nothing else is collected through the form. The site does not use analytics, tracking scripts or advertising cookies.",
  },
  {
    title: "How it is used",
    body: `Your message is sent by email directly to ${site.name}'s inbox to be read and answered. Your email address is set as the reply-to address so a reply goes straight back to you. Your details are not used for marketing and are not sold or shared with anyone else.`,
  },
  {
    title: "Where it is processed",
    body: "This website is hosted on Vercel. Form submissions are delivered by Resend, a transactional email provider, and arrive in a personal email inbox. These providers process the data only to deliver the message. The website itself does not store submissions in a database.",
  },
  {
    title: "Abuse prevention",
    body: "To prevent spam, the server temporarily keeps the IP address of each submission in memory to apply a rate limit. These records are discarded automatically and are not linked to your message.",
  },
  {
    title: "Theme preference",
    body: "If you switch between light and dark mode, your choice is saved in your browser's local storage on your device only. It is never sent to the server.",
  },
  {
    title: "Your choices",
    body: "You can ask for any message you have sent to be deleted from the inbox by replying to the conversation or sending a new message with that request.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="pt-28 pb-16 sm:pt-40">
      <div className="container-page max-w-3xl">
        <Link href="/" className="-my-2 inline-flex min-h-10 items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg">
          <ArrowLeft className="size-4" aria-hidden="true" /> Home
        </Link>
        <h1 className="mt-8 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">Privacy notice</h1>
        <p className="mt-6 text-lg leading-relaxed text-fg-muted">
          This is a personal portfolio. Here is exactly what happens to the information you share through it.
        </p>
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-xl font-semibold tracking-tight">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-fg-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
