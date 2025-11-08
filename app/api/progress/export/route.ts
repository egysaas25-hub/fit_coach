// import { NextRequest, NextResponse } from 'next/server';
// import { requireAuth } from '@/lib/middleware/auth.middleware';
// import { database, ProgressEntry } from '@/lib/mock-db/database';
// import { error, forbidden } from '@/lib/utils/response';
// import { ensureDbInitialized } from '@/lib/db/init';
// import { exportProgressToCSV, generatePDFReport } from '@/lib/utils/export';
// import { logger } from '@/lib/utils/logger';

// /**
//  * GET /api/progress/export
//  * Export progress data as CSV or PDF
//  */
// export async function GET(req: NextRequest) {
//   ensureDbInitialized();
//   const authResult = await requireAuth(req);
//   if (authResult instanceof NextResponse) return authResult;

//   const { user } = authResult;

//   try {
//     const { searchParams } = new URL(req.url);
//     const clientId = searchParams.get('clientId');
//     const format = searchParams.get('format') || 'csv'; // csv or pdf
//     const fromDate = searchParams.get('from');
//     const toDate = searchParams.get('to');

//     // Determine client ID
//     let finalClientId = clientId;
//     if (user.role === 'client') {
//       finalClientId = user.id;
//     } else if (!clientId) {
//       return error('clientId parameter is required', 400);
//     }

//     // Get client for name
//     const client = database.get('clients', finalClientId);
//     if (!client) {
//       return error('Client not found', 404);
//     }

//     // Get progress entries
//     let entries = database.query<ProgressEntry>(
//       'progressEntries',
//       (e) => e.clientId === finalClientId
//     );

//     // Filter by date range
//     if (fromDate) {
//       const from = new Date(fromDate);
//       entries = entries.filter((e) => new Date(e.date) >= from);
//     }
//     if (toDate) {
//       const to = new Date(toDate);
//       entries = entries.filter((e) => new Date(e.date) <= to);
//     }

//     // Sort by date
//     entries = database.sort(entries, 'date', 'asc');

//     logger.info('Exporting progress data', {
//       clientId: finalClientId,
//       format,
//       entriesCount: entries.length,
//       userId: user.id,
//     });

//     if (format === 'csv') {
//       const csv = exportProgressToCSV(entries);
//       const filename = `progress_${finalClientId}_${Date.now()}.csv`;

//       return new NextResponse(csv, {
//         status: 200,
//         headers: {
//           'Content-Type': 'text/csv',
//           'Content-Disposition': `attachment; filename="${filename}"`,
//         },
//       });
//     } else if (format === 'pdf') {
//       // Calculate summary
//       const weightEntries = entries.filter((e) => e.metric === 'weight');
//       const summary = {
//         totalEntries: entries.length,
//         startWeight: weightEntries[0]?.value || 'N/A',
//         currentWeight: weightEntries[weightEntries.length - 1]?.value || 'N/A',
//         weightChange:
//           weightEntries.length > 1
//             ? (
//                 (weightEntries[weightEntries.length - 1]?.value || 0) -
//                 (weightEntries[0]?.value || 0)
//               ).toFixed(2)
//             : 'N/A',
//       };

//       const html = generatePDFReport({
//         title: 'Progress Report',
//         clientName: (client as any).name || 'Client',
//         dateRange: {
//           start: fromDate || 'Beginning',
//           end: toDate || 'Now',
//         },
//         progressData: entries,
//         summary,
//       });