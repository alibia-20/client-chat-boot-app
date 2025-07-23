import Layout from "./Layout";
import UsersList from "../UsersList";
import useUserStore from "../../stores/userStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Users = () => {
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
      <UsersList />
    </Layout>
  );
};

export default Users;
