import { z } from "zod";
import type { Product } from "../domain/product.js";
import type { ProductSource } from "../domain/ports.js";
import { UpstreamError } from "../domain/errors.js";

const fakeStoreProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  image: z.string(),
  rating: z.object({ rate: z.number(), count: z.number() }),
});
const fakeStoreListSchema = z.array(fakeStoreProductSchema);

interface CacheEntry {
  fetchedAt: number;
  products: Product[];
}

/**
 * Adapter for https://fakestoreapi.com. The rest of the app depends only on the
 * ProductSource port, so this file is the one to replace when the real data source arrives.
 */
export class FakeStoreProductSource implements ProductSource {
  private cache: CacheEntry | null = null;

  constructor(
    private readonly baseUrl: string,
    private readonly ttlMs = 5 * 60_000,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  async listProducts(): Promise<Product[]> {
    if (this.cache && Date.now() - this.cache.fetchedAt < this.ttlMs) {
      return this.cache.products;
    }
    const products = await this.fetchAll();
    this.cache = { fetchedAt: Date.now(), products };
    return products;
  }

  async getProduct(id: number): Promise<Product | null> {
    const products = await this.listProducts();
    return products.find((p) => p.id === id) ?? null;
  }

  private async fetchAll(): Promise<Product[]> {
    try {
      const res = await this.fetchFn(`${this.baseUrl}/products`, {
        signal: AbortSignal.timeout(5_000),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      return fakeStoreListSchema.parse(await res.json());
    } catch (cause) {
      throw new UpstreamError("Product data is temporarily unavailable", { cause });
    }
  }
}
