import Layout from "./pages/Layout";
import { UpdateFaqsDatas } from "@/api/faqs/UpdateQuestion";
import { getQuestionById } from "../src/api/faqs/getFaq";
import "react-toastify/dist/ReactToastify.css";
import LayoutSystem from "./share/LayoutSystem";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
interface Faqs {
  id?: string;
  question: string;
  answer: string;
}

const FormEditQuestion = () => {
  const [formData, setFormData] = useState<Faqs>({
    question: "",
    answer: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const userData = await getQuestionById(id);
        if (!userData) {
          toast.error("Utilisateur introuvable.");
          return;
        }
        setFormData({
          question: userData.question || "",
          answer: userData.answer || "",
        });
      } catch (error) {
        toast.error(
          "Erreur lors du chargement des informations de l'utilisateur."
        );
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Gestion des changements des inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      toast.error("Identifiant introuvable.");
      return;
    }

    try {
      const response = await UpdateFaqsDatas(id, formData);
      console.log("Réponse serveur :", response);
      toast.success("Ensemble mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      toast.success("Ensemble mis à jour avec succès !");
    }
  };

  return (
    <Layout>
      <LayoutSystem>
        <div className="p-6 max-w-2xl mx-auto relative shadow-lg top-[15%]">
          <h1 className="text-2xl font-bold mb-2">Questions & Réponses</h1>
          <div className="text-sm text-gray-600 mb-4">
            Modifier cet ensemble
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="p-4">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Entrez une question"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Réponse
                  </label>
                  <input
                    name="answer"
                    value={formData.answer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Entrez une réponse"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className=" px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                  >
                    {isLoading ? "Modification..." : "Modifier !"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/questionsreponses")}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </LayoutSystem>
    </Layout>
  );
};

export default FormEditQuestion;
