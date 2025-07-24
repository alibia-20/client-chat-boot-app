// src/services/axiosInstance.js
import axios, { AxiosHeaders } from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Utilise le proxy défini dans vite.config.js
  withCredentials: true, // Nécessaire pour envoyer les cookies/credentials
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token dans les headers de chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Ajoute le token dans l'en-tête Authorization
    }

    return config;
  },
  (error) => {
    // Gestion des erreurs de requête
    console.error("Erreur dans l'intercepteur de requête:", error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer la réponse et les erreurs globales
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Renvoie la réponse si tout est ok
  },
  (error) => {
    // Gère les erreurs de réponse
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Non autorisé. Token expiré ou invalide.");
        localStorage.removeItem("token"); // Supprime le token si non autorisé
        // Redirection vers la page de login (à implémenter selon ton router)
        // Exemple : window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Erreur serveur. Veuillez réessayer plus tard.");
      } else {
        console.error(
          "Erreur serveur:",
          error.response.data.message || error.response.status
        );
      }
    } else if (error.request) {
      console.error(
        "Erreur réseau: Aucune réponse reçue. Vérifiez votre connexion."
      );
    } else {
      console.error("Erreur inconnue:", error.message);
    }

    return Promise.reject(error); // Renvoie l'erreur pour la gestion locale
  }
);

export default axiosInstance;
