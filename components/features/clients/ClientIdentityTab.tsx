'use client'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Client {
  id: string
  client_code: string
  first_name: string
  last_name: string
  phone_e164: string
  email: string | null
  gender: string | null
  age: number | null
  status: string
  goal: string | null
  source: string
  region: string
  language: string
  lifecycle_stage: string
}

interface ClientIdentityTabProps {
  client: Client
  isEditing: boolean
}

export function ClientIdentityTab({ client, isEditing }: ClientIdentityTabProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Client Code</Label>
              <Input value={client.client_code} disabled className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              {isEditing ? (
                <Select value={client.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="churned">Churned</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input value={client.status} disabled className="capitalize" />
              )}
            </div>
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={client.first_name}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={client.last_name}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={client.phone_e164}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={client.email || ''}
                placeholder="Not provided"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              {isEditing ? (
                <Select value={client.gender || undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={client.gender || ''}
                  placeholder="Not provided"
                  disabled
                  className="capitalize"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                value={client.age || ''}
                placeholder="Not provided"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Fitness Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Goal</Label>
              <Input
                value={client.goal || ''}
                placeholder="Not set"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              {isEditing ? (
                <Select value={client.source}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input value={client.source} disabled className="capitalize" />
              )}
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Input value={client.region} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              {isEditing ? (
                <Select value={client.language}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={client.language === 'en' ? 'English' : 'Arabic'}
                  disabled
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Lifecycle Stage</Label>
              <Input
                value={client.lifecycle_stage}
                disabled
                className="capitalize"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
