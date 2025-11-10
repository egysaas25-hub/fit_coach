"use client";
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/lib/hooks/api/useSettings';

export default function BrandingSettingsPage() {
  const { data: settings } = useSettings();
  const [title, setTitle] = useState(settings?.branding?.title || '');
  const [logoUrl, setLogoUrl] = useState(settings?.branding?.logoUrl || '');
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
          <Button disabled>Save (coming soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
