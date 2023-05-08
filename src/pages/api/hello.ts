
import type { NextRequest } from 'next/server';
import type { KVNamespace, D1Database } from "@cloudflare/workers-types";

export const config = {
	runtime: 'edge',
};

export default async function handler(req: NextRequest) {
	const db = (process.env.D1_TEST_DB as unknown) as D1Database;
	return new Response(
		JSON.stringify({
			name: process.env.SOME_KEY,
		}),
		{
			status: 200,
			headers: {
				'content-type': 'application/json',
			},
		}
	);
}