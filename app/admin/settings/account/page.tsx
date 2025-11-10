"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AccountSettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button disabled>Save (coming soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
