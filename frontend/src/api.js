import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const setToken = (t) => {
  if (t) {
    api.defaults.headers.common.Authorization = `Bearer ${t}`;
    localStorage.setItem('token', t);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('token');
  }
};

export const getToken = () => localStorage.getItem('token');

export default api;
