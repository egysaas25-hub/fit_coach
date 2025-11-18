'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Edit, Trash2, Save, X } from 'lucide-react'
import { ClientIdentityTab } from '@/components/features/clients/ClientIdentityTab'
import { ClientSubscriptionsTab } from '@/components/features/clients/ClientSubscriptionsTab'
import { ClientProgressTab } from '@/components/features/clients/ClientProgressTab'
import { ClientNotesTab } from '@/components/features/clients/ClientNotesTab'

interface Client {
  id: string
  client_code: string
  first_name: string
  last_name: string
  full_name: string
  phone_e164: string
  email: string | null
  gender: string | null
  age: number | null
  status: 'lead' | 'active' | 'expired' | 'churned'
  goal: string | null
  source: string
  region: string
  language: string
  lifecycle_stage: string
  notes: string | null
  assigned_trainer: {
    id: string
    name: string
    email: string
  } | null
  subscriptions: any[]
  recent_progress: any[]
  plan_assignments: any[]
  created_at: Date
  updated_at: Date
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('identity')

  // Fetch client data
  const { data: client, isLoading, error } = useQuery<Client>({
    queryKey: ['client', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${params.id}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch client')
      }

      return response.json()
    },
  })

  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/clients/${params.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to delete client')
      }

      return response.json()
    },
    onSuccess: () => {
      toast.success('Client deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      router.push('/admin/clients')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleDelete = () => {
    deleteClientMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive mb-4">Failed to load client</p>
        <Button onClick={() => router.push('/admin/clients')} variant="outline">
          Back to Clients
        </Button>
      </div>
    )
  }

  const statusVariants: Record<string, string> = {
    active: 'bg-green-500/10 text-green-500',
    lead: 'bg-blue-500/10 text-blue-500',
    expired: 'bg-orange-500/10 text-orange-500',
    churned: 'bg-red-500/10 text-red-500',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/clients')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {client.full_name}
              </h1>
              <Badge variant="outline" className={statusVariants[client.status]}>
                {client.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {client.client_code} • {client.phone_e164}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={() => setIsEditing(false)}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Trainer</div>
          <div className="text-lg font-semibold">
            {client.assigned_trainer?.name || 'Unassigned'}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Goal</div>
          <div className="text-lg font-semibold">{client.goal || '—'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Source</div>
          <div className="text-lg font-semibold capitalize">{client.source}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Member Since</div>
          <div className="text-lg font-semibold">
            {format(new Date(client.created_at), 'MMM d, yyyy')}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="mt-6">
          <ClientIdentityTab client={client} isEditing={isEditing} />
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-6">
          <ClientSubscriptionsTab
            clientId={client.id}
            subscriptions={client.subscriptions}
          />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <ClientProgressTab clientId={client.id} />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <ClientNotesTab
            clientId={client.id}
            notes={client.notes}
            isEditing={isEditing}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {client.full_name} and all associated
              data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteClientMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
