import { FaChartLine, FaEnvelope, FaBoxOpen } from "react-icons/fa"; // Exemple d'icônes
import LayoutSystem from "./share/LayoutSystem";
import useUserStore from "../stores/userStore";

const Welcome = () => {
  const user = useUserStore((state) => state.user);
  console.log(user);
  localStorage.setItem("authId", user?.id as string);

  return (
    <LayoutSystem>
      {/* Main Dashboard Content */}
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex justify-center items-center   ">
          <div className="container flex justify-center items-center">
            <p className="text-2xl font-bold text-gray-600 relative bottom-40 right-10 ">
              Vous êtes le bienvenue {user?.name} 👋
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaChartLine className="mr-2" /> Statistiques
                </h3>
                <p className="text-gray-600">
                  Statistiques du site ou des données générales...
                </p>
              </div>

              <div className="bg-white p-6 shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaEnvelope className="mr-2" /> Messages
                </h3>
                <p className="text-gray-600">Derniers messages ou alertes...</p>
              </div>

              <div className="bg-white p-6 shadow-lg rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FaBoxOpen className="mr-2" /> Produits récents
                </h3>
                <p className="text-gray-600">
                  Produits ajoutés récemment ou autres informations
                  pertinentes...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutSystem>
  );
};

export default Welcome;
