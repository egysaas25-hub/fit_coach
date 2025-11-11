"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Dumbbell,
  Apple,
  Camera,
  MessageSquare,
  FileText,
  Edit,
  MoreVertical,
} from "lucide-react";

export default function ClientDetail({ client }: { client: any }) {
  const [activeTab, setActiveTab] = useState("overview");

  const progressData = [
    { date: "Week 1", weight: 180, waist: 34 },
    { date: "Week 2", weight: 178, waist: 33.5 },
    { date: "Week 3", weight: 176, waist: 33 },
    { date: "Week 4", weight: 174, waist: 32.5 },
    { date: "Week 5", weight: 172, waist: 32 },
    { date: "Week 6", weight: 170, waist: 31.5 },
    { date: "Week 7", weight: 168, waist: 31 },
    { date: "Week 8", weight: 165, waist: 30.5 },
  ];

  const recentActivity = [
    { type: "workout", title: "Completed Upper Body", time: "2 hours ago", icon: Dumbbell },
    { type: "meal", title: "Logged Breakfast - 520 cal", time: "5 hours ago", icon: Apple },
    { type: "photo", title: "Uploaded Progress Photo", time: "1 day ago", icon: Camera },
    { type: "message", title: "Sent message to trainer", time: "2 days ago", icon: MessageSquare },
  ];

  const upcomingSessions = [
    { title: "Upper Body Strength", date: "Tomorrow", time: "9:00 AM", type: "Workout" },
    { title: "Check-in Call", date: "Feb 10", time: "2:00 PM", type: "Consultation" },
    { title: "Lower Body Strength", date: "Feb 11", time: "9:00 AM", type: "Workout" },
  ];

  const assignedPrograms = [
    { name: "12-Week Fat Loss Program", status: "In Progress", completion: 66, weeks: "8/12" },
    { name: "Custom Meal Plan - 1800 cal", status: "Active", completion: 78, adherence: "78%" },
  ];

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => window.history.back()}>
              ← Back
            </Button>
            <h1 className="text-3xl font-bold">Client Details</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </Button>
            <Button variant="outline" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Client Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={client.avatar} />
                  <AvatarFallback className="text-2xl">
                    {client.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">{client.name}</h2>
                      <Badge variant={client.status === "active" ? "default" : "secondary"}>
                        {client.status}
                      </Badge>
                      <Badge variant="outline">{client.id}</Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">
                      Goal: {client.goal} • Round {client.currentRound}/{client.totalRounds}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {client.joinDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>
                        Trainer: <strong>{client.trainer}</strong> ({client.trainerTag})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>
                        Subscription: <strong>{client.subscription}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit Client
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Weight Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{client.stats.currentWeight} lbs</div>
              <p className="text-sm text-primary">
                -{client.stats.startWeight - client.stats.currentWeight} lbs from start
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                Goal: {client.stats.goalWeight} lbs ({client.stats.currentWeight - client.stats.goalWeight} lbs to go)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Workout Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{client.adherence.workout}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${client.adherence.workout}%` }} 
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {client.stats.workoutsCompleted} workouts completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Nutrition Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{client.adherence.nutrition}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${client.adherence.nutrition}%` }} 
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{client.stats.mealsLogged} meals logged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Next Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{client.nextBilling}</div>
              <p className="text-sm text-muted-foreground mt-2">{client.subscription}</p>
              <Button variant="link" className="p-0 h-auto text-xs mt-2">
                Manage Subscription
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, i) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingSessions.map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="text-sm font-medium">{session.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.date} at {session.time}
                          </p>
                        </div>
                        <Badge variant="secondary">{session.type}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assigned Programs */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignedPrograms.map((program, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div>
                        <p className="font-medium">{program.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={program.status === "In Progress" ? "default" : "secondary"}>
                            {program.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {program.weeks || program.adherence}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{program.completion}%</span>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${program.completion}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-medium mb-2">Weight Progress</h3>
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Weight chart visualization</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Measurements</h3>
                      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Measurements chart visualization</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Progress Photos</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Camera className="w-8 h-8 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Program Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Active Programs</h3>
                    <Button size="sm">Assign Program</Button>
                  </div>
                  <div className="border rounded-lg divide-y">
                    {assignedPrograms.map((program, i) => (
                      <div key={i} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{program.name}</p>
                          <p className="text-sm text-muted-foreground">{program.status}</p>
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Client Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => {
                    const Icon = activity.icon;
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Trainer Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add a note..." 
                      className="flex-1 px-3 py-2 border rounded-md text-sm"
                    />
                    <Button size="sm">Add Note</Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { 
                        author: "Mike Johnson", 
                        time: "2 days ago", 
                        content: "Client is making good progress. Slight plateau in weight loss but measurements are improving." 
                      },
                      { 
                        author: "Mike Johnson", 
                        time: "1 week ago", 
                        content: "Increased protein intake to support muscle retention during fat loss phase." 
                      },
                    ].map((note, i) => (
                      <div key={i} className="p-3 rounded-lg border border-border">
                        <div className="flex justify-between">
                          <p className="font-medium">{note.author}</p>
                          <p className="text-sm text-muted-foreground">{note.time}</p>
                        </div>
                        <p className="mt-2 text-sm">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}