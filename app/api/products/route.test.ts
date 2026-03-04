// @vitest-environment node

import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const queryMock = vi.fn();
const executeMock = vi.fn();

vi.mock('@/lib/db', () => ({
  getDbPool: () => ({
    query: queryMock,
    execute: executeMock,
  }),
}));

import { GET, POST } from './route';

describe('GET /api/products', () => {
  beforeEach(() => {
    queryMock.mockReset();
    executeMock.mockReset();
  });

  it('returns product data with pagination', async () => {
    queryMock.mockResolvedValue([
      [
        {
          product_id: 1,
          name: 'Kalem',
          price: 12.5,
          stock: 10,
        },
      ],
      [],
    ]);

    const request = new NextRequest(
      'http://localhost:3000/api/products?limit=5&offset=0'
    );
    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(queryMock).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [
      5,
      0,
    ]);
    expect(payload).toMatchObject({
      data: [
        {
          product_id: 1,
          name: 'Kalem',
        },
      ],
      pagination: {
        limit: 5,
        offset: 0,
        count: 1,
      },
    });
  });
});

describe('POST /api/products', () => {
  beforeEach(() => {
    queryMock.mockReset();
    executeMock.mockReset();
  });

  it('returns 400 for invalid payload', async () => {
    const request = new NextRequest('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: '',
        price: 10,
        stock: 1,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('creates product for valid payload', async () => {
    executeMock.mockResolvedValue([
      {
        insertId: 42,
      },
      [],
    ]);

    const request = new NextRequest('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Defter',
        price: 35.5,
        stock: 4,
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(executeMock).toHaveBeenCalled();
    expect(payload.product).toMatchObject({
      product_id: 42,
      name: 'Defter',
      price: 35.5,
      stock: 4,
    });
  });
});
