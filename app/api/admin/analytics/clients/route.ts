import { NextRequest } from 'next/server';
import { error } from '@/lib/utils/response';

export async function GET(req: NextRequest) {
  return error('Not Implemented', 501);
}
