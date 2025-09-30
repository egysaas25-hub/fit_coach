"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User } from "lucide-react"

export function AppointmentScheduling() {
  const appointments = [
    {
      date: "Nov 25, 2024",
      time: "9:00 AM",
      client: "Sarah Miller",
      type: "Initial Consultation",
      status: "Confirmed",
    },
    {
      date: "Nov 25, 2024",
      time: "11:00 AM",
      client: "John Davis",
      type: "Follow-up Session",
      status: "Confirmed",
    },
    {
      date: "Nov 26, 2024",
      time: "2:00 PM",
      client: "Emily Carter",
      type: "Progress Review",
      status: "Pending",
    },
    {
      date: "Nov 27, 2024",
      time: "10:00 AM",
      client: "Michael Brown",
      type: "Nutrition Planning",
      status: "Confirmed",
    },
    {
      date: "Nov 27, 2024",
      time: "3:00 PM",
      client: "Lisa Anderson",
      type: "Workout Planning",
      status: "Cancelled",
    },
  ]

  const upcomingAppointments = [
    { client: "Sarah Miller", time: "Today at 9:00 AM", type: "Initial Consultation" },
    { client: "John Davis", time: "Today at 11:00 AM", type: "Follow-up Session" },
    { client: "Emily Carter", time: "Tomorrow at 2:00 PM", type: "Progress Review" },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointment Scheduling</h1>
          <p className="text-muted-foreground mt-1">Manage client appointments and consultations</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">New Appointment</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Appointments</p>
              <p className="text-2xl font-bold text-foreground">5</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold text-foreground">18</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <User className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-foreground">3</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* All Scheduled Appointments */}
        <Card className="p-6 bg-card border-border lg:col-span-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">All Scheduled Appointments</h3>
              <p className="text-sm text-muted-foreground">View and manage all appointments</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm text-foreground">{apt.date}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{apt.time}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{apt.client}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{apt.type}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            apt.status === "Confirmed"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : apt.status === "Pending"
                                ? "bg-amber-500/10 text-amber-500"
                                : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" className="text-emerald-500 hover:text-emerald-400">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Upcoming</h3>
              <p className="text-sm text-muted-foreground">Next appointments</p>
            </div>

            <div className="space-y-3">
              {upcomingAppointments.map((apt, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{apt.client}</p>
                      <p className="text-xs text-muted-foreground mt-1">{apt.time}</p>
                      <p className="text-xs text-muted-foreground">{apt.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Book New Appointment Form */}
      <Card className="p-6 bg-card border-border">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Book New Appointment</h3>
            <p className="text-sm text-muted-foreground">Schedule a new client appointment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="client-select">Client</Label>
              <Select>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Miller</SelectItem>
                  <SelectItem value="john">John Davis</SelectItem>
                  <SelectItem value="emily">Emily Carter</SelectItem>
                  <SelectItem value="michael">Michael Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apt-type">Appointment Type</Label>
              <Select>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Initial Consultation</SelectItem>
                  <SelectItem value="followup">Follow-up Session</SelectItem>
                  <SelectItem value="review">Progress Review</SelectItem>
                  <SelectItem value="nutrition">Nutrition Planning</SelectItem>
                  <SelectItem value="workout">Workout Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apt-date">Date</Label>
              <Input id="apt-date" type="date" className="bg-background border-border" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apt-time">Time</Label>
              <Input id="apt-time" type="time" className="bg-background border-border" />
            </div>
          </div>

          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Schedule Appointment</Button>
        </div>
      </Card>
    </div>
  )
}
