import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { success, error } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/progress/summary
 * Get progress summary with all metrics
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    const { user } = session;

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    let finalClientId: bigint;
    if (user.role === 'client') {
      finalClientId = BigInt(user.id);
    } else if (!clientId) {
      return error('clientId parameter is required', 400);
    } else {
      finalClientId = BigInt(clientId);
    }

    // Get progress tracking entries
    const progressEntries = await prisma.progress_tracking.findMany({
      where: {
        customer_id: finalClientId,
        tenant_id: BigInt(user.tenant_id),
      },
      orderBy: { recorded_at: 'asc' },
    });

    // Get InBody metrics for body composition data
    const inbodyEntries = await prisma.inbody_metrics.findMany({
      where: {
        customer_id: finalClientId,
        tenant_id: BigInt(user.tenant_id),
      },
      orderBy: { recorded_at: 'asc' },
    });

    // Calculate weight statistics
    const weightEntries = progressEntries.filter(e => e.weight_kg !== null);
    const weightStats = weightEntries.length > 0 ? {
      current: Number(weightEntries[weightEntries.length - 1]?.weight_kg || 0),
      starting: Number(weightEntries[0]?.weight_kg || 0),
      change: Number(weightEntries[weightEntries.length - 1]?.weight_kg || 0) - Number(weightEntries[0]?.weight_kg || 0),
      trend: weightEntries
        .slice(-10)
        .map((e) => ({
          date: e.recorded_at,
          value: Number(e.weight_kg),
        })),
    } : null;

    // Calculate body fat statistics from InBody data
    const bodyfatEntries = inbodyEntries.filter(e => e.body_fat_percent !== null);
    const bodyfatStats = bodyfatEntries.length > 0 ? {
      current: Number(bodyfatEntries[bodyfatEntries.length - 1]?.body_fat_percent || 0),
      starting: Number(bodyfatEntries[0]?.body_fat_percent || 0),
      change: Number(bodyfatEntries[bodyfatEntries.length - 1]?.body_fat_percent || 0) - Number(bodyfatEntries[0]?.body_fat_percent || 0),
    } : null;

    // Get recent measurements from InBody data
    const recentMeasurements = inbodyEntries.length > 0 ? {
      date: inbodyEntries[inbodyEntries.length - 1].recorded_at,
      height_cm: Number(inbodyEntries[inbodyEntries.length - 1].height_cm),
      weight_kg: Number(inbodyEntries[inbodyEntries.length - 1].weight_kg),
      bmi: Number(inbodyEntries[inbodyEntries.length - 1].bmi),
      muscle_mass_kg: Number(inbodyEntries[inbodyEntries.length - 1].muscle_mass_kg),
      water_percent: Number(inbodyEntries[inbodyEntries.length - 1].water_percent),
    } : null;

    // Get recent photos from media references
    const recentPhotos = await prisma.media_references.findMany({
      where: {
        tenant_id: BigInt(user.tenant_id),
        entity_type: 'progress_photo',
        entity_id: finalClientId,
        type: 'image',
      },
      orderBy: { created_at: 'desc' },
      take: 4,
    });

    const totalEntries = progressEntries.length + inbodyEntries.length;
    const lastUpdated = totalEntries > 0 ? 
      [...progressEntries, ...inbodyEntries]
        .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0]
        .recorded_at : null;

    const summary = {
      clientId: finalClientId.toString(),
      weight: weightStats,
      bodyfat: bodyfatStats,
      measurements: recentMeasurements,
      photos: recentPhotos.map(photo => ({
        id: photo.id.toString(),
        url: photo.url,
        type: photo.type,
        date: photo.created_at,
      })),
      totalEntries,
      lastUpdated,
    };

    return success(summary);
  } catch (err) {
    console.error('Failed to fetch progress summary:', err);
    return error('Failed to fetch progress summary', 500);
  }
}