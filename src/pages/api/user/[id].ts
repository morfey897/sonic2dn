import type { NextRequest } from 'next/server';
import { json } from '@/edge/response';
import type { D1Database } from "@cloudflare/workers-types";

export const config = {
  runtime: 'edge',
};

type UserType = {
  id: number;
  name: string;
  email: string;
}

export default async function handler(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return json({ error: "Id is null" }, 404);
  const db = (process.env.D1_V1 as unknown) as D1Database;
  console.log('db', process.env);
  const stmt = db.prepare('SELECT id, name, email FROM User WHERE id = ?1');
  const users = await stmt.bind(parseInt(id)).all<UserType>();
  const [user] = users.results || [];
  console.log('young', users);
  return json({ test: 'DATA_TEST', user });
}