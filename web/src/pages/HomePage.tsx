import { api } from "../api/client";
import { useAsync } from "../hooks/useAsync";
import { ProductGrid } from "../components/ProductGrid";

export function HomePage() {
  const featured = useAsync(() => api.featured(), []);

  return (
    <section>
      <h1>Top rated</h1>
      {featured.loading && <p>Loading…</p>}
      {featured.error && <p role="alert">{featured.error}</p>}
      {featured.data && <ProductGrid products={featured.data} />}
    </section>
  );
}
