import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Geist, Geist_Mono } from "next/font/google";
import { BackToTop } from "@/components/layout/back-to-top";
import { Background } from "@/components/layout/background";
import { CommandPalette } from "@/components/layout/command-palette";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { DevChecklist } from "@/components/layout/dev-checklist";
import { Footer } from "@/components/layout/footer";
import { MotionProvider } from "@/components/layout/motion-provider";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { themeScript } from "@/components/layout/theme-toggle";
import { site } from "@/data/site";
import { activeSocials, resumeHref } from "@/lib/profile";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const title = `${site.name} — ${site.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  keywords: [
    site.name,
    "Software Engineer",
    "Angular Developer",
    "TypeScript",
    "Frontend Developer",
    "Pune",
    "Portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08070a" },
    { media: "(prefers-color-scheme: light)", color: "#f8f5f0" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${chakraPetch.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Background />
          <ScrollProgress />
          <Navbar />
          <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <CommandPalette resumeHref={resumeHref} socials={activeSocials} />
          <CustomCursor />
        </MotionProvider>
        <DevChecklist />
      </body>
    </html>
  );
}
