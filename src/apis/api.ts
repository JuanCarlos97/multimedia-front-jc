import axios from 'axios';

const API = axios.create({
  baseURL: 'https://octopus-app-ia87y.ondigitalocean.app/api',
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;