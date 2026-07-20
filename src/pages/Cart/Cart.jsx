import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import EmptyState from "../../components/EmptyState/EmptyState";
import { formatPrice, getImageUrl } from "../../utils/formatters";
import "./Cart.css";

const Cart = () => {
  const { cart, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container page-wrapper">
        <EmptyState
          title="Your Cart is Empty"
          message="Looks like you haven't added anything to your cart yet."
          actionLabel="Continue Shopping"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <h1 className="mb-24">Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div className="cart-item card" key={item._id}>
              <img
                src={getImageUrl(item.product?.image)}
                alt={item.product?.name}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <Link to={`/products/${item.product?._id}`}>
                  <h4>{item.product?.name}</h4>
                </Link>
                <p className="text-muted">{formatPrice(item.price)} each</p>

                <div className="cart-item-controls">
                  <div className="quantity-selector">
                    <button
                      onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          Math.min(item.product?.stock || item.quantity, item.quantity + 1)
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <button className="btn-link-danger" onClick={() => removeItem(item._id)}>
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-item-subtotal">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}

          <button className="btn btn-outline btn-sm mt-16" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        <div className="cart-summary card">
          <h3 className="mb-16">Order Summary</h3>
          <div className="flex-between mb-8">
            <span className="text-muted">Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex-between mb-16">
            <span className="text-muted">Shipping</span>
            <span className="text-muted">Free</span>
          </div>
          <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "12px 0" }} />
          <div className="flex-between mb-24">
            <strong>Total</strong>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          <button className="btn btn-primary btn-block" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
          <Link to="/products" className="btn btn-outline btn-block mt-8">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
