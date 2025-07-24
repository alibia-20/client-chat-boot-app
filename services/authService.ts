import { toast } from "react-toastify";
import axiosInstance from "./axiosInstance";
import useUserStore from "../stores/userStore";

interface LoginResponse {
  message: string;
  token: string;
}

// Interface pour la réponse de l'utilisateur (basée sur la réponse Postman)
interface User {
  id: string;
  uuid: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  profilePicture: string | null;
  createdBy: string | null;
}

// Fonction pour se connecter
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/login", {
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token); // Stocke le token
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
};

// Fonction pour récupérer les informations de l'utilisateur
export const getUserInfo = async (): Promise<User> => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token envoyé:", token);
    if (!token) {
      throw new Error(
        "Aucun token d'authentification trouvé. Veuillez vous connecter."
      );
    }
    const response = await axiosInstance.get<User>("/me");
    console.log("Données utilisateur reçues:", response.data); // Log pour déboguer
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération utilisateur:", error);
    throw error;
  }
};

// Fonction pour se déconnecter
export const logout = async (): Promise<void> => {
  try {
    // Vérifier si la route /logout existe sur le serveur
    await axiosInstance.post("/logout");
    toast.success("Déconnexion réussie !");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    toast.error("Une erreur est survenue lors de la déconnexion.");
  } finally {
    localStorage.removeItem("token");
    // Réinitialiser le store utilisateur
    useUserStore.getState().fetchUser();
    window.location.href = "/";
  }
};

// export const login = async (
//   email: string,
//   password: string
// ): Promise<LoginResponse> => {
//   const response = await axiosInstance.post<LoginResponse>("/login", {
//     email,
//     password,
//   });
//   return response.data;
// };

// export const getUserInfo = async () => {
//   console.log("Token envoyé:", localStorage.getItem("token"));
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("Token manquant");

//     const response = await axiosInstance.get("/me", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       withCredentials: true,
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Erreur lors de la récupération utilisateur:", error);
//     throw error;
//   }
// };
// export const logout = (): void => {
//   localStorage.removeItem("token"); // Supprime le token
// };
