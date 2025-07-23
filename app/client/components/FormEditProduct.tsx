import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";

type ElementType = "image" | "text";

interface BaseElement {
  id: string;
  type: ElementType;
  order: number;
}

interface ImageElement extends BaseElement {
  type: "image";
  file?: File;
  caption: string;
  imageUrl?: string;
}

interface TextElement extends BaseElement {
  type: "text";
  content: string;
}

type FormElement = ImageElement | TextElement;

interface Product {
  id: string;
  keyword: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  idPostFacebook?: string;
  synonym?: string;
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

interface FormEditProductProps {
  product: Product;
}

const MAX_IMAGES = 10;
const MAX_TEXTS = 5;

const FormEditProduct: React.FC<FormEditProductProps> = ({ product }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(product.keyword);
  const [name, setName] = useState(product.name);
  const [idPostFacebook, setIdPostFacebook] = useState(product.idPostFacebook || "");
  const [synonym, setSynonym] = useState(product.synonym || "");
  const [elements, setElements] = useState<FormElement[]>(() =>
    product.elements.map((el) => {
      if (el.type === "text") {
        return {
          id: el.id,
          type: "text" as const,
          order: el.order,
          content: el.content || "",
        };
      } else {
        return {
          id: el.id,
          type: "image" as const,
          order: el.order,
          caption: el.caption || "",
          imageUrl: el.imageUrl || "",
        };
      }
    })
  );

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

    if (!name || !keyword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const formData = new FormData();
    formData.append("id", product.id);
    formData.append("keyword", keyword);
    formData.append("name", name);
    formData.append("createdBy", product.createdBy || "");
    formData.append("idPostFacebook", idPostFacebook);
    formData.append("synonym", synonym);

    // On prépare le tableau d'éléments pour l'API
    const structuredElements = elements.map((el) => {
      if (el.type === "image") {
        // Si l'image a été remplacée (file présent), on signale fileReplace
        return {
          id: el.id,
          type: "image",
          caption: el.caption,
          order: el.order,
          imageUrl: el.imageUrl,
          fileReplace: !!el.file,
        };
      } else {
        return {
          id: el.id,
          type: "text",
          content: el.content,
          order: el.order,
        };
      }
    });
    formData.append("elements", JSON.stringify(structuredElements));

    // Ajouter les images dans l'ordre d'apparition dans structuredElements
    structuredElements.forEach((el) => {
      if (el.type === "image" && el.fileReplace) {
        // On retrouve l'élément dans elements pour récupérer le File
        const found = elements.find(e => e.id === el.id);
        if (found && found.type === "image" && found.file) {
          formData.append("images", found.file);
        }
      }
    });

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/newproducts/${product.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        toast.success("Produit mis à jour avec succès");
        navigate("/products");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Erreur lors de la mise à jour du produit";
      toast.error(errorMessage);
    }
  };
  // Log FormData

  console.log(product.id);
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-xl mt-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Modifier le produit
      </h1>
       <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
             Mot clé principal
            <input
              type="text"
              placeholder="Saisir l'ID du produit"
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
              elements.filter((el) => el.type === "text").length >= MAX_TEXTS
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
                    value={el.order}
                    onChange={(e) => {
                      const newOrder = parseInt(e.target.value);
                      setElements((prev) =>
                        prev.map((element) =>
                          element.id === el.id
                            ? { ...element, order: newOrder }
                            : element
                        )
                      );
                    }}
                    className="w-16 px-2 py-1 text-sm border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeElement(el.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                {el.type === "text" ? (
                  <textarea
                    value={el.content}
                    onChange={(e) => updateTextContent(el.id, e.target.value)}
                    placeholder="Saisir le contenu du texte"
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                ) : (
                  <div className="space-y-4">
                    {el.imageUrl && !el.file && (
                      <div className="space-y-2">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}/${el.imageUrl}`}
                          alt="Preview"
                          className="max-w-xs rounded-lg shadow-sm"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          id={`replace-image-${el.id}`}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setElements(prev => prev.map(element =>
                                element.id === el.id && element.type === "image"
                                  ? { ...element, file, imageUrl: "" }
                                  : element
                              ));
                            }
                          }}
                        />
                        <label htmlFor={`replace-image-${el.id}`}
                          className="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded cursor-pointer hover:bg-blue-200 border border-blue-200 mt-1">
                          Modifier l'image
                        </label>
                      </div>
                    )}
                    {el.file && (
                      <img
                        src={URL.createObjectURL(el.file)}
                        alt="Preview"
                        className="max-w-xs rounded-lg shadow-sm"
                      />
                    )}
                    <input
                      type="text"
                      value={el.caption}
                      onChange={(e) => updateCaption(el.id, e.target.value)}
                      placeholder="Légende de l'image"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}
              </div>
            ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Mettre à jour
          </button>
        </div>
      </form> 
    </div>
  );
};

export default FormEditProduct;
