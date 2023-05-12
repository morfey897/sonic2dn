import type { NextRequest } from 'next/server';
import { json } from '@/edge/response';

export const config = {
	runtime: 'edge',
};

export default function handler(req: NextRequest) {
  // const { pid } = req.query;
  // res.end(`Post: ${pid}`);
  console.log('req', typeof req);
  return json({ test: 'DATA_TEST' });
}