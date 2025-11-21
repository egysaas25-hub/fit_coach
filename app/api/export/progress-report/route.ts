import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { pdfGenerator } from "@/lib/services/pdf-generator"

/**
 * POST /api/export/progress-report
 * Generate a progress report PDF for a client
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { clientId, dateRange } = body

    if (!clientId) {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 400 }
      )
    }

    if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
      return NextResponse.json(
        { error: "dateRange with startDate and endDate is required" },
        { status: 400 }
      )
    }

    // Fetch client data
    const client = await prisma.customers.findUnique({
      where: { id: BigInt(clientId) },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone_e164: true,
      },
    })

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    const clientName = `${client.first_name || ""} ${client.last_name || ""}`.trim() || "Client"
    const clientCode = client.phone_e164 || String(client.id)

    // Fetch progress metrics within date range
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)

    const progressData = await prisma.progress_tracking.findMany({
      where: {
        customer_id: BigInt(clientId),
        recorded_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { recorded_at: "asc" },
      select: {
        recorded_at: true,
        weight_kg: true,
        notes: true,
      },
    })

    const inbodyData = await prisma.inbody_metrics.findMany({
      where: {
        customer_id: BigInt(clientId),
        recorded_at: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { recorded_at: "asc" },
      select: {
        recorded_at: true,
        weight_kg: true,
        body_fat_percent: true,
        muscle_mass_kg: true,
        bmi: true,
      },
    })

    // Fetch progress photos (if uploaded_files table exists)
    let progressPhotos: Array<{ blob_url: string; filename: string; created_at: Date }> = []
    try {
      progressPhotos = await (prisma as any).uploaded_files.findMany({
        where: {
          customer_id: BigInt(clientId),
          category: "progress-photo",
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { created_at: "asc" },
        select: {
          blob_url: true,
          filename: true,
          created_at: true,
        },
      })
    } catch (error) {
      // Table might not exist yet, continue without photos
      console.log("uploaded_files table not available:", error)
    }

    // Prepare metrics data
    const weightData = [
      ...progressData
        .filter((p) => p.weight_kg)
        .map((p) => ({
          date: p.recorded_at.toISOString(),
          value: Number(p.weight_kg),
        })),
      ...inbodyData
        .filter((i) => i.weight_kg)
        .map((i) => ({
          date: i.recorded_at.toISOString(),
          value: Number(i.weight_kg),
        })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const bodyFatData = inbodyData
      .filter((i) => i.body_fat_percent)
      .map((i) => ({
        date: i.recorded_at.toISOString(),
        value: Number(i.body_fat_percent),
      }))

    const muscleMassData = inbodyData
      .filter((i) => i.muscle_mass_kg)
      .map((i) => ({
        date: i.recorded_at.toISOString(),
        value: Number(i.muscle_mass_kg),
      }))

    // Prepare photos (before, after, side)
    const photos: { before?: string; after?: string; side?: string } = {}
    if (progressPhotos.length > 0) {
      photos.before = progressPhotos[0]?.blob_url
      if (progressPhotos.length > 1) {
        photos.after = progressPhotos[progressPhotos.length - 1]?.blob_url
      }
      if (progressPhotos.length > 2) {
        photos.side = progressPhotos[Math.floor(progressPhotos.length / 2)]?.blob_url
      }
    }

    // Collect achievements/notes
    const achievements = progressData
      .filter((p) => p.notes)
      .map((p) => p.notes as string)
      .slice(0, 5) // Limit to 5 achievements

    // Get trainer name from session
    const trainerName = session.user?.full_name || "Your Coach"

    // Generate PDF
    const pdfUrl = await pdfGenerator.generateProgressReportPDF({
      clientId: String(clientId),
      clientName,
      clientCode,
      dateRange: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      },
      metrics: {
        weight: weightData.length > 0 ? weightData : undefined,
        bodyFat: bodyFatData.length > 0 ? bodyFatData : undefined,
        muscleMass: muscleMassData.length > 0 ? muscleMassData : undefined,
      },
      photos: Object.keys(photos).length > 0 ? photos : undefined,
      achievements: achievements.length > 0 ? achievements : undefined,
      trainerName,
    })

    return NextResponse.json({
      success: true,
      pdfUrl,
      message: "Progress report generated successfully",
    })
  } catch (error) {
    console.error("Error generating progress report:", error)
    return NextResponse.json(
      { error: "Failed to generate progress report" },
      { status: 500 }
    )
  }
}
