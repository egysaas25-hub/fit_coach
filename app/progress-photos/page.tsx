import { Header } from "@/components/header"
import { ProgressPhotosComparison } from "@/components/progress-photos-comparison"

export default function ProgressPhotosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 lg:px-8">
        <ProgressPhotosComparison />
      </main>
    </div>
  )
}
