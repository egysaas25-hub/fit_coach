"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Shield, Users, Plus, Edit, Trash2 } from "lucide-react"

const roles = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access and management",
    userCount: 2,
    permissions: {
      clients: { view: true, edit: true, delete: true, export: true },
      team: { view: true, edit: true, delete: true, export: true },
      communication: { view: true, edit: true, delete: false, export: true },
      programs: { view: true, edit: true, delete: true, export: true },
      analytics: { view: true, edit: false, delete: false, export: true },
      settings: { view: true, edit: true, delete: false, export: false },
    },
  },
  {
    id: 2,
    name: "Senior Trainer",
    description: "Advanced trainer with team oversight",
    userCount: 3,
    permissions: {
      clients: { view: true, edit: true, delete: false, export: true },
      team: { view: true, edit: false, delete: false, export: false },
      communication: { view: true, edit: true, delete: false, export: false },
      programs: { view: true, edit: true, delete: false, export: true },
      analytics: { view: true, edit: false, delete: false, export: true },
      settings: { view: false, edit: false, delete: false, export: false },
    },
  },
  {
    id: 3,
    name: "Junior Trainer",
    description: "Basic trainer with limited access",
    userCount: 5,
    permissions: {
      clients: { view: true, edit: true, delete: false, export: false },
      team: { view: false, edit: false, delete: false, export: false },
      communication: { view: true, edit: true, delete: false, export: false },
      programs: { view: true, edit: false, delete: false, export: false },
      analytics: { view: false, edit: false, delete: false, export: false },
      settings: { view: false, edit: false, delete: false, export: false },
    },
  },
  {
    id: 4,
    name: "Sales",
    description: "Sales team with lead management access",
    userCount: 2,
    permissions: {
      clients: { view: true, edit: true, delete: false, export: true },
      team: { view: false, edit: false, delete: false, export: false },
      communication: { view: true, edit: true, delete: false, export: false },
      programs: { view: false, edit: false, delete: false, export: false },
      analytics: { view: true, edit: false, delete: false, export: true },
      settings: { view: false, edit: false, delete: false, export: false },
    },
  },
]

const pageModules = [
  { key: "clients", label: "Client Management" },
  { key: "team", label: "Team Management" },
  { key: "communication", label: "Communication" },
  { key: "programs", label: "Programs & Plans" },
  { key: "analytics", label: "Analytics & Reports" },
  { key: "settings", label: "Settings" },
]

const permissionTypes = [
  { key: "view", label: "View" },
  { key: "edit", label: "Edit" },
  { key: "delete", label: "Delete" },
  { key: "export", label: "Export" },
]

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage team roles and page-level access control</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRole.id === role.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{role.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {role.userCount}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Permissions for {selectedRole.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pageModules.map((module) => (
                  <div key={module.key} className="space-y-3">
                    <h4 className="font-semibold text-foreground">{module.label}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {permissionTypes.map((permission) => (
                        <div key={permission.key} className="flex items-center justify-between">
                          <label className="text-sm text-muted-foreground">
                            {permission.label}
                          </label>
                          <Switch
                            checked={selectedRole.permissions[module.key]?.[permission.key] || false}
                            disabled
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Role Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Role Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Roles</p>
              <p className="text-2xl font-bold text-foreground">{roles.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">
                {roles.reduce((sum, role) => sum + role.userCount, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Custom Roles</p>
              <p className="text-2xl font-bold text-foreground">
                {roles.filter(role => !["Admin", "Senior Trainer", "Junior Trainer"].includes(role.name)).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}