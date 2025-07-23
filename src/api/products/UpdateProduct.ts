import axios, { AxiosError } from "axios";
import { User } from "@/type/type";
// Définition de l'interface TypeScript pour le modèle "Products"
export interface UpdateProductData {
  id?: number;
  name: string;
  price: number;
  shippingFee: number;
  extraQuestions?: string;
  userId?: User["id"];
  productIdOrKeyword: string;
}
export const updateProduct = async (uuid: string, data: UpdateProductData) => {
  const baseURL = `${import.meta.env.VITE_API_BASE_URL}`;
  try {
    const response = await axios.patch(`${baseURL}/products/${uuid}`, data, {
      withCredentials: true, // Si ton backend utilise des cookies pour l'auth
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.msg || "Erreur lors de la mise à jour"
      );
    }
    throw new Error("Une erreur inconnue est survenue");
  }
};
