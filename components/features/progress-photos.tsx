import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const photos = [
  { id: 1, url: "/fitness-progress-photo-front-view.jpg" },
  { id: 2, url: "/fitness-progress-photo-side-view.jpg" },
  { id: 3, url: "/fitness-progress-photo-back-view.jpg" },
  { id: 4, url: "/fitness-progress-photo-front-view-latest.jpg" },
]

export function ProgressPhotos() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Progress Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-[3/4] rounded-lg overflow-hidden bg-muted hover:opacity-90 transition-opacity cursor-pointer"
            >
              <img
                src={photo.url || "/placeholder.svg"}
                alt={`Progress photo ${photo.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
