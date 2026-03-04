'use client';

import { useEffect, useState } from 'react';
import type { ProductsResponse, Product } from '@/lib/types';

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
});

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await fetch('/api/products?limit=50&offset=0', {
          signal: controller.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          const errorPayload = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;
          throw new Error(errorPayload?.message ?? 'Products could not be loaded.');
        }

        const payload = (await response.json()) as ProductsResponse;
        setProducts(payload.data);
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'Unexpected error occurred.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Product List</h1>

      {isLoading ? <p className="mt-4">Loading products...</p> : null}
      {errorMessage ? (
        <p className="mt-4 text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {!isLoading && !errorMessage && products.length === 0 ? (
        <p className="mt-4">No products found.</p>
      ) : null}

      <ul className="mt-6 space-y-3">
        {products.map(p => (
          <li
            key={p.product_id}
            className="rounded border border-black/10 px-4 py-3 shadow-sm"
          >
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-black/70">
              Price: {currencyFormatter.format(p.price)}
            </p>
            <p className="text-sm text-black/70">Stock: {p.stock}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
