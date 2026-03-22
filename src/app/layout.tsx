import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Aivee Editorial OS",
  description: "Mission control for AEC, BIM, ISO 19650, and AI editorial workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plexMono.variable} h-full bg-[var(--bg)] antialiased`}
    >
      <body className="min-h-full bg-[radial-gradient(circle_at_top,#162131_0%,#09111d_36%,#04070d_100%)] text-[var(--text-primary)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
