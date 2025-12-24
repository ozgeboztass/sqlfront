// Student Name: Özge Boztaş
// Student Number: XXXXXXX

import { db } from '@/lib/db';

export async function GET() {
  const [rows] = await db.execute('SELECT * FROM Product');
  return Response.json(rows);
}

export async function POST(req) {
  const body = await req.json();
  await db.execute(
    'INSERT INTO Product (name, price, stock) VALUES (?, ?, ?)',
    [body.name, body.price, body.stock]
  );
  return Response.json({ message: 'Product added' });
}

