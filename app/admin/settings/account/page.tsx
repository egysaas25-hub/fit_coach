"use client"

import { useState } from "react"

interface AccountSettings {
  name: string
  email: string
  phone: string
  timezone: string
  notificationEmail: boolean
  notificationWhatsApp: boolean
  notificationInApp: boolean
  alertFrequency: "immediate" | "daily" | "weekly"
}

export default function AccountSettingsPage() {
  const [settings, setSettings] = useState<AccountSettings>({
    name: "John Trainer",
    email: "john@trainersaas.com",
    phone: "+1 234 567 8900",
    timezone: "America/New_York",
    notificationEmail: true,
    notificationWhatsApp: true,
    notificationInApp: true,
    alertFrequency: "daily",
  })

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleChange = (field: keyof AccountSettings, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">Account Settings</h1>
        <p className="text-secondary">Manage your personal account and security preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg p-6">
            <h3 className="text-lg font-poppins font-bold text-foreground mb-6">Profile Information</h3>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex-shrink-0 w-20 h-20 bg-primary rounded-full flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <button className="bg-primary text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity mb-2 block">
                  Upload Photo
                </button>
                <p className="text-xs text-secondary">Max size: 5MB (PNG, JPG)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Full Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-foreground placeholder-secondary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Email (Read-only)</label>
                  <input
                    type="email"
                    value={settings.email}
                    readOnly
                    className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-secondary opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Phone</label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-foreground placeholder-secondary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg p-6">
            <h3 className="text-lg font-poppins font-bold text-foreground mb-6">Security</h3>

            <div className="space-y-4">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="w-full text-left px-4 py-3 bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg hover:border-primary transition-colors"
              >
                <span className="font-medium text-foreground">Change Password</span>
                <span className="float-right text-secondary">{showPasswordForm ? "▼" : "▶"}</span>
              </button>

              {showPasswordForm && (
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordForm.current}
                    onChange={(e) => handlePasswordChange("current", e.target.value)}
                    className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-foreground placeholder-secondary focus:outline-none focus:border-primary"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordForm.new}
                    onChange={(e) => handlePasswordChange("new", e.target.value)}
                    className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-foreground placeholder-secondary focus:outline-none focus:border-primary"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordForm.confirm}
                    onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                    className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-foreground placeholder-secondary focus:outline-none focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                      Update Password
                    </button>
                    <button
                      onClick={() => setShowPasswordForm(false)}
                      className="flex-1 bg-[#2a2d2b] text-foreground px-4 py-2 rounded-lg font-semibold hover:bg-[#3a3d3b] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between p-4 bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg">
                <span className="text-foreground font-medium">Two-Factor Authentication</span>
                <button className="bg-primary text-black px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                  Enable
                </button>
              </div>
            </div>
          </div>

          {/* Save Changes */}
          <button className="w-full bg-primary text-black px-4 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </div>

        {/* Preferences Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1d1b] border border-[#2a2d2b] rounded-lg p-6 sticky top-6">
            <h3 className="text-lg font-poppins font-bold text-foreground mb-6">Preferences</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Dubai">Dubai</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>

              <div className="border-t border-[#2a2d2b] pt-4">
                <h4 className="font-medium text-foreground mb-3">Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificationEmail}
                      onChange={(e) => handleChange("notificationEmail", e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-secondary">Email Notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificationWhatsApp}
                      onChange={(e) => handleChange("notificationWhatsApp", e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-secondary">WhatsApp Notifications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notificationInApp}
                      onChange={(e) => handleChange("notificationInApp", e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-secondary">In-App Notifications</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-[#2a2d2b] pt-4">
                <label className="block text-sm font-medium text-secondary mb-2">Alert Frequency</label>
                <select
                  value={settings.alertFrequency}
                  onChange={(e) => handleChange("alertFrequency", e.target.value as any)}
                  className="w-full bg-[#0B0E0C] border border-[#2a2d2b] rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary text-sm"
                >
                  <option value="immediate">Immediate</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
