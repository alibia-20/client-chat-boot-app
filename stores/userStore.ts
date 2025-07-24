// src/stores/useUserStore.js
import { create } from "zustand";
import { getUserInfo } from "../services/authService";
import { toast } from "react-toastify";

interface UserState {
  user: { id: string; name: string; email: string; role: string } | null;
  error: string | null;
  fetchUser: () => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  error: null,
  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token dans fetchUser:", token); // Log pour déboguer
      if (!token) {
        set({ error: "Token manquant", user: null });
        toast.error("Veuillez vous reconnecter.");
        return;
      }
      const userData = await getUserInfo();
      console.log("Utilisateur reçu dans store:", userData); // Log pour déboguer
      set({ user: userData, error: null });
    } catch (error) {
      console.error("Erreur dans fetchUser:", error);
      set({
        error: "Impossible de récupérer les informations utilisateur.",
        user: null,
      });
      toast.error(
        "Erreur lors de la récupération des informations utilisateur."
      );
    }
  },
}));

export default useUserStore;
