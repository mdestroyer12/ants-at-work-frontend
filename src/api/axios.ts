import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "src/lib/utils";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",
});

let isRefreshing = false;
let failedList: { resolve: (token: string) => void; reject: (err: AxiosError) => void }[] = [];

const processList = (error: AxiosError | null, token: string | null) => {
  failedList.forEach(res => {
    if (error) {
      res.reject(error);
    } else {
      res.resolve(token!);
    }
  });
  failedList = [];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getCookie("accessToken");
  //const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedList.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        //const refreshToken = localStorage.getItem("refreshToken");
        const refreshToken = getCookie("refreshToken");
        const res = await api.post("/auth/refresh", { refreshToken });

        const newToken = res.data.accessToken;
        //localStorage.setItem("accessToken", newToken);
        setCookie("accessToken", newToken, 2);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        processList(null, newToken);

        return api(originalRequest);
      } catch (err) {
        processList(err as AxiosError, null);
        localStorage.clear();
        delete api.defaults.headers.common["Authorization"];
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
