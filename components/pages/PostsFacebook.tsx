import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import LayouSystem from "../share/LayoutSystem";

interface Product {
  id: string;
  message: string;
  created_time: string;
  permalink_url?: string;
  full_picture?: string;
}

interface PageData {
  pageName: string;
  products: Product[];
}

// Format date en français
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

const PostsFacebook = () => {
  const [pagesData, setPagesData] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState<string>("all");

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/facebook/posts`
        );
        setPagesData(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des publications :", error);
        setPagesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // 🔥 Appliquer le filtre par page et par mot-clé
  const filteredPagesData = pagesData
    .filter((page) =>
      selectedPage === "all" ? true : page.pageName === selectedPage
    )
    .map((page) => ({
      ...page,
      products: page.products.filter((product) =>
        product.message?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }));

  return (
<Layout>
  <LayouSystem>
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Publications Facebook
      </h1>

      {/* 🔥 Dropdown & Search */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Dropdown filtrer par page */}
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
        >
          <option value="all">Toutes les pages</option>
          {pagesData.map((page) => (
            <option key={page.pageName} value={page.pageName}>
              {page.pageName}
            </option>
          ))}
        </select>

        {/* Search filtrer par mot-clé */}
        <input
          type="text"
          placeholder="Rechercher un produit par nom..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center w-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* Liste produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPagesData.map((page) => (
          <div key={page.pageName}>
            <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">
              {page.pageName}
            </h2>

            {page.products.length === 0 ? (
              <p className="text-gray-500 text-center">
                Aucun produit trouvé
              </p>
            ) : (
              page.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Image produit */}
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    {product.full_picture ? (
                      <img
                        src={product.full_picture}
                        alt="Produit"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">Pas d'image</span>
                    )}
                  </div>

                  {/* Contenu card */}
                  <div className="p-4 flex flex-col h-full">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.message
                        ? product.message.substring(0, 50) + "..."
                        : "Aucun titre disponible"}
                    </h3>

                    <p className="text-sm text-gray-500 mb-2">
                      Publié le {formatDate(product.created_time)}
                    </p>

                    {/* ID produit + bouton copier */}
                    <div className="flex items-center justify-between bg-gray-50 border rounded p-2 mb-4">
                      <span className="text-sm text-gray-700">
                        ID: {product.id}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(product.id);
                          alert("ID copié !");
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Copier
                      </button>
                    </div>

                    <div className="mt-auto">
                      {product.permalink_url && (
                        <a
                          href={product.permalink_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Voir sur Facebook
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  </LayouSystem>
</Layout>
  );
};

export default PostsFacebook;
