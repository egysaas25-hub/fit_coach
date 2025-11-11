'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useSettings, useUpdateSettings } from '@/lib/hooks/api/useSettings';
import { AppSettings } from '@/types/lib/api/services/settings.types';

export default function AdminSettingsPage() {
  const { data: settings, isLoading, error } = useSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();
  const [formData, setFormData] = useState<Partial<AppSettings> | null>(null);
  
  // Initialize form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        general: { 
          appName: settings.general.appName || 'VTrack Admin',
          maintenanceMode: settings.general.maintenanceMode || false,
          signupEnabled: settings.general.signupEnabled !== undefined ? settings.general.signupEnabled : true,
          maxClientsPerTrainer: settings.general.maxClientsPerTrainer || 30
        },
        email: { 
          enabled: settings.email.enabled !== undefined ? settings.email.enabled : true,
          provider: settings.email.provider || 'smtp',
          fromEmail: settings.email.fromEmail || 'admin@vtrack.com'
        },
        features: { 
          appointments: settings.features.appointments !== undefined ? settings.features.appointments : true,
          messaging: settings.features.messaging !== undefined ? settings.features.messaging : true,
          progressTracking: settings.features.progressTracking !== undefined ? settings.features.progressTracking : true,
          nutritionPlans: settings.features.nutritionPlans !== undefined ? settings.features.nutritionPlans : true
        },
        limits: { 
          maxWorkoutsPerClient: settings.limits.maxWorkoutsPerClient || 100,
          maxNutritionPlansPerClient: settings.limits.maxNutritionPlansPerClient || 50,
          maxFileSize: settings.limits.maxFileSize || 10485760
        },
        branding: settings.branding ? { 
          logoUrl: settings.branding.logoUrl || '',
          title: settings.branding.title || ''
        } : undefined
      });
    }
  }, [settings]);
  
  // Handle form changes
  const handleGeneralChange = (field: string, value: string | boolean | number) => {
    if (formData) {
      setFormData({
        ...formData,
        general: {
          ...(formData.general || {
            appName: 'VTrack Admin',
            maintenanceMode: false,
            signupEnabled: true,
            maxClientsPerTrainer: 30
          }),
          [field]: value
        }
      });
    }
  };
  
  const handleEmailChange = (field: string, value: string | boolean) => {
    if (formData) {
      setFormData({
        ...formData,
        email: {
          ...(formData.email || {
            enabled: true,
            provider: 'smtp',
            fromEmail: 'admin@vtrack.com'
          }),
          [field]: value
        }
      });
    }
  };
  
  const handleFeatureChange = (field: string, value: boolean) => {
    if (formData) {
      setFormData({
        ...formData,
        features: {
          ...(formData.features || {
            appointments: true,
            messaging: true,
            progressTracking: true,
            nutritionPlans: true
          }),
          [field]: value
        }
      });
    }
  };
  
  const handleLimitChange = (field: string, value: number) => {
    if (formData) {
      setFormData({
        ...formData,
        limits: {
          ...(formData.limits || {
            maxWorkoutsPerClient: 100,
            maxNutritionPlansPerClient: 50,
            maxFileSize: 10485760
          }),
          [field]: value
        }
      });
    }
  };
  
  const handleSave = () => {
    if (formData) {
      updateSettings(formData);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Error loading settings</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Settings</h1>
          <p className="text-muted-foreground">Configure admin panel and system settings</p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        ) : (
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input 
                      id="company-name" 
                      value={formData?.general?.appName || ''} 
                      onChange={(e) => handleGeneralChange('appName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input 
                      id="admin-email" 
                      type="email" 
                      value={formData?.email?.fromEmail || ''} 
                      onChange={(e) => handleEmailChange('fromEmail', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        <SelectItem value="cst">Central Time (CST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable maintenance mode for the platform</p>
                    </div>
                    <Switch 
                      checked={formData?.general?.maintenanceMode || false}
                      onCheckedChange={(checked) => handleGeneralChange('maintenanceMode', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive admin notifications via email</p>
                    </div>
                    <Switch 
                      checked={formData?.email?.enabled || false}
                      onCheckedChange={(checked) => handleEmailChange('enabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New User Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new users register</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive critical system notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly activity reports</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="session-timeout" 
                      type="number" 
                      value={formData?.general?.maxClientsPerTrainer || 30} 
                      onChange={(e) => handleGeneralChange('maxClientsPerTrainer', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified of admin logins</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="dark">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="items-per-page">Items Per Page</Label>
                    <Select defaultValue="20">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="mt-6 flex justify-end">
          <Button 
            size="lg" 
            onClick={handleSave}
            disabled={isUpdating || isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </main>
    </div>
  )
}