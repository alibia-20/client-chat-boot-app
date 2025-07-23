import ContactList from "../ContactList";
import useUserStore from "../../stores/userStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { useEffect } from "react";
import React from "react";

const Contacts = () => {
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
      <ContactList />;
    </Layout>
  );
};

export default Contacts;
