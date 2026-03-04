import { NextRequest, NextResponse } from 'next/server';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getDbPool } from '@/lib/db';
import { parsePagination, validateCreateProduct } from '@/lib/product-validation';
import type { Product, ProductsResponse } from '@/lib/types';

type ProductRow = RowDataPacket & Product;

export async function GET(request: NextRequest) {
  try {
    const db = getDbPool();
    const { limit, offset } = parsePagination(request.nextUrl.searchParams);
    const [rows] = await db.query<ProductRow[]>(
      `
        SELECT product_id, name, price, stock
        FROM Product
        ORDER BY product_id DESC
        LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    const response: ProductsResponse = {
      data: rows,
      pagination: {
        limit,
        offset,
        count: rows.length,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('GET /api/products failed', error);
    return NextResponse.json(
      { message: 'Products could not be loaded.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }

  const validation = validateCreateProduct(body);
  if (!validation.ok) {
    return NextResponse.json({ message: validation.message }, { status: 400 });
  }

  try {
    const db = getDbPool();
    const { name, price, stock } = validation.data;
    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO Product (name, price, stock) VALUES (?, ?, ?)',
      [name, price, stock]
    );

    return NextResponse.json(
      {
        message: 'Product added.',
        product: {
          product_id: result.insertId,
          name,
          price,
          stock,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/products failed', error);
    return NextResponse.json(
      { message: 'Product could not be created.' },
      { status: 500 }
    );
  }
}
