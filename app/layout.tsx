import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "FitCoach Pro - Client Progress Tracking",
  description: "Track and visualize your client's fitness journey",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`h-full min-h-screen flex flex-col bg-background text-foreground font-sans ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <Providers>
          <Suspense fallback={null}>
            <main className="flex flex-1 h-full">{children}</main> {/* Flex-1 ensures this fills remaining height */}
          </Suspense>
        </Providers>
        <Analytics /> {/* Placed outside main, typically at bottom for tracking */}
      </body>
    </html>
  );
}