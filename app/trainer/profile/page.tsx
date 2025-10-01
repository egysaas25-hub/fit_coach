import { TrainerSidebar } from "@/components/trainer-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Award, Users, Calendar } from "lucide-react"

export default function TrainerProfilePage() {
  return (
    <div className="flex min-h-screen bg-background">
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance mb-2">Trainer Profile</h1>
          <p className="text-muted-foreground">Manage your professional information</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Mike Johnson" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">Mike Johnson</h3>
                    <p className="text-sm text-muted-foreground">Certified Personal Trainer</p>
                  </div>
                  <Button>Edit Profile</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">mike.johnson@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 987-6543</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Total Clients</p>
                      <p className="text-sm text-muted-foreground">28 Active Clients</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">January 2023</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Certified personal trainer with over 8 years of experience helping clients achieve their fitness
                  goals. Specializing in strength training, weight loss, and sports performance. Passionate about
                  creating personalized workout programs that deliver real results while keeping clients motivated and
                  engaged.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Award className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">NASM Certified Personal Trainer (CPT)</p>
                    <p className="text-xs text-muted-foreground">National Academy of Sports Medicine</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Award className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">ACE Fitness Nutrition Specialist</p>
                    <p className="text-xs text-muted-foreground">American Council on Exercise</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Award className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">ISSA Strength & Conditioning</p>
                    <p className="text-xs text-muted-foreground">International Sports Sciences Association</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge className="mr-2">Weight Loss</Badge>
                <Badge className="mr-2">Strength Training</Badge>
                <Badge className="mr-2">Sports Performance</Badge>
                <Badge className="mr-2">Nutrition Coaching</Badge>
                <Badge className="mr-2">Injury Prevention</Badge>
                <Badge className="mr-2">Functional Training</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Sessions</span>
                  <span className="text-lg font-bold">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Client Success Rate</span>
                  <span className="text-lg font-bold">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Client Rating</span>
                  <span className="text-lg font-bold">4.9/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Years Experience</span>
                  <span className="text-lg font-bold">8+</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Notification Preferences
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Availability Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Payment Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
