import { NavLink, useNavigate } from "react-router-dom";

// import { logout } from "../../stores/userStore";
import Logo from "../../public/assets/logo.png";

import { IoHome, IoPerson, IoLogOut } from "react-icons/io5";
import { FaShopify } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import useUserStore from "../../stores/userStore";
const SideBar = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const role = user?.role ?? "inconnu"; // Si user est null, on assigne "inconnu" par défaut
  // Supprime l'utilisateur du localStorage et redirige
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  // Supprime l'utilisateur du localStorage et redirige

  return (
    <div className="w-64 max-md:w-full hidden md:block  bg-white border-r border-[#e1e1e1] h-full p-4 min-h-screen fixed z-20">
      <div className="md:hidden flex justify-between items-center max-md:border-b mb-4 py-4">
        <FaBarsStaggered />
        <div className="relative md:left-6 flex items-center gap-2 capitalize text-2xl md:hidden ">
          <div className=" flex items-center gap-2 cursor-pointer capitalize text-2xl relative md:right-[10%]">
            <img src={Logo} alt="Logo" className="w-[40px] h-[40px]" />
          </div>
        </div>
      </div>

      <aside className="">
        {/* General Section */}
        <p className="text-gray-600 font-semibold mb-2 py-2  px-4">Général</p>

        <ul className="space-y-2">
          <li className="px-6 my-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-2 text-[#06A2FF]"
                  : "flex items-center space-x-2 text-gray-700 hover:text-[#6bbded]"
              }
            >
              <IoHome /> <span>Tableau de bord</span>
            </NavLink>
          </li>
        </ul>
        {/* General Action */}
        <p className="text-gray-600 font-semibold mb-2 py-2  px-4">Actions</p>
        <ul>
          <li className="px-6 my-2">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-2 text-[#06A2FF]"
                  : "flex items-center space-x-2 text-gray-700 hover:text-[#6bbded]"
              }
            >
              <FaBox /> <span>Produits</span>
            </NavLink>
          </li>
          <li className="px-6 my-2">
            <NavLink
              to="/questionsreponses"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-2 text-[#06A2FF]"
                  : "flex items-center space-x-2 text-gray-700 hover:text-[#6bbded]"
              }
            >
              <FaQuestionCircle /> <span>Questions/Réponses</span>
            </NavLink>
          </li>
          <li className="px-6 my-2 hidden">
            <NavLink
              to="/Stocks"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-2 text-[#06A2FF]"
                  : "flex items-center space-x-2 text-gray-700 hover:text-[#6bbded]"
              }
            >
              <IoStatsChart /> <span>Gestion des stocks</span>
            </NavLink>
          </li>
        </ul>

        {/* Admin Section (Visible Only to Admins) */}
        {role && role === "admin" && (
          <div className="mt-4">
            <p className="text-gray-600 font-semibold mb-2 py-2 px-4">
              Administrateur
            </p>
            <ul className="space-y-2">
              <li className="px-6 my-2">
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center space-x-2 text-[#06A2FF]"
                      : "flex items-center space-x-2 text-gray-700 hover:text-[#6bbded]"
                  }
                >
                  <IoPerson /> <span>Utilisateurs</span>
                </NavLink>
              </li>
            </ul>
            {/* <ul>
              <li className="px-6 my-2">
                <NavLink to="/contacts" className={({ isActive }) =>
                  isActive ? "flex items-center space-x-2 text-[#06A2FF]" : "flex items-center space-x-2 text-gray-700 hover:text-[#6bbded]"
                }>
                 <IoIosContacts /> <span>Contacts fs</span>
                </NavLink>
              </li>
            </ul> */}
          </div>
        )}

        {/* "Services externe" */}
        <p className="text-gray-600 font-semibold mt-4 mb-2 py-2 px-4">
          Services externe
        </p>
        <ul>
          <li className="px-6 my-2">
            <NavLink
              to="/facebookIdPost"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-2 text-[#06A2FF]"
                  : "flex items-center space-x-2 text-gray-700 hover:text-[#6bbded]"
              }
            >
              <FaFacebookSquare />
              <span>Produit Facebook</span>
            </NavLink>
          </li>

          <li className="px-6 my-2 hidden">
            <NavLink
              to="/ShopifyOrders"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center space-x-2 text-[#06A2FF]"
                  : "flex items-center space-x-2 text-gray-700 hover:text-[#6bbded]"
              }
            >
              <FaShopify />
              <span>Commande Shopify</span>
            </NavLink>
          </li>
        </ul>
        {/* Settings Section */}
        <p className="text-gray-600 font-semibold mt-4 mb-2 py-2 px-4">
          Paramètres
        </p>
        <ul>
          <li className="px-6 my-2">
            <button
              onClick={handleLogout} // Appel de la fonction logout lors du clic
              className="flex items-center space-x-2 text-red-600 hover:text-red-800"
            >
              <IoLogOut /> <span>Déconnexion</span>
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default SideBar;
