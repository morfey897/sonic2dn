
import type { NextRequest } from 'next/server';
import type { KVNamespace, D1Database } from "@cloudflare/workers-types";
import { json } from '@/edge/response';

export const config = {
	runtime: 'edge',
};

export default async function handler(req: NextRequest) {
	const dbd1 = (process.env.D1_V1 as unknown) as D1Database;
	return json({
		dbd1: typeof dbd1,
		name: process.env.SOME_KEY,
	});
}