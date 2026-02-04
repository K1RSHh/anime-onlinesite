import axios from "axios";

const api = axios.create({
  baseURL: "https://api.jikan.moe/v4",
  timeout: 10000,
  headers: {
    "Content-Type": "application",
  },
});

export default api;
