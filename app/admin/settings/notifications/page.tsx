'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bell, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Mail,
  MessageSquare,
  Smartphone,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

interface NotificationChannel {
  email: boolean
  whatsapp: boolean
  push: boolean
}

interface NotificationSettings {
  // Client Events
  newClientRegistration: NotificationChannel
  clientMilestoneAchieved: NotificationChannel
  clientMissedWorkout: NotificationChannel
  clientProgressUpdate: NotificationChannel
  
  // Appointment Events
  appointmentBooked: NotificationChannel
  appointmentCancelled: NotificationChannel
  appointmentReminder: NotificationChannel
  
  // Payment Events
  paymentReceived: NotificationChannel
  paymentFailed: NotificationChannel
  subscriptionExpiring: NotificationChannel
  
  // Team Events
  newTeamMemberAdded: NotificationChannel
  teamMemberAssigned: NotificationChannel
  
  // System Events
  systemAlerts: NotificationChannel
  weeklyReport: NotificationChannel
  monthlyReport: NotificationChannel
}

const defaultChannel: NotificationChannel = {
  email: false,
  whatsapp: false,
  push: false,
}

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    newClientRegistration: { email: true, whatsapp: true, push: true },
    clientMilestoneAchieved: { email: true, whatsapp: false, push: true },
    clientMissedWorkout: { email: true, whatsapp: true, push: false },
    clientProgressUpdate: { email: true, whatsapp: false, push: true },
    
    appointmentBooked: { email: true, whatsapp: true, push: true },
    appointmentCancelled: { email: true, whatsapp: true, push: true },
    appointmentReminder: { email: true, whatsapp: true, push: false },
    
    paymentReceived: { email: true, whatsapp: false, push: true },
    paymentFailed: { email: true, whatsapp: true, push: true },
    subscriptionExpiring: { email: true, whatsapp: true, push: true },
    
    newTeamMemberAdded: { email: true, whatsapp: false, push: false },
    teamMemberAssigned: { email: true, whatsapp: false, push: true },
    
    systemAlerts: { email: true, whatsapp: false, push: true },
    weeklyReport: { email: true, whatsapp: false, push: false },
    monthlyReport: { email: true, whatsapp: false, push: false },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleToggle = (
    event: keyof NotificationSettings,
    channel: keyof NotificationChannel
  ) => {
    setSettings(prev => ({
      ...prev,
      [event]: {
        ...prev[event],
        [channel]: !prev[event][channel]
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to save notification settings')
      }

      setLastSaved(new Date())
      toast.success('Notification settings saved successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const enableAllForEvent = (event: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [event]: { email: true, whatsapp: true, push: true }
    }))
  }

  const disableAllForEvent = (event: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [event]: { email: false, whatsapp: false, push: false }
    }))
  }

  const getEnabledCount = (channel: keyof NotificationChannel) => {
    return Object.values(settings).filter(s => s[channel]).length
  }

  const NotificationRow = ({
    event,
    label,
    description,
    icon: Icon,
  }: {
    event: keyof NotificationSettings
    label: string
    description: string
    icon: any
  }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 rounded-lg bg-primary/10 mt-1">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{label}</h4>
            {!settings[event].email && !settings[event].whatsapp && !settings[event].push && (
              <Badge variant="secondary" className="text-xs">Disabled</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 ml-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={settings[event].email}
            onCheckedChange={() => handleToggle(event, 'email')}
          />
          <Mail className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={settings[event].whatsapp}
            onCheckedChange={() => handleToggle(event, 'whatsapp')}
          />
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={settings[event].push}
            onCheckedChange={() => handleToggle(event, 'push')}
          />
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notification Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure notification preferences for different events
          </p>
        </div>
        {lastSaved && (
          <Badge variant="outline" className="gap-2">
            <CheckCircle2 className="h-3 w-3" />
            Last saved {lastSaved.toLocaleTimeString()}
          </Badge>
        )}
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Choose which channels you want to receive notifications through for each event type.
          Make sure your email and WhatsApp integrations are configured.
        </AlertDescription>
      </Alert>

      {/* Channel Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Notifications</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getEnabledCount('email')}</div>
            <p className="text-xs text-muted-foreground">Active notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Notifications</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getEnabledCount('whatsapp')}</div>
            <p className="text-xs text-muted-foreground">Active notifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Push Notifications</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getEnabledCount('push')}</div>
            <p className="text-xs text-muted-foreground">Active notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Email</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Push</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Client Events
          </CardTitle>
          <CardDescription>
            Notifications related to client activities and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <NotificationRow
            event="newClientRegistration"
            label="New Client Registration"
            description="When a new client signs up or is added to the platform"
            icon={Users}
          />
          <NotificationRow
            event="clientMilestoneAchieved"
            label="Client Milestone Achieved"
            description="When a client reaches a fitness milestone or goal"
            icon={TrendingUp}
          />
          <NotificationRow
            event="clientMissedWorkout"
            label="Client Missed Workout"
            description="When a client misses a scheduled workout session"
            icon={AlertTriangle}
          />
          <NotificationRow
            event="clientProgressUpdate"
            label="Client Progress Update"
            description="When a client logs progress or updates measurements"
            icon={TrendingUp}
          />
        </CardContent>
      </Card>

      {/* Appointment Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Events
          </CardTitle>
          <CardDescription>
            Notifications for appointment scheduling and changes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <NotificationRow
            event="appointmentBooked"
            label="Appointment Booked"
            description="When a new appointment is scheduled"
            icon={Calendar}
          />
          <NotificationRow
            event="appointmentCancelled"
            label="Appointment Cancelled"
            description="When an appointment is cancelled by client or trainer"
            icon={AlertTriangle}
          />
          <NotificationRow
            event="appointmentReminder"
            label="Appointment Reminder"
            description="Reminder before upcoming appointments"
            icon={Bell}
          />
        </CardContent>
      </Card>

      {/* Payment Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Events
          </CardTitle>
          <CardDescription>
            Notifications for payments and subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <NotificationRow
            event="paymentReceived"
            label="Payment Received"
            description="When a payment is successfully processed"
            icon={CheckCircle2}
          />
          <NotificationRow
            event="paymentFailed"
            label="Payment Failed"
            description="When a payment attempt fails"
            icon={AlertTriangle}
          />
          <NotificationRow
            event="subscriptionExpiring"
            label="Subscription Expiring"
            description="When a client's subscription is about to expire"
            icon={AlertCircle}
          />
        </CardContent>
      </Card>

      {/* Team Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Events
          </CardTitle>
          <CardDescription>
            Notifications for team management activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <NotificationRow
            event="newTeamMemberAdded"
            label="New Team Member Added"
            description="When a new trainer or staff member joins the team"
            icon={Users}
          />
          <NotificationRow
            event="teamMemberAssigned"
            label="Team Member Assigned"
            description="When you're assigned to a new client or task"
            icon={Users}
          />
        </CardContent>
      </Card>

      {/* System Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            System Events
          </CardTitle>
          <CardDescription>
            System alerts and periodic reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <NotificationRow
            event="systemAlerts"
            label="System Alerts"
            description="Critical system notifications and alerts"
            icon={AlertTriangle}
          />
          <NotificationRow
            event="weeklyReport"
            label="Weekly Report"
            description="Weekly summary of platform activity and metrics"
            icon={TrendingUp}
          />
          <NotificationRow
            event="monthlyReport"
            label="Monthly Report"
            description="Monthly business and performance report"
            icon={TrendingUp}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => {
            // Reset to defaults
            const defaultSettings: NotificationSettings = {
              newClientRegistration: { email: true, whatsapp: true, push: true },
              clientMilestoneAchieved: { email: true, whatsapp: false, push: true },
              clientMissedWorkout: { email: true, whatsapp: true, push: false },
              clientProgressUpdate: { email: true, whatsapp: false, push: true },
              
              appointmentBooked: { email: true, whatsapp: true, push: true },
              appointmentCancelled: { email: true, whatsapp: true, push: true },
              appointmentReminder: { email: true, whatsapp: true, push: false },
              
              paymentReceived: { email: true, whatsapp: false, push: true },
              paymentFailed: { email: true, whatsapp: true, push: true },
              subscriptionExpiring: { email: true, whatsapp: true, push: true },
              
              newTeamMemberAdded: { email: true, whatsapp: false, push: false },
              teamMemberAssigned: { email: true, whatsapp: false, push: true },
              
              systemAlerts: { email: true, whatsapp: false, push: true },
              weeklyReport: { email: true, whatsapp: false, push: false },
              monthlyReport: { email: true, whatsapp: false, push: false },
            }
            setSettings(defaultSettings)
            toast.info('Settings reset to defaults')
          }}
        >
          Reset to Defaults
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Notification Channels</CardTitle>
          <CardDescription>
            Understanding different notification delivery methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 p-3 border rounded-lg">
            <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Delivered to your registered email address. Best for detailed information and reports.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 border rounded-lg">
            <MessageSquare className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">WhatsApp Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Instant messages via WhatsApp. Requires WhatsApp integration to be configured.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 border rounded-lg">
            <Smartphone className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">Push Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Browser or mobile app notifications. Instant alerts for time-sensitive events.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
