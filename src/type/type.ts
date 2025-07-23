// Interface pour l'utilisateur
// Type pour une liste de produits
export interface Product {
  id: number;
  uuid: string;
  keyword: string;
  name: string;
  price: number;
  deliveryFee: number;
  extraQuestion: string;
  images: string[];
}

export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  password: string; // ⚠️ Idéalement, ne pas exposer le mot de passe côté frontend
  role: "admin" | "user"; // Tu peux adapter en fonction des rôles possibles
  profilePicture: string;
  signupDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CREATOR {
  name: string;
  role: "admin" | "employee";
}

// Interface pour un produit
export interface Product {
  uuid: string;
  name: string;
  price: number;
  User: User; // Relation avec l'utilisateur
}

export interface Faqs {
  id: number;
  question: string;
  answer: string;
  User: CREATOR;
}

export interface UpdateProductData {
  id?: number;
  name: string;
  price: number;
  shippingFee: number;
  extraQuestions?: string;
  userId: User["id"];
  productIdOrKeyword: string;
}
export type UpdateProductDataList = {
  id?: number;
  name: string;
  price: number;
  shippingFee: number;
  extraQuestions?: string;
  userId?: User["id"];
  productIdOrKeyword: string;
};
export type ProductList = Product[];
export type UserList = User[];
export type FaqsList = Faqs[];
