import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import LayoutSystem from "./share/LayoutSystem";
import { deleteQuestion } from "../src/api/faqs/DeleteQuestion";
import axios from "axios";
import useUserStore from "../stores/userStore";
type Question = {
  id: string;
  question: string;
  answer: string;
  creator: {
    name: string;
    role: string;
  };
};

const QuestionsReponsesList = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/question`
        );
        setQuestions(response.data); // On récupère les données
      } catch (err) {
        toast.error("Erreur lors de la récupération des données");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleDelete = async (id: string) => {
    const role = user?.role ?? "inconnu"; // Si user est null, on assigne "inconnu" par défaut
    if (role !== "admin") {
      toast.error("Vous n'êtes pas autorisé à supprimer cet enssemble !");
      return; // Arrête l'exécution si l'utilisateur n'est pas admin
    }
    if (confirm("Voulez-vous vraiment supprimer cet enssemble  ?")) {
      try {
        deleteQuestion(id);
        setQuestions(questions.filter((faq) => faq.id !== id));
        toast.success("L'enssemble a été supprimé avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la suppression du produit !");
        console.error(error);
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
      </div>
    );

  return (
    <LayoutSystem>
      <div className="w-full flex justify-center items-center">
        <div className="p-6 container">
          <h1 className="text-2xl font-bold mb-2">Questions & Réponses</h1>
          <h2 className="text-xl text-gray-600 mb-4">
            Liste des questions et réponses associées.
          </h2>
          <Link
            to="/questions-reponses/add"
            className="flex items-center gap-2 w-[210px] px-4 py-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FaPlus />
            Ajouter un enssemble
          </Link>
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Réponses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {questions.map((q, index) => (
                <tr key={q.answer} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{q.answer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{q.question}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {q.creator.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {q.creator.role}
                  </td>
                  <td className="px-6 flex py-4 whitespace-nowrap space-x-2">
                    <Link
                      to={`/questions-reponses/edit/${q.id}`}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center  gap-2"
                    >
                      <FaEdit />
                      Editer
                    </Link>
                    <button
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex items-center  gap-2"
                      onClick={() => handleDelete(q.id)}
                    >
                      <FaTrash />
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </LayoutSystem>
  );
};

export default QuestionsReponsesList;
