import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa"; // Icône de chargement
import Layout from "./Layout";
import LayouSystem from "../share/LayoutSystem";
import useUserStore from "../../stores/userStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ShopifyOrders = () => {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUser();
      } catch (error) {
        toast.error("Impossible de récupérer les informations utilisateur.");
        console.error(error);
        navigate("/");
      }
    };

    fetchData();
  }, [fetchUser, navigate]);
  const [loading, setLoading] = useState(true); // État pour gérer le loader
  const [showMessage, setShowMessage] = useState(false); // État pour gérer l'affichage du message

  // Effet pour simuler le chargement de 1 seconde
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Retirer le loader après 1 seconde
      setShowMessage(true); // Afficher le message après le chargement
    }, 1000);

    return () => clearTimeout(timer); // Nettoyer le timer lorsque le composant est démonté
  }, []);

  return (
    <Layout>
      <LayouSystem>
        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
          </div>
        )}

        {showMessage && (
          <div className="flex justify-center items-center h-full">
            <div className="text-center  bg-white rounded-lg">
              <p className=" text-lg text-gray-600  flex items-center gap-3">
                <FaSpinner className="mr-2 animate-spin text-[#EE5E46]" />
                <span className="font-bold text-[#EE5E46]">
                  Récupération des commandes
                </span>{" "}
                En cours de conception
              </p>
            </div>
          </div>
        )}
      </LayouSystem>
    </Layout>
  );
};

export default ShopifyOrders;
