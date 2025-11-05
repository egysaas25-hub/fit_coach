import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ClientProfile() {
  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rQHCHp8lFz6ZK2e6cBeLtsBmgsUPdv.png"
              alt="Sarah Miller"
            />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mb-1">Sarah Miller</h2>
          <p className="text-sm text-muted-foreground">Client ID: 12345</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Starting Weight</p>
                <p className="text-lg font-semibold">160 lbs</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Current Weight</p>
                <p className="text-lg font-semibold">155 lbs</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Goal Weight</p>
                <p className="text-lg font-semibold">145 lbs</p>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Total Workouts</p>
                <p className="text-lg font-semibold">30</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Nutrition Plan</p>
                <p className="text-lg font-semibold">Custom Plan</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="mt-4">
            <p className="text-sm text-muted-foreground">Workout history and plans will appear here.</p>
          </TabsContent>

          <TabsContent value="nutrition" className="mt-4">
            <p className="text-sm text-muted-foreground">Nutrition plans and tracking will appear here.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
