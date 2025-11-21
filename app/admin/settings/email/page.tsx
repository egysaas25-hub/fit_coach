'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  Save, 
  TestTube, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Server,
  Lock,
  User
} from 'lucide-react'
import { toast } from 'sonner'

interface EmailSettings {
  provider: string
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPassword: string
  fromEmail: string
  fromName: string
  replyToEmail: string
}

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSettings>({
    provider: 'smtp',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: '',
    replyToEmail: '',
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleInputChange = (field: keyof EmailSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    // Validate required fields
    if (!settings.smtpHost || !settings.smtpPort || !settings.fromEmail) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(settings.fromEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (settings.replyToEmail && !emailRegex.test(settings.replyToEmail)) {
      toast.error('Please enter a valid reply-to email address')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/settings/email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to save email settings')
      }

      setLastSaved(new Date())
      toast.success('Email settings saved successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter a test email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(testEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsTesting(true)

    try {
      const response = await fetch('/api/settings/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email: testEmail,
          settings 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to send test email')
      }

      toast.success(`Test email sent to ${testEmail}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send test email')
      console.error('Test error:', error)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Mail className="h-8 w-8" />
            Email Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure email provider and SMTP settings
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
          Configure your SMTP server details to enable email notifications and communications.
          Make sure to test your configuration before saving.
        </AlertDescription>
      </Alert>

      {/* SMTP Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            SMTP Server Configuration
          </CardTitle>
          <CardDescription>
            Configure your SMTP server details for sending emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">
                SMTP Host <span className="text-destructive">*</span>
              </Label>
              <Input
                id="smtpHost"
                placeholder="smtp.gmail.com"
                value={settings.smtpHost}
                onChange={(e) => handleInputChange('smtpHost', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your SMTP server hostname
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPort">
                SMTP Port <span className="text-destructive">*</span>
              </Label>
              <Input
                id="smtpPort"
                type="number"
                placeholder="587"
                value={settings.smtpPort}
                onChange={(e) => handleInputChange('smtpPort', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Common ports: 587 (TLS), 465 (SSL), 25
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpUser" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                SMTP Username
              </Label>
              <Input
                id="smtpUser"
                placeholder="your-email@example.com"
                value={settings.smtpUser}
                onChange={(e) => handleInputChange('smtpUser', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                SMTP Password
              </Label>
              <Input
                id="smtpPassword"
                type="password"
                placeholder="••••••••"
                value={settings.smtpPassword}
                onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sender Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sender Information
          </CardTitle>
          <CardDescription>
            Configure the sender details that appear in outgoing emails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromEmail">
                From Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fromEmail"
                type="email"
                placeholder="noreply@yourdomain.com"
                value={settings.fromEmail}
                onChange={(e) => handleInputChange('fromEmail', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Email address that appears as sender
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromName">
                From Name
              </Label>
              <Input
                id="fromName"
                placeholder="FitCoach Platform"
                value={settings.fromName}
                onChange={(e) => handleInputChange('fromName', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Display name for the sender
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="replyToEmail">
              Reply-To Email
            </Label>
            <Input
              id="replyToEmail"
              type="email"
              placeholder="support@yourdomain.com"
              value={settings.replyToEmail}
              onChange={(e) => handleInputChange('replyToEmail', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Email address for replies (optional)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Email Configuration
          </CardTitle>
          <CardDescription>
            Send a test email to verify your configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="testEmail">Test Email Address</Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleTestEmail}
                disabled={isTesting || !testEmail}
                variant="outline"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Send Test
                  </>
                )}
              </Button>
            </div>
          </div>
          <Alert>
            <AlertDescription className="text-xs">
              A test email will be sent using your current configuration. Make sure to save your settings first if you've made changes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => {
            setSettings({
              provider: 'smtp',
              smtpHost: '',
              smtpPort: '587',
              smtpUser: '',
              smtpPassword: '',
              fromEmail: '',
              fromName: '',
              replyToEmail: '',
            })
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

      {/* Provider Information */}
      <Card>
        <CardHeader>
          <CardTitle>Common SMTP Providers</CardTitle>
          <CardDescription>
            Quick reference for popular email providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-1">Gmail</h4>
              <p className="text-sm text-muted-foreground">
                Host: smtp.gmail.com | Port: 587 (TLS) or 465 (SSL)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Note: Enable "Less secure app access" or use App Password
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-1">SendGrid</h4>
              <p className="text-sm text-muted-foreground">
                Host: smtp.sendgrid.net | Port: 587 | User: apikey
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-1">Mailgun</h4>
              <p className="text-sm text-muted-foreground">
                Host: smtp.mailgun.org | Port: 587
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-1">AWS SES</h4>
              <p className="text-sm text-muted-foreground">
                Host: email-smtp.[region].amazonaws.com | Port: 587
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
