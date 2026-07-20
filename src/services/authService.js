import api from "./api";

const authService = {
  register: (data) => api.post("/auth/register", data).then((res) => res.data),
  login: (data) => api.post("/auth/login", data).then((res) => res.data),
  getProfile: () => api.get("/auth/profile").then((res) => res.data),
  updateProfile: (data) => api.put("/auth/profile", data).then((res) => res.data),
};

export default authService;
