import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
};

export const inventories = {
  list: (q) => api.get("/inventories", { params: { q } }),
  get: (id) => api.get(`/inventories/${id}`),
  create: (data) => api.post("/inventories", data),
  update: (id, data) => api.put(`/inventories/${id}`, data),
  delete: (id) => api.delete(`/inventories/${id}`),
};

export const items = {
  list: (inventoryId) => api.get(`/inventories/${inventoryId}/items`),
  create: (inventoryId, data) =>
    api.post(`/inventories/${inventoryId}/items`, data),
  update: (inventoryId, itemId, data) =>
    api.put(`/inventories/${inventoryId}/items/${itemId}`, data),
  delete: (inventoryId, itemId) =>
    api.delete(`/inventories/${inventoryId}/items/${itemId}`),
};

export const posts = {
  list: (inventoryId) => api.get(`/posts`, { params: { inventoryId } }),
  create: (data) => api.post(`/posts`, data),
};

export const likes = {
  likeItem: (itemId) => api.post(`/likes/items/${itemId}`),
  unlikeItem: (itemId) => api.delete(`/likes/items/${itemId}`),
};

export const tags = {
  search: (q) => api.get("/tags", { params: { q } }),
};

export default api;
export const getUsers = () => api.get("/auth/users");
export const updateUserRole = (userId, newRole) =>
  api.put("/auth/update-role", { userId, newRole });
