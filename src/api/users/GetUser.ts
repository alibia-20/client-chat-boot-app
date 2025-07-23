import axios from "axios";
// import { User } from "../../type/type"; // Assure-toi    que le chemin est correct
import { UserList } from "../../type/type";
export const getUsers = async (): Promise<UserList> => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  try {
    const response = await axios.get<UserList>(`${baseURL}/users`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    throw error;
  }
};
