import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAsync } from "../hooks/useAsync";
import { ProductGrid } from "../components/ProductGrid";

export function CategoryPage() {
  const { slug = "" } = useParams();
  const page = useAsync(() => api.category(slug), [slug]);

  if (page.loading) return <p>Loading…</p>;
  if (page.error) return <p role="alert">{page.error}</p>;
  if (!page.data) return null;

  const { category, topRated, products } = page.data;
  return (
    <section>
      <h1>{category}</h1>
      <h2>Top rated</h2>
      <ProductGrid products={topRated} />
      {products.length > 0 && (
        <>
          <h2>More in {category}</h2>
          <ProductGrid products={products} />
        </>
      )}
    </section>
  );
}
