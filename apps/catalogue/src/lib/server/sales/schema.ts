// Bảng của phần bán hàng; db.ts chạy cùng các bảng khác lúc khởi động (CREATE ... IF NOT EXISTS, chạy lại không sao).
// Tiền là bigint (đồng), số lượng numeric(14, 3) để bán theo mét, kg. Mỗi database có đúng một "Khách lẻ" (walk_in).
// Không có dấu chấm phẩy trong thân lệnh: db.ts tách lệnh theo dấu chấm phẩy.
export const SALES_SCHEMA = `
CREATE TABLE IF NOT EXISTS customers (
  id serial PRIMARY KEY,
  name text NOT NULL,
  phone text,
  address text,
  kind text NOT NULL DEFAULT 'si' CHECK (kind IN ('le', 'si')),
  walk_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS customers_walk_in ON customers (walk_in) WHERE walk_in;
CREATE TABLE IF NOT EXISTS stock (
  sku text PRIMARY KEY,
  quantity numeric(14, 3) NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers(id),
  created_at timestamptz NOT NULL,
  subtotal bigint NOT NULL,
  discount bigint NOT NULL DEFAULT 0,
  total bigint NOT NULL,
  paid bigint NOT NULL DEFAULT 0,
  note text,
  created_by text,
  cancelled_at timestamptz
);
CREATE INDEX IF NOT EXISTS orders_customer ON orders (customer_id, created_at);
CREATE TABLE IF NOT EXISTS order_items (
  order_id integer NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  line integer NOT NULL,
  sku text NOT NULL,
  name text NOT NULL,
  unit text NOT NULL,
  quantity numeric(14, 3) NOT NULL,
  unit_price bigint NOT NULL,
  amount bigint NOT NULL,
  PRIMARY KEY (order_id, line)
);
CREATE TABLE IF NOT EXISTS payments (
  id serial PRIMARY KEY,
  customer_id integer NOT NULL REFERENCES customers(id),
  order_id integer REFERENCES orders(id),
  amount bigint NOT NULL,
  note text,
  created_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS payments_customer ON payments (customer_id, created_at);
INSERT INTO customers (name, kind, walk_in) SELECT 'Khách lẻ', 'le', true WHERE NOT EXISTS (SELECT 1 FROM customers WHERE walk_in)
`;
