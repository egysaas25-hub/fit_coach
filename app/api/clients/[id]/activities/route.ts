import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error, notFound, forbidden } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/clients/:id/activities
 * Get recent activity feed for a client (workouts, nutrition, progress)
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession(req);
    const { user } = session;
    const clientId = BigInt(params.id);

    // Check if client exists
    const client = await prisma.customers.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        tenant_id: true,
      },
    });

    if (!client) return notFound('Client');

    // Permission check - ensure user belongs to same tenant
    if (user.tenant_id !== Number(client.tenant_id)) {
      return forbidden("You don't have permission to view this client's activities.");
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const fromDate = searchParams.get('from');

    // Build date filter
    const dateFilter = fromDate ? { gte: new Date(fromDate) } : undefined;

    // Get progress tracking activities
    const progressEntries = await prisma.progress_tracking.findMany({
      where: {
        customer_id: clientId,
        recorded_at: dateFilter,
      },
      orderBy: { recorded_at: 'desc' },
      take: limit,
    });

    // Get checkin activities
    const checkins = await prisma.checkins.findMany({
      where: {
        customer_id: clientId,
        checkin_date: dateFilter ? { gte: new Date(fromDate!) } : undefined,
      },
      orderBy: { checkin_date: 'desc' },
      take: limit,
    });

    // Get interactions (appointments, messages, etc.)
    const interactions = await prisma.interactions.findMany({
      where: {
        customer_id: clientId,
        sent_at: dateFilter,
      },
      include: {
        by_team_member: {
          select: {
            full_name: true,
            role: true,
          },
        },
      },
      orderBy: { sent_at: 'desc' },
      take: limit,
    });

    // Convert to unified activity format
    const activities = [
      ...progressEntries.map((p) => ({
        id: p.id.toString(),
        type: 'progress',
        date: p.recorded_at,
        description: `Progress update: ${p.weight_kg ? `Weight: ${p.weight_kg}kg` : ''} ${p.workout_done ? 'Workout completed' : ''}`.trim(),
        data: {
          weight_kg: p.weight_kg,
          workout_done: p.workout_done,
          sleep_hours: p.sleep_hours,
          pain_score: p.pain_score,
          notes: p.notes,
        },
      })),
      ...checkins.map((c) => ({
        id: c.id.toString(),
        type: 'checkin',
        date: c.checkin_date,
        description: `${c.period} check-in`,
        data: {
          period: c.period,
          action_taken: c.action_taken,
          reviewed_at: c.reviewed_at,
        },
      })),
      ...interactions.map((i) => ({
        id: i.id.toString(),
        type: 'interaction',
        date: i.sent_at,
        description: `${i.channel} ${i.direction}: ${i.message_text || i.intent_code || 'Activity'}`,
        data: {
          channel: i.channel,
          direction: i.direction,
          intent_code: i.intent_code,
          message_text: i.message_text,
          by_team_member: i.by_team_member,
        },
      })),
    ];

    // Sort by date (newest first)
    activities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Limit results
    const limitedActivities = activities.slice(0, limit);

    return success({
      clientId: params.id,
      activities: limitedActivities,
      total: activities.length,
      summary: {
        progressEntries: progressEntries.length,
        checkins: checkins.length,
        interactions: interactions.length,
      },
    });
  } catch (err) {
    console.error('Failed to fetch client activities:', err);
    return error('Failed to fetch client activities', 500);
  }
}