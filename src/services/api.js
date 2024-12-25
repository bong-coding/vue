// src/services/api.js
import axios from "axios";

const apiKey = process.env.VUE_APP_TMDB_API_KEY;
const selectedLanguage = localStorage.getItem("selectedLanguage") || "ko-KR";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: apiKey,
    language: selectedLanguage,
  },
});

export default api;
