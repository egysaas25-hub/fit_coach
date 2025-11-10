"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTeamMembers } from '@/lib/hooks/api/useTeam';

export default function TeamAnalyticsPage() {
  const { members } = useTeamMembers();
  const total = members.length;
  const active = members.filter(m => m.status === 'Active').length;
  const inactive = total - active;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Team Analytics</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-border rounded-md p-3">Total Members: {total}</div>
          <div className="border border-border rounded-md p-3">Active: {active}</div>
          <div className="border border-border rounded-md p-3">Inactive: {inactive}</div>
          <div className="border border-border rounded-md p-3">Growth: +0%</div>
        </CardContent>
      </Card>
    </div>
  );
}
