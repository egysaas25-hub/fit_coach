"use client"

import { TrainerSidebar } from "@/components/layouts/trainer-layout"

export default function TrainerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <TrainerSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}