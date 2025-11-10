"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRoles, usePermissions, useCreateRole } from '@/lib/hooks/api/useTeam';

export default function RolesPermissionsPage() {
  const { roles } = useRoles();
  const { permissions } = usePermissions();
  const { createRole, loading } = useCreateRole();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Roles & Permissions</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-sm font-medium mb-2">Create Role</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input placeholder="Role name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Button onClick={async () => { await createRole({ name, description, permissions: [] }); setName(''); setDescription(''); }} disabled={loading}>Create</Button>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Existing Roles</div>
            <div className="space-y-2">
              {roles.map((r) => (
                <div key={r.id} className="border border-border rounded-md p-3">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">Users: {r.userCount}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Permissions</div>
            <div className="space-y-2">
              {permissions.map((p) => (
                <div key={p.id} className="border border-border rounded-md p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">Category: {p.category}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
