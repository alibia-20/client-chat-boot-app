import axios, { AxiosError } from "axios";

export const deleteProduct = async (id: string) => {
  const baseURL = `${import.meta.env.VITE_API_BASE_URL}/api`;
  try {
    const response = await axios.delete(`${baseURL}/newproducts/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.msg || `Produit introuvable (ID: ${id})`
      );
    }
    throw new Error("Une erreur inconnue est survenue");
  }
};
