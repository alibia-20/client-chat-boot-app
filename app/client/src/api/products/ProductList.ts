import { ProductList } from "@/type/type";
import axios from "axios";
// Définition du type ErrorResponse
interface ErrorData {
  errorCode?: string;
  errorMessage?: string;
}

interface ErrorResponse {
  message: string;
  status: number;
  data?: ErrorData; // Utilisation de ErrorData au lieu de unknown
  url?: string;
}
export const getProducts = async (): Promise<ProductList | ErrorResponse> => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await axios.get<ProductList>(`${baseURL}products`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Erreur Axios:");
      console.error("URL de la requête:", error.config?.url);
      console.error("Statut de la réponse:", error.response?.status);
      console.error("Données de l'erreur:", error.response?.data);
      console.error("Message d'erreur:", error.message);

      return {
        message: "Erreur lors de la récupération des produits.",
        status: error.response?.status || 500,
        data: error.response?.data || {},
        url: error.config?.url || "",
      };
    } else {
      console.error("Erreur inconnue:", error);
      return {
        message: "Une erreur inconnue est survenue.",
        status: 500,
        data: {},
        url: "",
      };
    }
  }
};
