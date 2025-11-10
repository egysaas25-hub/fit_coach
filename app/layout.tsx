import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600","700"], variable: "--font-poppins" });
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
        className={`h-full bg-background text-foreground font-sans ${inter.variable} ${poppins.variable}`}
      >
        <Providers>
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}


