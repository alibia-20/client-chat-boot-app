import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LayoutSystem from "./share/LayoutSystem";
import Layout from "../components/pages/Layout";
import FormEditProduct from "./FormEditProduct";
interface Product {
  id: string;
  keyword: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  elements: {
    id: string;
    productId: string;
    type: "text" | "image";
    content: string | null;
    imageUrl: string | null;
    caption: string | null;
    order: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

const FormUpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/newproducts/${id}`
        );
        console.log("Produit récupéré :", res.data);
        setProduct(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit :", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);
  console.log("id du produit", product);
  console.log("id du produit", id);
  return (
    <Layout>
      <LayoutSystem>
        {product ? (
          <FormEditProduct product={product} />
        ) : (
          <div>Chargement du produit...</div>
        )}
      </LayoutSystem>
    </Layout>
  );
};

export default FormUpdateProduct;
