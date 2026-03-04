# SQL Front

MySQL tabanli urun listesi uygulamasi (Next.js App Router + TypeScript).

## Gereksinimler

- Node.js 20+
- MySQL 8+

## Kurulum

1. Bagimliliklari kur:
   ```bash
   npm ci
   ```
2. Ortam degiskenlerini hazirla:
   ```bash
   cp .env.example .env.local
   ```
3. Veritabaninda ornek tabloyu olustur:
   ```sql
   CREATE DATABASE IF NOT EXISTS ecommerce_db;
   USE ecommerce_db;

   CREATE TABLE IF NOT EXISTS Product (
     product_id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(120) NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     stock INT NOT NULL DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```
4. Uygulamayi baslat:
   ```bash
   npm run dev
   ```

## Ortam Degiskenleri

`.env.local` icin gerekli alanlar:

```bash
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=change_me
DB_NAME=ecommerce_db
```

## API

### `GET /api/products?limit=20&offset=0`

- Urunleri `product_id DESC` sirasiyla getirir.
- `limit` en fazla `100` olabilir.
- Donus:
  ```json
  {
    "data": [],
    "pagination": {
      "limit": 20,
      "offset": 0,
      "count": 0
    }
  }
  ```

### `POST /api/products`

- Beklenen body:
  ```json
  {
    "name": "Notebook",
    "price": 49.9,
    "stock": 7
  }
  ```
- Dogrulama:
  - `name` bos olamaz ve 120 karakterden kisa olmali.
  - `price` negatif olamaz.
  - `stock` negatif olamaz ve tam sayi olmali.

## Komutlar

- `npm run dev`: Gelistirme ortami
- `npm run lint`: ESLint kontrolu
- `npm run typecheck`: TypeScript tip kontrolu
- `npm run test`: Vitest testleri
- `npm run build`: Uretim build'i

## CI

GitHub Actions workflow'u su adimlari calistirir:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test`
5. `npm run build`
