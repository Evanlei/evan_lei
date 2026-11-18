import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { profile } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: profile.name,
  description: profile.description,
  openGraph: {
    type: "website",
    title: profile.name,
    description: "CS at Columbia. Climb the mountain to see what I've built.",
    siteName: profile.name,
  },
  twitter: { card: "summary_large_image", title: profile.name },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#121411" },
  ],
};

// Picks climb or list view before first paint so cards never flash in the wrong layout.
const prePaint = `(function(){var v=null;try{v=localStorage.getItem('evan-view')}catch(e){}
var c=v?v==='climb':!matchMedia('(prefers-reduced-motion: reduce)').matches;
var r=document.documentElement;if(c)r.classList.add('climb');r.classList.add('instant');})();`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  affiliation: { "@type": "CollegeOrUniversity", name: "Columbia University" },
  sameAs: [profile.github, profile.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The pre-paint script and the clock add classes and data attributes to <html>.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaint }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={figtree.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
