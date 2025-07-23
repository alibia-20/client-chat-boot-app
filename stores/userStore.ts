import { create } from "zustand";
import { getUserInfo } from "../services/authService";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import du CSS nécessaire
interface UserState {
  user: { id: string; name: string; email: string; role: string } | null;
  error: string | null;
  fetchUser: () => Promise<void>;
}

// Assure-toi que le store est exporté par défaut
const useUserStore = create<UserState>((set) => ({
  user: null,
  error: null,
  fetchUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ error: "Token manquant", user: null });
      return;
    }
    try {
      const userData = await getUserInfo();
      set({ user: userData, error: null });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur :",
        error
      );
      set({ error: "Impossible de récupérer les informations utilisateur." });
    }
  },
}));

export default useUserStore;
// Fonction de déconnexion
export const logout = async () => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      // Faire une requête POST pour se déconnecter
      const response = await axios.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Afficher un message de succès dans un toast
      toast.success(response.data.message); // Affiche le message de déconnexion dans un toast

      // Supprimer le token du localStorage pour déconnecter l'utilisateur
      localStorage.removeItem("token");

      // Réinitialiser le store utilisateur si nécessaire
      useUserStore.getState().fetchUser();

      // Rediriger vers la page de connexion ou d'accueil
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    toast.error("Une erreur est survenue lors de la déconnexion.");
  }
};
