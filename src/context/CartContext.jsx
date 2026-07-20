import { createContext, useState, useEffect, useCallback, useContext } from "react";
import cartService from "../services/cartService";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await cartService.getCart();
      setCart(res.data);
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart");
      return;
    }
    try {
      const res = await cartService.addToCart(productId, quantity);
      setCart(res.data);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await cartService.updateCartItem(itemId, quantity);
      setCart(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update cart");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await cartService.removeCartItem(itemId);
      setCart(res.data);
      toast.success("Item removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartService.clearCart();
      setCart(res.data || { items: [] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear cart");
    }
  };

  const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice =
    cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  const value = {
    cart,
    loading,
    itemCount,
    totalPrice,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
