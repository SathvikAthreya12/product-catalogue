import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import type { Product } from "../api/types";
import { useAsync } from "../hooks/useAsync";
import { ProductGrid } from "../components/ProductGrid";

export function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const results = useAsync<Product[]>(() => (q ? api.search(q) : Promise.resolve([])), [q]);

  return (
    <section>
      <h1>{q ? `Results for “${q}”` : "Search"}</h1>
      {results.loading && q && <p>Loading…</p>}
      {results.error && <p role="alert">{results.error}</p>}
      {results.data && results.data.length === 0 && <p>No products match your search.</p>}
      {results.data && results.data.length > 0 && <ProductGrid products={results.data} />}
    </section>
  );
}
