import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          Shop<span>Ease</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>

          {isAuthenticated && (
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="navbar-cart">
              Cart
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
          )}

          {isAuthenticated && (
            <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
          )}

          {isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}

          {isAuthenticated ? (
            <div className="navbar-user">
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="navbar-username">
                Hi, {user?.fullName?.split(" ")[0]}
              </Link>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-user">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
