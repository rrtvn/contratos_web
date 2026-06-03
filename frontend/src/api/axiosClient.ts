import axios from 'axios';
import { API_URL } from '../config';
/**
 * Instancia central de Axios.
 * El proxy de Vite redirige /api -> http://localhost:3000/api
 */
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message ?? err?.message ?? 'Error de conexion';
    return Promise.reject(new Error(Array.isArray(msg) ? msg.join(', ') : msg));
  },
);

export default axiosClient;
