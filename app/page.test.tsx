import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Home from './page';

describe('Home page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders fetched products', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            product_id: 1,
            name: 'Kalem',
            price: 12.5,
            stock: 10,
          },
        ],
        pagination: {
          limit: 50,
          offset: 0,
          count: 1,
        },
      }),
    } as Response);

    vi.stubGlobal('fetch', fetchMock);
    render(<Home />);

    expect(screen.getByText('Loading products...')).toBeInTheDocument();
    expect(await screen.findByText('Kalem')).toBeInTheDocument();
    expect(screen.getByText('Stock: 10')).toBeInTheDocument();
  });

  it('renders error when API fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        message: 'Products could not be loaded.',
      }),
    } as Response);

    vi.stubGlobal('fetch', fetchMock);
    render(<Home />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Products could not be loaded.'
    );
  });
});
