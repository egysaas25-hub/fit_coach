import { NextRequest } from 'next/server';
import { error } from '@/lib/utils/response';

export async function GET(req: NextRequest) {
  return error('Not Implemented', 501);
}

export async function PATCH(req: NextRequest) {
  return error('Not Implemented', 501);
}

export async function DELETE(req: NextRequest) {
    return error('Not Implemented', 501);
}
