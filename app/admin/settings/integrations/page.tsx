'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Zap, 
  MessageSquare, 
  CreditCard, 
  Database, 
  BarChart3, 
  Shield,
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface Integration {
  id: string
  name: string
  provider: string
  type: string
  is_enabled: boolean
  created_at: string
  updated_at: string
}

const integrationIcons: Record<string, any> = {
  messaging: MessageSquare,
  payments: CreditCard,
  storage: Database,
  analytics: BarChart3,
  auth: Shield,
  other: Settings,
}

const integrationTypeLabels: Record<string, string> = {
  messaging: 'Messaging',
  payments: 'Payments',
  storage: 'Storage',
  analytics: 'Analytics',
  auth: 'Authentication',
  other: 'Other',
}

const integrationTypeColors: Record<string, string> = {
  messaging: 'bg-blue-500/10 text-blue-500',
  payments: 'bg-green-500/10 text-green-500',
  storage: 'bg-purple-500/10 text-purple-500',
  analytics: 'bg-orange-500/10 text-orange-500',
  auth: 'bg-red-500/10 text-red-500',
  other: 'bg-gray-500/10 text-gray-500',
}

export default function IntegrationsPage() {
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Fetch integrations
  const { data, isLoading, refetch } = useQuery<{
    integrations: Integration[]
    total: number
  }>({
    queryKey: ['integrations'],
    queryFn: async () => {
      const response = await fetch('/api/settings/integrations', {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch integrations')
      }

      return response.json()
    },
  })

  // Toggle integration enabled status
  const handleToggleEnabled = async (integrationId: string, currentStatus: boolean) => {
    setTogglingId(integrationId)
    
    try {
      const response = await fetch(`/api/settings/integrations/${integrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          is_enabled: !currentStatus,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to update integration status')
      }

      toast.success(`Integration ${!currentStatus ? 'enabled' : 'disabled'} successfully`)
      
      // Refresh the list
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update integration status')
      console.error('Toggle error:', error)
      
      // Revert will happen automatically on refetch failure
      // since we're not optimistically updating the UI
    } finally {
      setTogglingId(null)
    }
  }

  const enabledCount = data?.integrations.filter(i => i.is_enabled).length || 0
  const disabledCount = (data?.total || 0) - enabledCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8" />
            Integrations
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage external services and API integrations
          </p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configure New
        </Button>
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.total}</div>
              <p className="text-xs text-muted-foreground">Connected services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enabled</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{enabledCount}</div>
              <p className="text-xs text-muted-foreground">Active integrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disabled</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{disabledCount}</div>
              <p className="text-xs text-muted-foreground">Inactive integrations</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integrations List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-16 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data?.integrations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Integrations Found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by configuring your first integration
              </p>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </CardContent>
          </Card>
        ) : (
          data?.integrations.map((integration) => {
            const Icon = integrationIcons[integration.type] || Settings
            const isToggling = togglingId === integration.id

            return (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold">{integration.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={integrationTypeColors[integration.type]}
                          >
                            {integrationTypeLabels[integration.type]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Provider: {integration.provider}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={integration.is_enabled}
                          onCheckedChange={() => handleToggleEnabled(integration.id, integration.is_enabled)}
                          disabled={isToggling}
                        />
                        <Badge 
                          variant={integration.is_enabled ? 'default' : 'secondary'}
                          className="min-w-[70px] justify-center"
                        >
                          {isToggling ? 'Updating...' : integration.is_enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>

                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Integrations</CardTitle>
          <CardDescription>
            Integrations allow you to connect external services to enhance your platform capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Messaging</h4>
                <p className="text-sm text-muted-foreground">
                  Connect WhatsApp, SMS, and email services for client communication
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CreditCard className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Payments</h4>
                <p className="text-sm text-muted-foreground">
                  Integrate payment gateways like Stripe, PayPal, and local providers
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Database className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Storage</h4>
                <p className="text-sm text-muted-foreground">
                  Connect cloud storage for files, images, and videos
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <BarChart3 className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Track user behavior and platform performance with analytics tools
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
