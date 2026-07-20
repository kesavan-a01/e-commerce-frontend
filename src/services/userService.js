import api from "./api";

const userService = {
  getUsers: (params) => api.get("/users", { params }).then((res) => res.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then((res) => res.data),
  getDashboardStats: () => api.get("/users/dashboard-stats").then((res) => res.data),
};

export default userService;
