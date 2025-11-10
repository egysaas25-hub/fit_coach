"use client"

import type React from "react"

import { useState } from "react"

interface BrandingSettings {
  logoUrl: string
  primaryColor: string
  accentColor: string
  customDomain: string
  signature: string
}

export default function BrandingPage() {
  const [settings, setSettings] = useState<BrandingSettings>({
    logoUrl: "Trainer SaaS",
    primaryColor: "#00c26a",
    accentColor: "#00c26a",
    customDomain: "trainer.example.com",
    signature: "Best regards,\nTrainer SaaS Team",
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
        setSettings((prev) => ({ ...prev, logoUrl: file.name }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (field: keyof BrandingSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Branding Settings</h1>
        <p className="text-secondary">Customize your workspace appearance and white-label settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Upload */}
          <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg p-6">
            <h3 className="text-lg font-poppins font-bold text-foreground mb-4">Logo</h3>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-24 h-24 bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg flex items-center justify-center">
                {logoPreview ? (
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-3xl">📸</span>
                )}
              </div>
              <div className="flex-1">
                <label className="block mb-2">
                  <span className="sr-only">Upload logo</span>
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  <div className="bg-primary text-black px-4 py-2 rounded-lg font-semibold cursor-pointer hover:opacity-90 transition-opacity text-center">
                    Upload Logo
                  </div>
                </label>
                <p className="text-xs text-secondary">Max size: 2MB (PNG, JPG, SVG)</p>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg p-6">
            <h3 className="text-lg font-poppins font-bold text-foreground mb-4">Color Palette</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="flex-1 bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-foreground placeholder-secondary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => handleChange("accentColor", e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => handleChange("accentColor", e.target.value)}
                    className="flex-1 bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-foreground placeholder-secondary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Custom Domain */}
          <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg p-6">
            <h3 className="text-lg font-poppins font-bold text-foreground mb-4">Custom Domain</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.customDomain}
                onChange={(e) => handleChange("customDomain", e.target.value)}
                placeholder="trainer.example.com"
                className="flex-1 bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-foreground placeholder-secondary focus:outline-none focus:border-primary"
              />
              <button className="bg-primary text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Verify
              </button>
            </div>
          </div>

          {/* Signature */}
          <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg p-6">
            <h3 className="text-lg font-poppins font-bold text-foreground mb-4">Email Signature</h3>
            <textarea
              value={settings.signature}
              onChange={(e) => handleChange("signature", e.target.value)}
              rows={4}
              placeholder="Your email signature..."
              className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-foreground placeholder-secondary focus:outline-none focus:border-primary"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-primary text-black px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Save Changes
            </button>
            <button className="flex-1 bg-[#2a2d2b] text-foreground px-4 py-3 rounded-lg font-semibold hover:bg-[#3a3d3b] transition-colors">
              Reset to Default
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-poppins font-bold text-foreground mb-4">Preview</h3>
            <div className="bg-[#0B0E0C] rounded-lg p-4 space-y-4 border border-[#2a2d2b]">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#2a2d2b]">
                <div className="text-xl font-bold font-poppins" style={{ color: settings.primaryColor }}>
                  {settings.logoUrl.length > 20 ? "Logo" : settings.logoUrl}
                </div>
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: settings.accentColor }} />
              </div>

              {/* Mock Buttons */}
              <div className="space-y-2">
                <div
                  className="px-4 py-2 rounded-lg text-black font-semibold text-center"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Primary Button
                </div>
                <div
                  className="px-4 py-2 rounded-lg text-center font-semibold border"
                  style={{ borderColor: settings.accentColor, color: settings.accentColor }}
                >
                  Secondary Button
                </div>
              </div>

              {/* Mock Content */}
              <div className="text-xs text-secondary mt-4 p-3 bg-[#1a1d1b] rounded border border-[#2a2d2b]">
                <p className="mb-2 font-semibold" style={{ color: settings.primaryColor }}>
                  Custom Domain:
                </p>
                <p>{settings.customDomain}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
