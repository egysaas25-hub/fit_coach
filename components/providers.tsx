"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
    },
  }));

  const pathname = usePathname();
  useEffect(() => {
    try {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({ event: 'pageview', path: pathname });
    } catch {}
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        {children}
        <Toaster />
      </SidebarProvider>
    </QueryClientProvider>
  );
}