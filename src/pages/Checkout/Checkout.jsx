import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import orderService from "../../services/orderService";
import { formatPrice, getImageUrl } from "../../utils/formatters";
import "./Checkout.css";

const Checkout = () => {
  const { cart, totalPrice, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value || !value.trim()) newErrors[key] = "This field is required";
    });
    if (formData.pincode && !/^\d{4,6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid pincode";
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setPlacing(true);
      const res = await orderService.placeOrder(formData);
      await refreshCart();
      toast.success("Order placed successfully!");
      navigate("/orders", { state: { newOrderId: res.data._id } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container page-wrapper">
        <p>Your cart is empty. <a href="/products">Continue shopping</a></p>
      </div>
    );
  }

  return (
    <div className="container page-wrapper">
      <h1 className="mb-24">Checkout</h1>

      <div className="checkout-layout">
        <form className="card checkout-form" onSubmit={handlePlaceOrder} noValidate>
          <h3 className="mb-16">Shipping Details</h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} placeholder="10-digit number" />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" name="address" className="form-input" value={formData.address} onChange={handleChange} />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">City</label>
              <input type="text" name="city" className="form-input" value={formData.city} onChange={handleChange} />
              {errors.city && <p className="form-error">{errors.city}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input type="text" name="state" className="form-input" value={formData.state} onChange={handleChange} />
              {errors.state && <p className="form-error">{errors.state}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Pincode</label>
            <input type="text" name="pincode" className="form-input" value={formData.pincode} onChange={handleChange} />
            {errors.pincode && <p className="form-error">{errors.pincode}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={placing}>
            {placing ? "Placing Order..." : `Place Order — ${formatPrice(totalPrice)}`}
          </button>
        </form>

        <div className="card checkout-summary">
          <h3 className="mb-16">Order Summary</h3>
          {cart.items.map((item) => (
            <div key={item._id} className="checkout-summary-item">
              <img src={getImageUrl(item.product?.image)} alt={item.product?.name} />
              <div className="checkout-summary-info">
                <p>{item.product?.name}</p>
                <span className="text-muted">Qty: {item.quantity}</span>
              </div>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "16px 0" }} />
          <div className="flex-between">
            <strong>Total</strong>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>
          <p className="text-muted mt-16" style={{ fontSize: "0.85rem" }}>
            No payment gateway is used — this is a demo checkout for internship purposes. Your order will be recorded directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
