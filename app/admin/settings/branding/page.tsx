'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ImageUpload } from '@/components/shared/forms/ImageUpload'
import { 
  Palette, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'

interface BrandingSettings {
  logoUrl: string
  faviconUrl: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  companyName: string
  tagline: string
}

export default function BrandingSettingsPage() {
  const [settings, setSettings] = useState<BrandingSettings>({
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#10b981',
    companyName: 'FitCoach',
    tagline: 'Transform Your Fitness Journey',
  })

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const handleInputChange = (field: keyof BrandingSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogoUpload = (url: string) => {
    setSettings(prev => ({
      ...prev,
      logoUrl: url
    }))
    toast.success('Logo uploaded successfully')
  }

  const handleFaviconUpload = (url: string) => {
    setSettings(prev => ({
      ...prev,
      faviconUrl: url
    }))
    toast.success('Favicon uploaded successfully')
  }

  const handleSave = async () => {
    // Validate required fields
    if (!settings.companyName) {
      toast.error('Company name is required')
      return
    }

    // Validate color formats
    const colorRegex = /^#[0-9A-F]{6}$/i
    if (!colorRegex.test(settings.primaryColor) || 
        !colorRegex.test(settings.secondaryColor) || 
        !colorRegex.test(settings.accentColor)) {
      toast.error('Please enter valid hex color codes (e.g., #3b82f6)')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/settings/branding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ settings }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to save branding settings')
      }

      setLastSaved(new Date())
      toast.success('Branding settings saved successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings')
      console.error('Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="h-8 w-8" />
            Branding Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize your platform appearance and client-facing materials
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <Badge variant="outline" className="gap-2">
              <CheckCircle2 className="h-3 w-3" />
              Last saved {lastSaved.toLocaleTimeString()}
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Customize your brand identity across the platform. Changes will be reflected in client portals, 
          emails, and PDF reports.
        </AlertDescription>
      </Alert>

      {previewMode ? (
        /* Preview Mode */
        <Card>
          <CardHeader>
            <CardTitle>Brand Preview</CardTitle>
            <CardDescription>
              See how your branding will appear across the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Preview */}
            <div className="p-8 border rounded-lg bg-card text-center">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt="Logo Preview" 
                  className="h-16 mx-auto object-contain"
                />
              ) : (
                <div className="h-16 flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
              <h2 className="text-2xl font-bold mt-4">{settings.companyName}</h2>
              {settings.tagline && (
                <p className="text-muted-foreground mt-1">{settings.tagline}</p>
              )}
            </div>

            {/* Color Preview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Primary Color</p>
                <div 
                  className="h-24 rounded-lg border"
                  style={{ backgroundColor: settings.primaryColor }}
                />
                <p className="text-xs text-muted-foreground text-center">
                  {settings.primaryColor}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Secondary Color</p>
                <div 
                  className="h-24 rounded-lg border"
                  style={{ backgroundColor: settings.secondaryColor }}
                />
                <p className="text-xs text-muted-foreground text-center">
                  {settings.secondaryColor}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Accent Color</p>
                <div 
                  className="h-24 rounded-lg border"
                  style={{ backgroundColor: settings.accentColor }}
                />
                <p className="text-xs text-muted-foreground text-center">
                  {settings.accentColor}
                </p>
              </div>
            </div>

            {/* Button Preview */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Button Styles</p>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded-md text-white font-medium"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 rounded-md text-white font-medium"
                  style={{ backgroundColor: settings.secondaryColor }}
                >
                  Secondary Button
                </button>
                <button
                  className="px-4 py-2 rounded-md text-white font-medium"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  Accent Button
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Edit Mode */
        <>
          {/* Logo & Favicon */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Logo & Favicon
              </CardTitle>
              <CardDescription>
                Upload your company logo and favicon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Company Logo</Label>
                  <ImageUpload
                    label=""
                    onImageSelect={(file) => {
                      // File selected, will be uploaded
                      console.log('Logo file selected:', file.name)
                    }}
                    onUpload={async (file) => {
                      // Upload the file
                      const formData = new FormData()
                      formData.append('file', file)
                      formData.append('category', 'branding-logo')

                      const response = await fetch('/api/upload/image', {
                        method: 'POST',
                        body: formData,
                      })

                      if (!response.ok) {
                        throw new Error('Failed to upload logo')
                      }

                      const data = await response.json()
                      handleLogoUpload(data.url)
                      return { url: data.url }
                    }}
                    showPreview={true}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: PNG or SVG, transparent background, 500x200px
                  </p>
                  {settings.logoUrl && (
                    <p className="text-xs text-green-600">Current logo uploaded</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Favicon</Label>
                  <ImageUpload
                    label=""
                    onImageSelect={(file) => {
                      console.log('Favicon file selected:', file.name)
                    }}
                    onUpload={async (file) => {
                      const formData = new FormData()
                      formData.append('file', file)
                      formData.append('category', 'branding-favicon')

                      const response = await fetch('/api/upload/image', {
                        method: 'POST',
                        body: formData,
                      })

                      if (!response.ok) {
                        throw new Error('Failed to upload favicon')
                      }

                      const data = await response.json()
                      handleFaviconUpload(data.url)
                      return { url: data.url }
                    }}
                    showPreview={true}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: ICO or PNG, 32x32px or 64x64px
                  </p>
                  {settings.faviconUrl && (
                    <p className="text-xs text-green-600">Current favicon uploaded</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Set your company name and tagline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="FitCoach"
                  value={settings.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your company or brand name
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">
                  Tagline
                </Label>
                <Input
                  id="tagline"
                  placeholder="Transform Your Fitness Journey"
                  value={settings.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  A short phrase that describes your brand (optional)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Scheme
              </CardTitle>
              <CardDescription>
                Customize your brand colors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">
                    Primary Color <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-20 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Main brand color for buttons and highlights
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">
                    Secondary Color <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-20 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      placeholder="#8b5cf6"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supporting color for secondary elements
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">
                    Accent Color <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      className="w-20 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
                      placeholder="#10b981"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accent color for success states and CTAs
                  </p>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-xs">
                  Use hex color codes (e.g., #3b82f6). Choose colors with good contrast for accessibility.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => {
            setSettings({
              logoUrl: '',
              faviconUrl: '',
              primaryColor: '#3b82f6',
              secondaryColor: '#8b5cf6',
              accentColor: '#10b981',
              companyName: 'FitCoach',
              tagline: 'Transform Your Fitness Journey',
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

      {/* Usage Information */}
      <Card>
        <CardHeader>
          <CardTitle>Where Your Branding Appears</CardTitle>
          <CardDescription>
            Your branding will be applied across these areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3 p-3 border rounded-lg">
              <div className="p-2 rounded-lg bg-primary/10 h-fit">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Client Portal</h4>
                <p className="text-sm text-muted-foreground">
                  Logo and colors in client-facing dashboard
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 border rounded-lg">
              <div className="p-2 rounded-lg bg-primary/10 h-fit">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Email Templates</h4>
                <p className="text-sm text-muted-foreground">
                  Branded headers and footers in all emails
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 border rounded-lg">
              <div className="p-2 rounded-lg bg-primary/10 h-fit">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">PDF Reports</h4>
                <p className="text-sm text-muted-foreground">
                  Logo on progress reports and invoices
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 border rounded-lg">
              <div className="p-2 rounded-lg bg-primary/10 h-fit">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium mb-1">WhatsApp Messages</h4>
                <p className="text-sm text-muted-foreground">
                  Company name in automated messages
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
