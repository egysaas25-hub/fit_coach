"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from 'react'
import { Calendar, Clock, User } from "lucide-react"
import { useAppointments, useCreateAppointment } from '@/lib/hooks/api/useAppointments'
export function AppointmentScheduling() {
  const { data, isLoading } = useAppointments({ limit: 50 })
  const { mutate: createAppointment, isPending } = useCreateAppointment()
  const appointments = data?.data || []
  const upcomingAppointments = appointments.slice(0, 3).map(a => ({ client: a.clientId, time: new Date(a.date).toLocaleString(), type: a.type }))

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
              <p className="text-2xl font-bold text-foreground">{isLoading ? '...' : appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}</p>
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
              <p className="text-2xl font-bold text-foreground">{isLoading ? '...' : appointments.length}</p>
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
              <p className="text-2xl font-bold text-foreground">{isLoading ? '...' : appointments.filter(a => a.status === 'scheduled').length}</p>
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
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm text-foreground">{new Date(apt.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(apt.date).toLocaleTimeString()}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{apt.clientId}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{apt.type}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          apt.status === 'scheduled' ? 'bg-emerald-500/10 text-emerald-500'
                          : apt.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
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
            {/* Simplified booking form (demo) */}
            <div className="space-y-2">
              <Label htmlFor="client-select">Client ID</Label>
              <Input id="client-select" placeholder="client-id" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-date">Date</Label>
              <Input id="apt-date" type="datetime-local" className="bg-background border-border" />
            </div>
          </div>
          <Button onClick={() => {
            const clientInput = (document.getElementById('client-select') as HTMLInputElement);
            const dateInput = (document.getElementById('apt-date') as HTMLInputElement);
            if (clientInput?.value && dateInput?.value) {
              createAppointment({ clientId: clientInput.value, date: new Date(dateInput.value).toISOString(), type: 'training' });
            }
          }} className="bg-emerald-500 hover:bg-emerald-600 text-white" disabled={isPending}>Schedule Appointment</Button>
        </div>
      </Card>
    </div>
  )
}
