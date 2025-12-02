import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const navigate = useNavigate();
  const { addItem } = useCart();

  const loadProducts = async (overrides = {}) => {
    setIsLoading(true);
    setError("");
    try {
      const params = {};
      const term = overrides.search ?? searchTerm;
      const featured = overrides.featured ?? featuredOnly;

      if (term) params.search = term;
      if (featured) params.featured = "true";

      const response = await getProducts(params);
      const { data } = response.data;
      setProducts(data.products || []);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to load products. Please try again later.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadProducts({ search: searchTerm });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFeaturedOnly(false);
    loadProducts({ search: "", featured: false });
  };

  return (
    <section className="page">
      <header className="page-header">
        <h1>Products</h1>
        <p className="page-subtitle">
          Browse products from the marketplace and add them to your cart.
        </p>
      </header>

      <form className="products-toolbar" onSubmit={handleSubmit}>
        <input
          type="search"
          className="search-input"
          placeholder="Search products…"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <label className="checkbox-pill">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(event) => {
              const next = event.target.checked;
              setFeaturedOnly(next);
              loadProducts({ featured: next });
            }}
          />
          <span>Featured only</span>
        </label>
        <button type="submit" className="btn btn-secondary">
          Apply
        </button>
        <button
          type="button"
          className="btn btn-link"
          onClick={handleClearFilters}
        >
          Clear
        </button>
      </form>

      {isLoading && <p className="status-text">Loading products…</p>}
      {!isLoading && error && (
        <ErrorMessage message={error} onRetry={() => loadProducts()} />
      )}

      {!isLoading && !error && products.length === 0 && (
        <p className="status-text">
          {searchTerm
            ? "No products match your search. Try a different keyword."
            : "No products available right now."}
        </p>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={() => navigate(`/products/${product.id}`)}
            onAddToCart={() => addItem(product, 1)}
          />
        ))}
      </div>
    </section>
  );
}

export default Products;
