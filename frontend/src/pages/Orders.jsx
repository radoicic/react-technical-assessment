import { useEffect, useState } from "react";
import { getOrders } from "../services/api.js";
import ErrorMessage from "../components/ErrorMessage.jsx";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getOrders();
      setOrders(response.data.data || []);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to load orders. Please try again later.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <section className="page">
      <header className="page-header">
        <h1>Order history</h1>
        <p className="page-subtitle">
          Review your previous purchases and their status.
        </p>
      </header>

      {isLoading && <p className="status-text">Loading orders…</p>}
      {!isLoading && error && (
        <ErrorMessage message={error} onRetry={loadOrders} />
      )}

      {!isLoading && !error && orders.length === 0 && (
        <p className="status-text">You have no orders yet.</p>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <header className="order-header">
              <div>
                <h2 className="order-id">{order.id}</h2>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="order-tag-row">
                <span className="badge-soft">
                  Status: <strong>{order.status}</strong>
                </span>
                <span className="badge-soft">
                  Total: <strong>${order.total.toFixed(2)}</strong>
                </span>
              </div>
            </header>
            <ul className="order-items">
              {order.items?.map((item) => (
                <li key={item.productId} className="order-item">
                  <div className="order-item-main">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-price">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="order-item-meta">
                    <span>Qty: {item.quantity}</span>
                    <span>
                      Line total: ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="order-footer">
              <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
              <span>Tax: ${order.tax.toFixed(2)}</span>
              <span>Shipping: ${order.shipping.toFixed(2)}</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Orders;
