export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
}

export type ProductValidationResult =
  | { ok: true; data: CreateProductInput }
  | { ok: false; message: string };

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MAX_NAME_LENGTH = 120;

export function validateCreateProduct(payload: unknown): ProductValidationResult {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, message: 'Payload must be a JSON object.' };
  }

  const body = payload as Record<string, unknown>;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const price = typeof body.price === 'number' ? body.price : Number(body.price);
  const stock = typeof body.stock === 'number' ? body.stock : Number(body.stock);

  if (!name) {
    return { ok: false, message: 'name is required.' };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return {
      ok: false,
      message: `name must be ${MAX_NAME_LENGTH} characters or shorter.`,
    };
  }

  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, message: 'price must be a non-negative number.' };
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return { ok: false, message: 'stock must be a non-negative integer.' };
  }

  return {
    ok: true,
    data: {
      name,
      price,
      stock,
    },
  };
}

export function parsePagination(searchParams: URLSearchParams): {
  limit: number;
  offset: number;
} {
  const limitValue = Number(searchParams.get('limit') ?? DEFAULT_LIMIT);
  const offsetValue = Number(searchParams.get('offset') ?? 0);

  const limit =
    Number.isInteger(limitValue) && limitValue > 0
      ? Math.min(limitValue, MAX_LIMIT)
      : DEFAULT_LIMIT;

  const offset =
    Number.isInteger(offsetValue) && offsetValue >= 0 ? offsetValue : 0;

  return { limit, offset };
}
