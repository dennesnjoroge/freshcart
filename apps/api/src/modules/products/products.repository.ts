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
      `SELECT id, name, description, category, price, discount, stock, sku, slug, image, extras, created_at, updated_at FROM products ORDER BY created_at DESC`,
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

  async getRandom() {
    const [rows] = await pool.execute(`
    SELECT *
    FROM products
    ORDER BY RAND()
    LIMIT 10
  `);

    return rows;
  }

  getDeals = async () => {
    const [rows] = await pool.execute(
      `SELECT * FROM products WHERE discount > 30 ORDER BY RAND() LIMIT 10`,
    );

    return rows;
  };

  async getByCategory(category: string): Promise<Product[]> {
    const [rows] = await pool.query<Product[]>(
      `SELECT id, name, description, category, price, discount, stock, sku, slug, image, extras, created_at, updated_at FROM products WHERE category = ? ORDER BY created_at DESC`,
      [category],
    );
    return rows;
  }
}
