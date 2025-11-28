import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('resq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {

      localStorage.removeItem('resq_token');
      localStorage.removeItem('resq_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getAmbulances = async () => {
  const response = await api.get('/ambulances');
  return response.data;
};

export const getIncidents = async () => {
  const response = await api.get('/incidents');
  return response.data;
};
export const updateAmbulanceStatus = async ({ id, status }: { id: number; status: string }) => {
  const response = await api.patch(`/ambulances/${id}`, { status });
  return response.data;
};

export default api;