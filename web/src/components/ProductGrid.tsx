import { Link } from "react-router-dom";
import type { Product } from "../api/types";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid">
      {products.map((product) => (
        <li key={product.id}>
          <Link to={`/products/${product.id}`} className="card">
            <img src={product.image} alt={product.title} loading="lazy" />
            <h3>{product.title}</h3>
            <p className="price">${product.price.toFixed(2)}</p>
            <p className="rating">
              ★ {product.rating.rate} ({product.rating.count})
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
