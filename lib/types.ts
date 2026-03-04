export interface Product {
  product_id: number;
  name: string;
  price: number;
  stock: number;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
  };
}
