import type { RowDataPacket } from "mysql2";
import { pool } from "../../config/db.js";

export interface Product extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  sku: string;
  slug: string;
  image: string;
  extras: Record<string, unknown>;
  created_at: Date | null;
  updated_at: Date | null;
}

export class ProductRepository {
  async getAll(): Promise<Product[]> {
    const [rows] = await pool.query<Product[]>(
      ` SELECT id, name, description, category, price, discount, stock, sku, slug, image, extras, created_at, updated_at FROM products ORDER BY created_at DESC `,
    );
    return rows;
  }

  async getBySlug(slug: string): Promise<Product | undefined> {
    const [rows] = await pool.query<Product[]>(
      `SELECT id, name, description, category, price, discount, stock, sku, slug, image, extras, created_at, updated_at FROM products WHERE slug = ?`,
      [slug],
    );

    return rows[0];
  }
}
