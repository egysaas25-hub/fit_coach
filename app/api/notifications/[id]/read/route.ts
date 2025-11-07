import { NextRequest } from 'next/server';
import { error } from '@/lib/utils/response';

export async function PATCH(req: NextRequest) {
  return error('Not Implemented', 501);
}
