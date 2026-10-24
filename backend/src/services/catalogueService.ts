import type { Product } from "../domain/product.js";
import type { ProductSource } from "../domain/ports.js";
import { NotFoundError } from "../domain/errors.js";

export const FEATURED_COUNT = 5;
export const CATEGORY_TOP_RATED_COUNT = 2;

export interface CategorySummary {
  name: string;
  slug: string;
}

export interface CategoryPage {
  category: string;
  topRated: Product[];
  products: Product[];
}

export class CatalogueService {
  constructor(private readonly source: ProductSource) {}

  async getFeatured(): Promise<Product[]> {
    return rankByRating(await this.source.listProducts()).slice(0, FEATURED_COUNT);
  }

  async listCategories(): Promise<CategorySummary[]> {
    const names = new Set((await this.source.listProducts()).map((p) => p.category));
    return [...names].sort().map((name) => ({ name, slug: slugify(name) }));
  }

  async getCategory(slug: string): Promise<CategoryPage | null> {
    const matches = (await this.source.listProducts()).filter(
      (p) => slugify(p.category) === slug,
    );
    if (matches.length === 0) return null;

    const ranked = rankByRating(matches);
    return {
      category: ranked[0].category,
      topRated: ranked.slice(0, CATEGORY_TOP_RATED_COUNT),
      products: ranked.slice(CATEGORY_TOP_RATED_COUNT),
    };
  }

  /** Case-insensitive substring match on title and description. */
  async search(term: string): Promise<Product[]> {
    const needle = term.trim().toLowerCase();
    const matches = (await this.source.listProducts()).filter((p) =>
      `${p.title} ${p.description}`.toLowerCase().includes(needle),
    );
    return rankByRating(matches);
  }

  async getProduct(id: number): Promise<Product> {
    const product = await this.source.getProduct(id);
    if (!product) throw new NotFoundError(`Product ${id} not found`);
    return product;
  }
}

/** Highest rating first; ties broken by number of reviews, then id for stable output. */
export function rankByRating(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => b.rating.rate - a.rating.rate || b.rating.count - a.rating.count || a.id - b.id,
  );
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
