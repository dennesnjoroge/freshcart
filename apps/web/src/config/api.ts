import axios from "axios";
import { BASE_URL } from "./url";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: { Authorization: "Bearer TOKEN" },
  withCredentials: true,
});
