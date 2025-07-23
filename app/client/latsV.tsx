import Layout from "./pages/Layout";
import LayoutSystem from "./share/LayoutSystem";
import { FiTrash2 } from "react-icons/fi";
import { FiMove } from "react-icons/fi";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useState } from "react";
type ElementType = "image" | "text";
interface BaseElement {
  id: string;
  type: ElementType;
}

interface ImageElement extends BaseElement {
  type: "image";
  file: File;
  caption: string;
}

interface TextElement extends BaseElement {
  type: "text";
  content: string;
}

type FormElement = ImageElement | TextElement;

const MAX_IMAGES = 10;
const MAX_TEXTS = 5;

const FormAddProduct = () => {
  const [productId, setProductId] = useState("");
  const [elements, setElements] = useState<FormElement[]>([]);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newElements: ImageElement[] = Array.from(files)
      .slice(0, MAX_IMAGES)
      .map((file) => ({
        id: `img-${file.name}-${Date.now()}`,
        type: "image",
        file,
        caption: "",
      }));
    setElements((prev) =>
      [...prev, ...newElements].slice(0, MAX_IMAGES + MAX_TEXTS)
    );
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
      setElements((prev) => [
        ...prev,
        {
          id: `text-${Date.now()}`,
          type: "text",
          content: "",
        },
      ]);
    }
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newElements = Array.from(elements);
    const [moved] = newElements.splice(result.source.index, 1);
    newElements.splice(result.destination.index, 0, moved);
    setElements(newElements);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: productId,
      elements: elements.map((el, i) => ({
        type: el.type,
        ...(el.type === "image"
          ? { imageUrl: URL.createObjectURL(el.file), caption: el.caption }
          : { content: el.content }),
        order: i + 1,
      })),
    };
    console.log("Data to send:", payload);
    // envoyer à une API ou stocker en base ici
  };
  return (
    <Layout>
      <LayoutSystem>
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Ajouter un nouveau produit
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Mot-clé ou ID du produit"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="border p-2 rounded"
              required
            />

            {/* Upload images */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
            />

            <button
              type="button"
              onClick={addTextBlock}
              disabled={
                elements.filter((el) => el.type === "text").length >= MAX_TEXTS
              }
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Ajouter un bloc texte
            </button>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="elements">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-col gap-4"
                  >
                    {elements.map((el, index) => (
                      <Draggable key={el.id} draggableId={el.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="border p-3 rounded relative bg-gray-50"
                          >
                            {/* Icône de déplacement */}
                            <div
                              {...provided.dragHandleProps}
                              className="absolute left-2 top-2 text-gray-500 cursor-grab"
                              title="Déplacer"
                            >
                              <FiMove />
                            </div>

                            {/* Bouton de suppression */}
                            <button
                              type="button"
                              onClick={() => removeElement(el.id)}
                              className="absolute top-2 right-2 text-red-600"
                            >
                              <FiTrash2 />
                            </button>

                            {/* Contenu */}
                            {el.type === "image" ? (
                              <div>
                                <img
                                  src={URL.createObjectURL(el.file)}
                                  alt="preview"
                                  className="w-32 h-32 object-cover rounded mb-2"
                                />
                                <textarea
                                  placeholder="Caption"
                                  value={el.caption}
                                  onChange={(e) =>
                                    updateCaption(el.id, e.target.value)
                                  }
                                  className="w-full p-2 border rounded resize-y"
                                />
                              </div>
                            ) : (
                              <textarea
                                placeholder="Texte"
                                value={el.content}
                                onChange={(e) =>
                                  updateTextContent(el.id, e.target.value)
                                }
                                className="w-full p-2 border rounded resize-y"
                                rows={4}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </form>
        </div>
      </LayoutSystem>
    </Layout>
  );
};

export default FormAddProduct;
