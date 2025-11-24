import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAmbulances = async () => {
  const response = await api.get('/ambulances');
  return response.data;
};

export const getIncidents = async () => {
  const response = await api.get('/incidents');
  return response.data;
};


export default api;