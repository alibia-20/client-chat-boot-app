// imports externes
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
// imports internes
import { login } from "../../services/authService";
import bigLogo from "../../public/assets/big-logo.png";
import Logo from "../../public/assets/logo.png";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // ✅ Active l'état avant l'appel API

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data && typeof error.response.data === "object"
            ? (error.response.data as { message?: string }).message
            : "Une erreur est survenue.";

        toast.error(errorMessage || "Une erreur est survenue.");
      } else {
        toast.error("Une erreur inattendue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="container flex bg-yellow-400 px-4 justify-around items-center p rounded-lg py-[100px] shadow">
        <div className="w-[50%] hidden md:block">
          <img src={bigLogo} alt="grand Logo" />
        </div>

        <div className="flex justify-center min-w-[700px] max-md:min-w-[100%]">
          <div className="w-full max-w-md">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-red-500 p-3">
                  <img src={Logo} alt="Logo" />
                </div>
                <div className="flex flex-col items-center mb-8">
                  <h1 className="text-[30px] my-2 font-semibold text-xl">
                    Connectez-vous à votre compte
                  </h1>
                  <p className="font-light">
                    Bienvenue à nouveau ! Veuillez saisir vos coordonnées.
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Mot de passe
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="password"
                  placeholder="*******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="w-full bg-[#f36654] hover:bg-[#EE5C48] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {isLoading ? "Chargement..." : "Connexion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
