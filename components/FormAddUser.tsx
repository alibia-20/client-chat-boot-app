import React from "react";
import LayoutSystem from "./share/LayoutSystem";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import Layout from "./pages/Layout";
// import { useDropzone } from "react-dropzone";
import { FiTrash2 } from "react-icons/fi";
interface User {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const FormAddUser = () => {
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);

  // const handleDrop = (acceptedFiles: File[]) => {
  //   if (images.length + acceptedFiles.length > 2) return;
  //   const newImages = acceptedFiles.map((file) => ({
  //     url: URL.createObjectURL(file),
  //     name: file.name,
  //   }));
  //   setImages((prevImages) => [...prevImages, ...newImages]);
  // };

  // const { getRootProps, getInputProps } = useDropzone({
  //   onDrop: handleDrop,
  //   accept: { "image/*": [] },
  //   multiple: true,
  //   maxFiles: 1,
  // });

  const removeImage = (imageName: string) => {
    setImages(images.filter((img) => img.name !== imageName));
  };

  // Fonction pour gérer le changement des champs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔍 Fonction de validation des données
  const validateForm = (): boolean => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim()) {
      toast.error("Le nom est requis.");
      return false;
    }
    if (!email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.error("Veuillez entrer un email valide.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return false;
    }
    return true;
  };

  // Fonction pour gérer la soumission du formulaire
  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification des champs avant soumission
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        formData,

        {
          withCredentials: true,
        }
      );

      toast.success(response.data.msg || "Utilisateur ajouté avec succès !");

      // Réinitialiser le formulaire après soumission
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "employee",
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.msg || "Une erreur est survenue");
      } else if (error instanceof Error) {
        toast.error("Erreur serveur : " + error.message);
      } else {
        toast.error("Une erreur inconnue est survenue.");
      }
    }
  };
  return (
    <Layout>
      <LayoutSystem>
        <div className="p-6 max-w-2xl mx-auto relative shadow-lg top-[10%]">
          <h1 className="text-2xl font-bold mb-2">Utilisateurs</h1>
          <div className="text-sm text-gray-600 mb-4">
            Ajouter un nouvel utilisateur
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="p-4">
              <form className="space-y-4 relative" onSubmit={handleSubmit}>
                {/* IMAGE A TRAITER PLUS TARD 


            <div className=" hidden">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo de profile de l'utilisateur
                  </label>
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed p-4 text-center cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    <p>
                      Glissez-déposez vos images ici, ou cliquez pour
                      sélectionner
                    </p>
                  </div>
                </div>
                */}
                <div className="flex hidden absolute bottom-[100%] left-[70%]  justify-evenly mt-6">
                  {images.map((image) => (
                    <div key={image.name} className="relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full  h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-1  bg-red-500 text-white p-1 rounded-full"
                        onClick={() => removeImage(image.name)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                {/* IMAGE A TRAITER PLUS TARD */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Courriel(E-mail)
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="*******"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="*******"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">Administrateur</option>
                    <option value="employee">Employé</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Ajouter l'utilisateur
                </button>
              </form>
            </div>
          </div>
        </div>
      </LayoutSystem>
    </Layout>
  );
};

export default FormAddUser;
