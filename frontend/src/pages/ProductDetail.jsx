import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { FALLBACK_PRODUCT_IMAGE } from "../services/config.js";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getProduct(id);
        // Backend returns product fields directly under `data`, not `data.product`
        setProduct(response.data.data);
        setActiveImageIndex(0);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Unable to load product. Please try again later.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <section className="page">
        <p className="status-text">Loading product…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <p className="error-text">{error}</p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/products")}
        >
          Back to products
        </button>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page">
        <p className="status-text">Product not found.</p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/products")}
        >
          Back to products
        </button>
      </section>
    );
  }

  const imageList =
    product.images && product.images.length > 0
      ? product.images
      : [FALLBACK_PRODUCT_IMAGE];

  const mainImage = imageList[activeImageIndex] ?? FALLBACK_PRODUCT_IMAGE;

  const reviews = product.reviews || [];

  return (
    <section className="page">
      <button
        type="button"
        className="btn btn-link"
        onClick={() => navigate("/products")}
      >
        ← Back to products
      </button>
      <div className="product-detail">
        <div>
          <div className="product-detail-image-wrapper">
            <img
              src={mainImage}
              alt={product.name}
              className="product-detail-image"
              onError={(event) => {
                event.target.onerror = null;
                event.target.src = FALLBACK_PRODUCT_IMAGE;
              }}
            />
          </div>
          {imageList.length > 1 && (
            <div className="product-thumbnails">
              {imageList.map((src, index) => (
                <button
                  key={src || index}
                  type="button"
                  className={`thumbnail-button${
                    index === activeImageIndex ? " is-active" : ""
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={src || FALLBACK_PRODUCT_IMAGE}
                    alt={`${product.name} ${index + 1}`}
                    className="thumbnail-image"
                    onError={(event) => {
                      event.target.onerror = null;
                      event.target.src = FALLBACK_PRODUCT_IMAGE;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-detail-body">
          <h1>{product.name}</h1>

          <div className="product-meta-row">
            <p className="product-detail-price">
              ${product.price.toFixed(2)}
              {product.compareAtPrice && (
                <span className="product-detail-compare">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </p>
            <div className="product-rating">
              <span className="product-rating-score">
                ★ {product.rating?.toFixed(1) ?? "0.0"}
              </span>
              <span className="product-rating-count">
                ({product.reviewCount ?? 0} reviews)
              </span>
            </div>
          </div>

          <p className="product-detail-description">{product.description}</p>

          <div className="product-extra-meta">
            <span className="badge-soft">
              SKU&nbsp;
              <strong>{product.sku}</strong>
            </span>
            <span className="badge-soft">
              Stock&nbsp;
              <strong>{product.stock}</strong>
            </span>
            {product.status && (
              <span className="badge-soft">{product.status}</span>
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              {product.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {product.specifications && (
            <div className="product-specs">
              <h3>Key details</h3>
              <ul>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => addItem(product, 1)}
          >
            Add to cart
          </button>
        </div>
      </div>

      {reviews.length > 0 && (
        <section className="product-reviews">
          <header className="product-reviews-header">
            <h2>Customer reviews</h2>
            <p className="product-reviews-summary">
              ★ {product.rating?.toFixed(1) ?? "0.0"} •{" "}
              {product.reviewCount ?? reviews.length} total ratings
            </p>
          </header>
          <ul className="review-list">
            {reviews.map((review) => (
              <li key={review.id} className="review-card">
                <div className="review-header">
                  <span className="review-rating">★ {review.rating}</span>
                  <span className="review-title">{review.title}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
                <div className="review-meta">
                  <span className="review-user">User {review.userId}</span>
                  {review.verifiedPurchase && (
                    <span className="review-verified">Verified purchase</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}

export default ProductDetail;
