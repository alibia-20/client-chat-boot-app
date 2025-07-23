import LayoutSystem from "./share/LayoutSystem";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUsers } from "../src/api/users/GetUser";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { User } from "../src/type/type";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        setError("Impossible de récupérer les utilisateurs.");
        toast.error("Impossible de récupérer les utilisateurs.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  const deleteUser = async (uuid: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?"))
      return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/users/${uuid}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.uuid !== uuid));
        toast.success("Utilisateur supprimé avec succès !");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.msg || "Erreur lors de la suppression."
        );
      } else if (error instanceof Error) {
        toast.error("Erreur serveur : " + error.message);
      } else {
        toast.error("Une erreur inconnue est survenue.");
      }
    }
  };
  // 🌟 Affichage du loader amélioré
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
      </div>
    );

  if (error)
    return <p className="text-red-500 text-center font-semibold">{error}</p>;
  return (
    <LayoutSystem>
      <div className="flex justify-center items-center">
        <div className="p-6 container w-full">
          <h1 className="text-2xl font-bold mb-2">Utilisateurs</h1>
          <h2 className="text-xl text-gray-600 mb-4">Liste des utilisateurs</h2>
          <Link
            to="/users/add"
            className="flex gap-2 items-center w-[210px] px-4 py-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FaPlus />
            Ajouter un utilisateur
          </Link>
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courriel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user.uuid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2 flex">
                    <Link
                      to={`/users/edit/${user.uuid}`}
                      className="flex items-center  gap-2 px-3 py-1 bg-[#3B82F6] text-white text-sm rounded hover:bg-red-500"
                    >
                      <FaEdit />
                      Editer
                    </Link>
                    <button
                      onClick={() => deleteUser(user.uuid)}
                      className="flex items-center  gap-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      <FaTrash />
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutSystem>
  );
};

export default UsersList;
