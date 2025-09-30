"use client"

import { useState } from "react"
import { Upload, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const progressPhotos = [
  {
    id: 1,
    url: "/fitness-progress-photo-front-view.jpg",
    label: "Front View - July 5, 2024",
  },
  {
    id: 2,
    url: "/fitness-progress-photo-side-view.jpg",
    label: "Front View - July 5, 2024",
  },
]

export function ProgressPhotosComparison() {
  const [selectedClient, setSelectedClient] = useState("sarah-miller")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance mb-2">Client Progress Photos</h1>
        <p className="text-muted-foreground">Compare progress photos side-by-side to track transformation.</p>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Select Client</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sarah-miller">Sarah Miller</SelectItem>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="bg-card border-2 border-dashed border-border">
        <CardHeader>
          <CardTitle>Upload New Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-medium mb-2">Drag and drop photos here</h3>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <Button>Browse Files</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Compare Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {progressPhotos.map((photo) => (
              <div key={photo.id} className="space-y-3">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-accent">
                  <img src={photo.url || "/placeholder.svg"} alt={photo.label} className="w-full h-full object-cover" />
                </div>
                <p className="text-center text-sm font-medium">{photo.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Previous</span>
            <Button size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">Next</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
