import { useCart } from "../context/CartContext.jsx";

function Cart() {
  const { items, updateItemQuantity, removeItem } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <section className="cart">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started.</p>
      </section>
    );
  }

  return (
    <section className="cart">
      <h2>Your cart</h2>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.product.id} className="cart-item">
            <div className="cart-item-main">
              <span className="cart-item-name">{item.product.name}</span>
              <span className="cart-item-price">
                ${item.product.price.toFixed(2)}
              </span>
            </div>
            <div className="cart-item-controls">
              <label className="cart-qty-label">
                Qty:
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItemQuantity(
                      item.product.id,
                      Number(e.target.value) || 1
                    )
                  }
                />
              </label>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => removeItem(item.product.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <span>Subtotal:</span>
        <strong>${subtotal.toFixed(2)}</strong>
      </div>
    </section>
  );
}

export default Cart;
