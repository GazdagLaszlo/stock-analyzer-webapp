import axios from 'axios';
import { tokenKeyName } from '../constants/constants.ts';

//Javítani! Rossz helyre mutat
//const baseURL = `${import.meta.env.VITE_REST_API_URL}`;
const baseURL = `https://localhost:7024`;

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] =
      'Bearer ' + localStorage.getItem(tokenKeyName);
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosInstance;
