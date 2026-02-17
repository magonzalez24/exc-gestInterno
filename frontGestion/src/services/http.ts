import axios from 'axios';
import { API_BASE_URL } from '@/const/api';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL + 'api/',
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
      const currentLanguage =
          localStorage.getItem("i18nextLng") || navigator.language || "en";

      config.headers["Accept-Language"] = currentLanguage;

      const token = localStorage.getItem("auth_token");

      if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
  },
  (error) => {
      return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
      // Error handling
      return Promise.reject(error);
  },
);

export default axiosInstance;
