import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';
import { database, ProgressEntry } from '@/lib/mock-db/database';
import { success, error } from '@/lib/utils/response';
import { ensureDbInitialized } from '@/lib/db/init';

/**
 * GET /api/progress/summary
 * Get progress summary with all metrics
 */
export async function GET(req: NextRequest) {
  ensureDbInitialized();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) return authResult;

  const { user } = authResult;

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    let finalClientId = clientId;
    if (user.role === 'client') {
      finalClientId = user.id;
    } else if (!clientId) {
      return error('clientId parameter is required', 400);
    }

    // Get all progress entries for client
    let entries = database.query<ProgressEntry>(
      'progressEntries',
      (e) => e.clientId === finalClientId
    );

    // Organize by metric type
    const weightEntries = entries.filter((e) => e.metric === 'weight');
    const bodyfatEntries = entries.filter((e) => e.metric === 'bodyfat');
    const measurementEntries = entries.filter((e) => e.metric === 'measurements');
    const photoEntries = entries.filter((e) => e.metric === 'photo');

    // Calculate statistics
    const weightStats =
      weightEntries.length > 0
        ? {
            current: weightEntries[weightEntries.length - 1]?.value || 0,
            starting: weightEntries[0]?.value || 0,
            change:
              (weightEntries[weightEntries.length - 1]?.value || 0) -
              (weightEntries[0]?.value || 0),
            trend: weightEntries
              .slice(-10)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((e) => ({
                date: e.date,
                value: e.value,
              })),
          }
        : null;

    const bodyfatStats =
      bodyfatEntries.length > 0
        ? {
            current: bodyfatEntries[bodyfatEntries.length - 1]?.value || 0,
            starting: bodyfatEntries[0]?.value || 0,
            change:
              (bodyfatEntries[bodyfatEntries.length - 1]?.value || 0) -
              (bodyfatEntries[0]?.value || 0),
          }
        : null;

    // Get recent measurements
    const recentMeasurements =
      measurementEntries.length > 0
        ? measurementEntries.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0]
        : null;

    // Get recent photos
    const recentPhotos = photoEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);

    const summary = {
      clientId: finalClientId,
      weight: weightStats,
      bodyfat: bodyfatStats,
      measurements: recentMeasurements,
      photos: recentPhotos,
      totalEntries: entries.length,
      lastUpdated:
        entries.length > 0
          ? entries.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0].date
          : null,
    };

    return success(summary);
  } catch (err) {
    console.error('Failed to fetch progress summary:', err);
    return error('Failed to fetch progress summary', 500);
  }
}