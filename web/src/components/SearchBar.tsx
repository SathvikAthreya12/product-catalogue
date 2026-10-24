import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function SearchBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [term, setTerm] = useState(params.get("q") ?? "");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = term.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form role="search" onSubmit={onSubmit} className="search">
      <input
        aria-label="Search products"
        placeholder="Search products"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
