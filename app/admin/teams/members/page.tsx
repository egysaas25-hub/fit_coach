"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTeamMembers } from '@/lib/hooks/api/useTeam';

export default function TeamMembersPage() {
  const { members, loading, error } = useTeamMembers();
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Team Members</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {loading && <div>Loading...</div>}
          {error && <div className="text-[#F14A4A]">{error}</div>}
          {members.map((m) => (
            <div key={m.id} className="border border-border rounded-md p-3">
              <div className="font-medium">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.email}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
