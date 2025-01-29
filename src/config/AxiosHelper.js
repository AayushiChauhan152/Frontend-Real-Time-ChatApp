import axios from "axios";

export const baseURL = import.meta.env.VITE_BACKEND_URL;

export const httpClient = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
