import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"

export default function MeasurementsPage() {
  const measurements = [
    { label: "Neck", value: "14.5", unit: "in" },
    { label: "Shoulders", value: "42", unit: "in" },
    { label: "Chest", value: "36", unit: "in" },
    { label: "Waist", value: "28", unit: "in" },
    { label: "Hips", value: "38", unit: "in" },
    { label: "Left Bicep", value: "12.5", unit: "in" },
    { label: "Right Bicep", value: "12.5", unit: "in" },
    { label: "Left Thigh", value: "22", unit: "in" },
    { label: "Right Thigh", value: "22", unit: "in" },
    { label: "Left Calf", value: "14", unit: "in" },
    { label: "Right Calf", value: "14", unit: "in" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Body Measurements</h1>
          <p className="text-muted-foreground">Track detailed body measurements for comprehensive progress</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Body Diagram - Front View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[3/4] bg-muted/30 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 200 300" className="w-full h-full p-8">
                  {/* Head */}
                  <circle
                    cx="100"
                    cy="30"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />

                  {/* Neck */}
                  <line
                    x1="100"
                    y1="50"
                    x2="100"
                    y2="65"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />

                  {/* Shoulders */}
                  <line
                    x1="70"
                    y1="65"
                    x2="130"
                    y2="65"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />

                  {/* Torso */}
                  <line
                    x1="70"
                    y1="65"
                    x2="75"
                    y2="120"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                  <line
                    x1="130"
                    y1="65"
                    x2="125"
                    y2="120"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />

                  {/* Waist */}
                  <line
                    x1="75"
                    y1="120"
                    x2="125"
                    y2="120"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />

                  {/* Hips */}
                  <line
                    x1="75"
                    y1="120"
                    x2="70"
                    y2="150"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                  <line
                    x1="125"
                    y1="120"
                    x2="130"
                    y2="150"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />

                  {/* Arms */}
                  <line
                    x1="70"
                    y1="65"
                    x2="50"
                    y2="130"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                  <line
                    x1="130"
                    y1="65"
                    x2="150"
                    y2="130"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />

                  {/* Legs */}
                  <line
                    x1="70"
                    y1="150"
                    x2="75"
                    y2="250"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                  <line
                    x1="130"
                    y1="150"
                    x2="125"
                    y2="250"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Body Diagram - Back View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[3/4] bg-muted/30 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 200 300" className="w-full h-full p-8">
                  {/* Head */}
                  <circle
                    cx="100"
                    cy="30"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />

                  {/* Neck */}
                  <line
                    x1="100"
                    y1="50"
                    x2="100"
                    y2="65"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />

                  {/* Shoulders */}
                  <line
                    x1="70"
                    y1="65"
                    x2="130"
                    y2="65"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />

                  {/* Back */}
                  <line
                    x1="70"
                    y1="65"
                    x2="75"
                    y2="120"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />
                  <line
                    x1="130"
                    y1="65"
                    x2="125"
                    y2="120"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />

                  {/* Waist */}
                  <line
                    x1="75"
                    y1="120"
                    x2="125"
                    y2="120"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />

                  {/* Hips */}
                  <line
                    x1="75"
                    y1="120"
                    x2="70"
                    y2="150"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />
                  <line
                    x1="125"
                    y1="120"
                    x2="130"
                    y2="150"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />

                  {/* Arms */}
                  <line
                    x1="70"
                    y1="65"
                    x2="50"
                    y2="130"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />
                  <line
                    x1="130"
                    y1="65"
                    x2="150"
                    y2="130"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />

                  {/* Legs */}
                  <line
                    x1="70"
                    y1="150"
                    x2="75"
                    y2="250"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />
                  <line
                    x1="130"
                    y1="150"
                    x2="125"
                    y2="250"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Measurement Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {measurements.map((measurement, i) => (
                <div key={i} className="space-y-2">
                  <Label htmlFor={measurement.label.toLowerCase().replace(" ", "-")}>{measurement.label}</Label>
                  <div className="flex gap-2">
                    <Input
                      id={measurement.label.toLowerCase().replace(" ", "-")}
                      type="number"
                      placeholder={measurement.value}
                      defaultValue={measurement.value}
                      className="bg-background"
                    />
                    <div className="w-16 flex items-center justify-center text-sm text-muted-foreground border border-border rounded-md bg-muted/50">
                      {measurement.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Button className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save Measurements
              </Button>
              <Button variant="outline" className="bg-transparent">
                View History
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
