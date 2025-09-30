import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Calendar } from "lucide-react"
import Image from "next/image"

export default function ProgressPhotosPage() {
  const photos = [
    { date: "Mar 30, 2024", label: "Week 12", images: 3 },
    { date: "Mar 15, 2024", label: "Week 10", images: 3 },
    { date: "Mar 1, 2024", label: "Week 8", images: 3 },
    { date: "Feb 15, 2024", label: "Week 6", images: 3 },
    { date: "Feb 1, 2024", label: "Week 4", images: 3 },
    { date: "Jan 15, 2024", label: "Week 2", images: 3 },
    { date: "Jan 1, 2024", label: "Starting", images: 3 },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance mb-2">Progress Photos</h1>
            <p className="text-muted-foreground">Visual documentation of your fitness journey</p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Photos
          </Button>
        </div>

        <div className="space-y-6">
          {photos.map((photoSet, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{photoSet.label}</CardTitle>
                      <p className="text-sm text-muted-foreground">{photoSet.date}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{photoSet.images} photos</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                    <Image src="/fitness-progress-front-view.png" alt="Front view" fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white text-sm font-medium">Front</p>
                    </div>
                  </div>

                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                    <Image src="/fitness-progress-side-view.png" alt="Side view" fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white text-sm font-medium">Side</p>
                    </div>
                  </div>

                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                    <Image src="/fitness-progress-back-view.jpg" alt="Back view" fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white text-sm font-medium">Back</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
