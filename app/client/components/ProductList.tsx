import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LayoutSystem from "./share/LayoutSystem";
import { deleteProduct } from "../src/api/products/DeleteProduct";
import axios from "axios";
import useUserStore from "../stores/userStore";
import { ProductWithElements } from "./type/type";

const PAGE_SIZE = 10;

const ProductList = () => {
  const [newproducts, setNewProducts] = useState<ProductWithElements[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/newproducts`
        );
        setNewProducts(response.data); // On récupère les données
      } catch (err) {
        toast.error("Erreur lors de la récupération des données");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const role = user?.role ?? "inconnu";

    if (role !== "admin") {
      toast.error("⚠️ Vous n'êtes pas autorisé à supprimer ce produit !");
      return;
    }

    const confirmation = confirm(
      "🗑️ Voulez-vous vraiment supprimer ce produit ?"
    );
    if (!confirmation) return;

    try {
      await deleteProduct(id);

      setNewProducts((prevProducts) =>
        prevProducts.filter((prevProduct) => prevProduct.id !== id)
      );

      toast.success("✅ Produit supprimé avec succès !");
    } catch (error: unknown) {
      let errorMessage = "❌ Une erreur est survenue lors de la suppression.";

      if (error instanceof Error) {
        errorMessage = `❌ ${error.message}`;
      }

      toast.error(errorMessage);
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  // Recherche filtrée
  const filtered = newproducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
      </div>
    );

  return (
    <LayoutSystem>
      <div className=" flex justify-center  h-full bg-gray-50 w-full">
        <div className="p-6 container">
          <h1 className="text-2xl font-bold mb-2">Produits</h1>
          <h2 className="text-xl text-gray-600 mb-4">Liste des produits</h2>
          <Link
            to="/products/add"
            className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 w-[190px]"
          >
            <FaPlus /> Nouveau produit
          </Link>

          <div className="mb-4 flex items-center gap-4">
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-gray-500 text-sm">
              {filtered.length} résultat(s)
            </span>
          </div>

          <div className="overflow-x-auto shadow-lg">
            <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mots clés
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    autheur
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.map((newproduct, index) => (
                  <tr key={newproduct.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{(page - 1) * PAGE_SIZE + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {newproduct.keyword}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {newproduct.name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {newproduct.createdBy}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap space-x-2 flex">
                      <Link
                        to={`/products/edit/${newproduct.id}`}
                        className="px-3 py-1 bg-blue-500  text-white text-sm rounded hover:bg-blue-600 flex items-center gap-2"
                      >
                        <FaEdit />
                        Editer
                      </Link>
                      <button
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex items-center gap-2"
                        onClick={() => handleDelete(String(newproduct.id))}
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

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="mx-2 text-gray-700">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </LayoutSystem>
  );
};

export default ProductList;
