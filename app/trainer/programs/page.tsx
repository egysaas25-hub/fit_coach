"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"


export default function ProgramsPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading">Training Programs</h1>
          <p className="text-muted-foreground mt-2">Create and manage workout programs</p>
        </div>
        <Button onClick={() => router.push("/programs/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Create Program
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { name: "Beginner Strength", clients: 24, duration: "8 weeks" },
          { name: "Advanced Hypertrophy", clients: 18, duration: "12 weeks" },
          { name: "Fat Loss Program", clients: 32, duration: "6 weeks" },
        ].map((program) => (
          <div key={program.name} className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-2">{program.name}</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>Duration: {program.duration}</div>
              <div>Active Clients: {program.clients}</div>
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}
