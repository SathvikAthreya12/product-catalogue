import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { api } from "../api/client";
import type { CategorySummary } from "../api/types";
import { SearchBar } from "./SearchBar";

export function Layout() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">
          Catalogue
        </Link>
        <SearchBar />
      </header>
      <nav className="categories">
        {categories.map((c) => (
          <NavLink key={c.slug} to={`/category/${c.slug}`}>
            {c.name}
          </NavLink>
        ))}
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
