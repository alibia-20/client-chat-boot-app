import ProductList from "../ProductList";
import useUserStore from "../../stores/userStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useEffect } from "react";


const Products = () => {
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
  return (
    <Layout>
      <ProductList />;
    </Layout>
  );
};

export default Products;
