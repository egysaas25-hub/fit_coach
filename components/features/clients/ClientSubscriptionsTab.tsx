'use client'

import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Subscription {
  id: string
  status: string
  start_date: Date
  end_date: Date
  plan: {
    id: string
    name: string
    price_cents: number
  } | null
}

interface ClientSubscriptionsTabProps {
  clientId: string
  subscriptions: Subscription[]
}

export function ClientSubscriptionsTab({
  clientId,
  subscriptions,
}: ClientSubscriptionsTabProps) {
  const statusVariants: Record<string, string> = {
    active: 'bg-green-500/10 text-green-500',
    expired: 'bg-orange-500/10 text-orange-500',
    cancelled: 'bg-red-500/10 text-red-500',
    pending: 'bg-blue-500/10 text-blue-500',
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Subscription History</h3>
        
        {subscriptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No subscriptions found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">
                    {subscription.plan?.name || 'Unknown Plan'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusVariants[subscription.status] || ''}
                    >
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(subscription.start_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(subscription.end_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    ${((subscription.plan?.price_cents || 0) / 100).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  )
}
