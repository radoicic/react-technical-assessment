import { FALLBACK_PRODUCT_IMAGE } from "../services/config.js";

function ProductCard({ product, onViewDetails, onAddToCart }) {
  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : FALLBACK_PRODUCT_IMAGE;

  return (
    <article className="product-card">
      <div className="product-image-wrapper">
        <img
          src={image}
          alt={product.name}
          className="product-image"
          onError={(event) => {
            // Prevent infinite loop if fallback also fails
            event.target.onerror = null;
            event.target.src = FALLBACK_PRODUCT_IMAGE;
          }}
        />
      </div>
      <div className="product-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">
          {product.description?.slice(0, 80)}
          {product.description && product.description.length > 80 ? "…" : ""}
        </p>
      </div>
      <div className="product-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onViewDetails}
        >
          View details
        </button>
        <button type="button" className="btn btn-primary" onClick={onAddToCart}>
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
