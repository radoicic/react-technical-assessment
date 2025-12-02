// Central place for configuration values to avoid hard-coded constants in the app [[memory:7560626]]

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Local placeholder used when a product image is missing or fails to load
export const FALLBACK_PRODUCT_IMAGE = "/product-placeholder.svg";
