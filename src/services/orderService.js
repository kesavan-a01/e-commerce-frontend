import api from "./api";

const orderService = {
  placeOrder: (shippingInfo) =>
    api.post("/orders", { shippingInfo }).then((res) => res.data),
  getMyOrders: () => api.get("/orders/my").then((res) => res.data),
  getAllOrders: (params) => api.get("/orders", { params }).then((res) => res.data),
  updateOrderStatus: (id, status) =>
    api.put(`/orders/${id}`, { status }).then((res) => res.data),
  deleteOrder: (id) => api.delete(`/orders/${id}`).then((res) => res.data),
};

export default orderService;
