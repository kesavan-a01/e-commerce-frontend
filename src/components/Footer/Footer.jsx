import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <h3 className="footer-logo">Shop<span>Ease</span></h3>
          <p className="text-muted">
            Your one-stop destination for quality products at great prices.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">My Orders</Link>
        </div>

        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/profile">Profile</Link>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p className="text-muted">support@shopease.com</p>
          <p className="text-muted">+91 98765 43210</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} ShopEase. All rights reserved. Built as an internship project.</p>
      </div>
    </footer>
  );
};

export default Footer;
