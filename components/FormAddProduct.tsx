import Layout from "./pages/Layout";
import LayoutSystem from "./share/LayoutSystem";
import { FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
type ElementType = "image" | "text";
interface BaseElement {
  id: string;
  type: ElementType;
  order: number;
}

interface ImageElement extends BaseElement {
  type: "image";
  file: File;
  caption: string;
}
type StructuredElement =
  | { type: "image"; caption: string; order: number; imageIndex: number }
  | { type: "text"; content: string; order: number };
interface TextElement extends BaseElement {
  type: "text";
  content: string;
}

type FormElement = ImageElement | TextElement;

const MAX_IMAGES = 10;
const MAX_TEXTS = 5;

const FormAddProduct = () => {
  const [keyword, setKeyword] = useState("");
  const [elements, setElements] = useState<FormElement[]>([]);
  const [name, setName] = useState("");
  const [idPostFacebook, setIdPostFacebook] = useState("");
  const [synonym, setSynonym] = useState("");
  const navigate = useNavigate();

  const getNextOrder = () => {
    if (elements.length === 0) return 1;
    return Math.max(...elements.map((el) => el.order)) + 1;
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newElements: ImageElement[] = Array.from(files)
      .slice(
        0,
        MAX_IMAGES - elements.filter((el) => el.type === "image").length
      )
      .map((file) => ({
        id: `img-${file.name}-${Date.now()}`,
        type: "image",
        file,
        caption: "",
        order: getNextOrder(),
      }));

    setElements((prev) => [...prev, ...newElements]);
  };

  const updateCaption = (id: string, value: string) => {
    setElements((prev) =>
      prev.map((el) =>
        el.type === "image" && el.id === id ? { ...el, caption: value } : el
      )
    );
  };

  const updateTextContent = (id: string, value: string) => {
    setElements((prev) =>
      prev.map((el) =>
        el.type === "text" && el.id === id ? { ...el, content: value } : el
      )
    );
  };

  const addTextBlock = () => {
    if (elements.filter((el) => el.type === "text").length < MAX_TEXTS) {
      const newText: TextElement = {
        id: `text-${Date.now()}`,
        type: "text",
        content: "",
        order: getNextOrder(),
      };
      setElements((prev) => [...prev, newText]);
    }
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orders = elements.map((el) => el.order);
    if (new Set(orders).size !== orders.length) {
      alert("Des éléments ont le même numéro d'ordre !");
      return;
    }
    if (!name || !keyword) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const formData = new FormData();

    // Ajouter les données textuelles
    formData.append("keyword", keyword);
    formData.append("name", name);
    formData.append("createdBy", "Yoanh");
    formData.append("idPostFacebook", idPostFacebook);
    formData.append("synonym", synonym);

    const structuredElements: StructuredElement[] = [];
    let imageIndex = 0;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      if (el.type === "image") {
        // Ajouter le fichier image dans le formData
        formData.append("images", el.file); // ⚠️ "images" doit être un tableau côté multer

        structuredElements.push({
          type: "image",
          caption: el.caption,
          order: el.order,
          imageIndex: imageIndex++, // on stocke l’index pour retrouver l'image côté serveur
        });
      } else {
        structuredElements.push({
          type: "text",
          content: el.content,
          order: el.order,
        });
      }
    }

    // Ajouter les éléments (sans fichiers) sous forme JSON
    formData.append("elements", JSON.stringify(structuredElements));
    console.log("🔍 FormData envoyée :");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          type: value.type,
          size: value.size,
        });
      } else {
        console.log(`${key}:`, value);
      }
    }
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          type: value.type,
          size: value.size,
        });
      } else {
        console.log(`${key}:`, value);
      }
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/newproducts`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Réponse :", res.data);
      // ✅ Affichage du toast
      toast.success("Produit créé avec succès !");
      navigate("/products");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  return (
    <Layout>
      <LayoutSystem>
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-xl mt-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Ajouter un nouveau produit
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Mot clé principal
                <input
                  type="text"
                  placeholder="Saisir le Mot clé principal du produit"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="mt-1 block w-full py-2 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Nom du produit
                <input
                  type="text"
                  placeholder="Saisir le Nom du produit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full py-2 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                ID du post Facebook
                <input
                  type="text"
                  placeholder="Saisir l'ID du post Facebook"
                  value={idPostFacebook}
                  onChange={(e) => setIdPostFacebook(e.target.value)}
                  className="mt-1 block w-full py-2 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Synonymes (séparés par des virgules)
                <input
                  type="text"
                  placeholder="Ex: syn1, syn2, syn3"
                  value={synonym}
                  onChange={(e) => setSynonym(e.target.value)}
                  className="mt-1 block w-full py-2 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Ajouter des images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  disabled={
                    elements.filter((el) => el.type === "image").length >=
                    MAX_IMAGES
                  }
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>

              <button
                type="button"
                onClick={addTextBlock}
                disabled={
                  elements.filter((el) => el.type === "text").length >=
                  MAX_TEXTS
                }
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Ajouter un bloc texte
              </button>
            </div>

            <div className="space-y-6">
              {elements
                .sort((a, b) => a.order - b.order)
                .map((el) => (
                  <div
                    key={el.id}
                    className="group relative p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-colors shadow-sm"
                  >
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={el.order}
                        onChange={(e) => {
                          const newOrder = Math.max(
                            1,
                            parseInt(e.target.value) || 1
                          );
                          setElements((prev) =>
                            prev.map((element) =>
                              element.id === el.id
                                ? { ...element, order: newOrder }
                                : element
                            )
                          );
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeElement(el.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {el.type === "image" ? (
                      <div className="space-y-4">
                        <img
                          src={URL.createObjectURL(el.file)}
                          alt="preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <textarea
                          placeholder="Saisir la légende..."
                          value={el.caption}
                          onChange={(e) => updateCaption(el.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-sm"
                          rows={2}
                        />
                      </div>
                    ) : (
                      <textarea
                        placeholder="Saisir votre texte..."
                        value={el.content}
                        onChange={(e) =>
                          updateTextContent(el.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-sm"
                        rows={4}
                      />
                    )}
                  </div>
                ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Publier le produit
            </button>
          </form>
        </div>
      </LayoutSystem>
    </Layout>
  );
};

export default FormAddProduct;
