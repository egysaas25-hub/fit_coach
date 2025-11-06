import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const measurements = [
  { label: "Waist", value: "32 inches" },
  { label: "Hips", value: "38 inches" },
  { label: "Thighs", value: "22 inches" },
  { label: "Arms", value: "14 inches" },
  { label: "Chest", value: "40 inches" },
  { label: "Shoulders", value: "44 inches" },
]

export function Measurements() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Measurements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {measurements.map((measurement) => (
            <div key={measurement.label}>
              <p className="text-xs text-muted-foreground mb-1">{measurement.label}</p>
              <p className="text-lg font-semibold">{measurement.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
