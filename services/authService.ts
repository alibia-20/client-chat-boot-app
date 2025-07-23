import axios from "axios";
import axiosInstance from "./axiosInstance";

interface LoginResponse {
  message: string;
  token: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/login", {
    email,
    password,
  });
  return response.data;
};

export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token manquant");
    }

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/me`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Retourne les informations utilisateur
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations utilisateur:",
      error
    );
  }
};

export const logout = (): void => {
  localStorage.removeItem("token"); // Supprime le token
};
