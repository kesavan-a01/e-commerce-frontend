import api from "./api";

const cartService = {
  getCart: () => api.get("/cart").then((res) => res.data),
  addToCart: (productId, quantity = 1) =>
    api.post("/cart", { productId, quantity }).then((res) => res.data),
  updateCartItem: (itemId, quantity) =>
    api.put(`/cart/${itemId}`, { quantity }).then((res) => res.data),
  removeCartItem: (itemId) => api.delete(`/cart/${itemId}`).then((res) => res.data),
  clearCart: () => api.delete("/cart").then((res) => res.data),
};

export default cartService;
