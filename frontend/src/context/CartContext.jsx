import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCart as getCartApi,
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  removeFromCart as removeFromCartApi,
  clearCart as clearCartApi,
} from "../services/api.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const loadCart = useCallback(async () => {
    try {
      const response = await getCartApi();
      const serverItems = response.data?.data?.items || [];

      const normalizedItems = serverItems
        .filter((item) => item.product)
        .map((item) => ({
          product: item.product,
          quantity: item.quantity,
        }));

      setItems(normalizedItems);
    } catch (error) {
      // If cart load fails, keep local cart empty rather than crashing the app
      // Optionally log error for debugging
      // console.error("Failed to load cart", error);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = async (product, quantity = 1) => {
    await addToCartApi(product.id, quantity);
    await loadCart();
  };

  const updateItemQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCartApi(productId);
      await loadCart();
      return;
    }

    await updateCartItemApi(productId, quantity);
    await loadCart();
  };

  const removeItem = async (productId) => {
    await removeFromCartApi(productId);
    await loadCart();
  };

  const clearCart = async () => {
    await clearCartApi();
    setItems([]);
  };

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      itemCount,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCart,
      reloadCart: loadCart,
    };
  }, [items, loadCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
