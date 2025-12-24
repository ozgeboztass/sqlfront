'use client';

// Student Name: Özge Boztaş
// Student Number: XXXXXXX

import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map(p => (
          <li key={p.product_id}>
            {p.name} – {p.price} ₺
          </li>
        ))}
      </ul>
    </div>
  );
}
