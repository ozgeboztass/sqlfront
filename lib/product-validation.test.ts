import { describe, expect, it } from 'vitest';
import { parsePagination, validateCreateProduct } from './product-validation';

describe('validateCreateProduct', () => {
  it('accepts valid payloads', () => {
    const result = validateCreateProduct({
      name: 'Notebook',
      price: '49.90',
      stock: 7,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        name: 'Notebook',
        price: 49.9,
        stock: 7,
      });
    }
  });

  it('rejects invalid payloads', () => {
    const result = validateCreateProduct({
      name: '',
      price: -10,
      stock: 1,
    });

    expect(result.ok).toBe(false);
  });
});

describe('parsePagination', () => {
  it('uses bounded numeric values', () => {
    const params = new URLSearchParams({
      limit: '150',
      offset: '5',
    });

    expect(parsePagination(params)).toEqual({
      limit: 100,
      offset: 5,
    });
  });

  it('falls back for invalid values', () => {
    const params = new URLSearchParams({
      limit: '-1',
      offset: 'abc',
    });

    expect(parsePagination(params)).toEqual({
      limit: 20,
      offset: 0,
    });
  });
});
