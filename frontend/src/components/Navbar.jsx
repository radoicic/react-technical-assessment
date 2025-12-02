import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Navbar() {
  const { user, token, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isLoginPage = location.pathname === "/login";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsUserMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/products" className="navbar-brand">
          Marketplace
        </Link>
      </div>
      <nav className="navbar-center">
        {token && (
          <>
            <Link to="/products" className="navbar-link">
              Products
            </Link>
            <Link to="/orders" className="navbar-link">
              Orders
            </Link>
          </>
        )}
      </nav>
      <div className="navbar-right">
        {token && (
          <button
            type="button"
            className="cart-button"
            onClick={() => navigate("/cart")}
          >
            Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </button>
        )}
        {token ? (
          <div className="navbar-user-menu">
            <button
              type="button"
              className="navbar-user-button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
            >
              {user?.firstName ? `Hi, ${user.firstName}` : user?.email}
            </button>
            {isUserMenuOpen && (
              <div className="navbar-user-popover">
                <button
                  type="button"
                  className="navbar-user-popover-item"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="navbar-user-popover-item"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : !isLoginPage ? (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;
