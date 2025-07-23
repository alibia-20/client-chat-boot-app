import LayoutSystem from "./share/LayoutSystem";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "./pages/Layout";
import "react-toastify/dist/ReactToastify.css";
import useUserStore from "../stores/userStore";

const FormAddQuestion = () => {
  const user = useUserStore((state) => state.user);
  // États pour les champs du formulaire
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string | number>("");

  // Fonction de validation avec notifications Toast
  const validateForm = () => {
    if (!question.trim()) {
      toast.error("La question est requise.");
      return false;
    }
    if (!answer.toString().trim()) {
      toast.error("La réponse est requise.");
      return false;
    }
    return true;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/question`,
        {
          question,
          answer,
          createdBy: user?.id,
        }
      );
      toast.success(
        response.data.msg || "cet ensemble a été ajouté avec succès !"
      );
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout. Veuillez réessayer.");
    }
  };

  return (
    <Layout>
      <LayoutSystem>
        <div className="p-6 max-w-2xl mx-auto relative shadow-lg top-[15%]">
          <h1 className="text-2xl font-bold mb-2">Ajouter un ensemble</h1>
          <div className="text-xl text-gray-600 mb-4">
            Ajouter une question et une réponse associée
          </div>
          <div className="bg-white rounded-lg">
            <div className="p-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Entrez la question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Réponse
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Entrez la réponse"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Ajouter cet ensemble
                </button>
              </form>
            </div>
          </div>
        </div>
      </LayoutSystem>
    </Layout>
  );
};

export default FormAddQuestion;
