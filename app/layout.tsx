import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
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
        className="h-full bg-background text-foreground font-sans"
      >
        <ErrorBoundary level="root">
          <Providers>
            <div className="fixed top-3 right-4 z-50 flex gap-2">
              <a href="/reports" aria-label="Export Report" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-muted">
                <span className="text-sm">Export</span>
              </a>
              <a href="/admin/communication/templates" aria-label="Broadcast" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-muted">
                <span className="text-sm">Broadcast</span>
              </a>
              <a href="/notifications" aria-label="Notifications" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-muted">
                <Bell className="w-4 h-4" />
                <span className="text-sm">Notifications</span>
              </a>
            </div>
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </Providers>
          <Analytics />
        </ErrorBoundary>
      </body>
    </html>
  );
}


