import axios from "axios";
import { API_BASE_URL } from "./config.js";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) =>
  api.post("/auth/login", { email, password });

export const getProducts = (params) => api.get("/products", { params });

export const getProduct = (id) => api.get(`/products/${id}`);

export const getProfile = () => api.get("/auth/profile");

export const updateProfile = (payload) => api.put("/auth/profile", payload);

export const getOrders = () => api.get("/orders");

// Cart APIs
export const getCart = () => api.get("/cart");

export const addToCart = (productId, quantity = 1) =>
  api.post("/cart", { productId, quantity });

export const updateCartItem = (productId, quantity) =>
  api.put(`/cart/${productId}`, { quantity });

export const removeFromCart = (productId) => api.delete(`/cart/${productId}`);

export const clearCart = () => api.delete("/cart");

export default api;
