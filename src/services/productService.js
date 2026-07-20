import api from "./api";

const productService = {
  getProducts: (params) => api.get("/products", { params }).then((res) => res.data),
  getProductById: (id) => api.get(`/products/${id}`).then((res) => res.data),
  createProduct: (formData) =>
    api
      .post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),
  updateProduct: (id, formData) =>
    api
      .put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),
  deleteProduct: (id) => api.delete(`/products/${id}`).then((res) => res.data),
};

export default productService;
