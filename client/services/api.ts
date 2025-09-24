import axios from "axios";

const baseURL = (import.meta as any).env?.VITE_API_BASE_URL || "/api";

export const api = axios.create({ baseURL, withCredentials: false });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sem_token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    return Promise.reject(err);
  },
);

export function setToken(token: string | null) {
  if (token) localStorage.setItem("sem_token", token);
  else localStorage.removeItem("sem_token");
}

export function getToken() {
  return localStorage.getItem("sem_token");
}

export function setUser(user: any | null) {
  if (user) localStorage.setItem("sem_user", JSON.stringify(user));
  else localStorage.removeItem("sem_user");
}

export function getUser<T = any>(): T | null {
  const v = localStorage.getItem("sem_user");
  return v ? (JSON.parse(v) as T) : null;
}

export function getDefaultCurrency() {
  return localStorage.getItem("sem_default_currency") || "USD";
}
export function setDefaultCurrency(cur: string) {
  localStorage.setItem("sem_default_currency", cur);
}
