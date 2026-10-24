import { describe, it, expect } from "vitest";
import { CatalogueService, slugify } from "./catalogueService.js";
import { InMemoryProductSource } from "../testing/fixtures.js";
import { NotFoundError } from "../domain/errors.js";

const service = () => new CatalogueService(new InMemoryProductSource());

describe("CatalogueService", () => {
  it("features the five top-rated products", async () => {
    const featured = await service().getFeatured();
    expect(featured.map((p) => p.id)).toEqual([3, 2, 6, 7, 4]);
  });

  it("lists categories with URL-safe slugs", async () => {
    const categories = await service().listCategories();
    expect(categories.map((c) => c.slug)).toEqual([
      "electronics",
      "jewelery",
      "mens-clothing",
      "womens-clothing",
    ]);
  });

  it("splits a category into top-rated and additional products", async () => {
    const page = await service().getCategory("electronics");
    expect(page?.category).toBe("electronics");
    expect(page?.topRated.map((p) => p.id)).toEqual([3, 4]);
    expect(page?.products.map((p) => p.id)).toEqual([8]);
  });

  it("returns null for an unknown category", async () => {
    expect(await service().getCategory("garden")).toBeNull();
  });

  it("search matches title or description, case-insensitively, ranked by rating", async () => {
    const results = await service().search("LAPTOP");
    expect(results.map((p) => p.id)).toEqual([8, 1]);
  });

  it("search returns only products whose text matches", async () => {
    const results = await service().search("ring");
    expect(results.map((p) => p.id)).toEqual([2]);
    expect(await service().search("zzzz")).toEqual([]);
  });

  it("getProduct throws NotFoundError for an unknown id", async () => {
    await expect(service().getProduct(999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("slugify removes apostrophes and separates words with hyphens", () => {
    expect(slugify("men's clothing")).toBe("mens-clothing");
  });
});
