import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAsync } from "../hooks/useAsync";
import { EnquiryForm } from "../components/EnquiryForm";

export function ProductPage() {
  const { id = "" } = useParams();
  const product = useAsync(() => api.product(Number(id)), [id]);

  if (product.loading) return <p>Loading…</p>;
  if (product.error) return <p role="alert">{product.error}</p>;
  if (!product.data) return null;

  const p = product.data;
  return (
    <article className="product">
      <img src={p.image} alt={p.title} />
      <div>
        <h1>{p.title}</h1>
        <p className="category">{p.category}</p>
        <p className="price">${p.price.toFixed(2)}</p>
        <p className="rating">
          ★ {p.rating.rate} ({p.rating.count} reviews)
        </p>
        <p>{p.description}</p>
        <EnquiryForm productId={p.id} />
      </div>
    </article>
  );
}
